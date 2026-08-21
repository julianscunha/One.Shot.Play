let schedulesData = [];
let editingId = null;

async function loadSchedules() {
  try {
    await loadApiKey();
    const url = new URL('/api/schedules', window.location.origin);
    document.getElementById('filter-status').value && url.searchParams.append('status', document.getElementById('filter-status').value);
    document.getElementById('filter-template').value && url.searchParams.append('template', document.getElementById('filter-template').value);
    const response = await fetch(url);
    schedulesData = await response.json();
    updateStats();
    displaySchedules(schedulesData);
  } catch (error) {
    console.error('Erro ao carregar agendamentos:', error);
    showNotification('Erro ao carregar agendamentos', 'error');
  }
}

function updateStats() {
  const total = schedulesData.length;
  const active = schedulesData.filter(s => s.ativo).length;
  const next = schedulesData.filter(s => s.ativo).sort((a, b) => new Date(a.proximo) - new Date(b.proximo))[0];
  const rate = total > 0
    ? (schedulesData.filter(s => s.ultimaExecucao === 'concluido').length / total * 100).toFixed(0)
    : '0';
  document.getElementById('total-schedules').textContent = total;
  document.getElementById('active-schedules').textContent = active;
  document.getElementById('next-execution').textContent = next
    ? new Date(next.proximo).toLocaleTimeString('pt-BR') : '--:--';
  document.getElementById('success-rate').textContent = `${rate}%`;
}

function displaySchedules(schedules) {
  const grid = document.getElementById('schedules-grid');
  if (!schedules || schedules.length === 0) {
    grid.innerHTML = '<div class="loading-state"><p>Nenhum agendamento com os filtros aplicados.</p></div>';
    return;
  }
  grid.innerHTML = schedules.map(s => `
    <div class="schedule-card ${s.ativo ? 'active' : 'inactive'}">
      <div class="schedule-card-header">
        <h4 class="schedule-title">${esc(s.nome)}</h4>
        <span class="status-badge ${s.ativo ? 'success' : 'neutral'}">
          ${s.ativo ? 'Ativo' : 'Inativo'}
        </span>
      </div>
      <div class="schedule-card-body">
        <div class="schedule-details">
          <div class="schedule-detail"><span class="text-tertiary">Template:</span> <strong>${esc(s.template)}</strong></div>
          <div class="schedule-detail"><span class="text-tertiary">Frequência:</span> <strong>${esc(s.frequencia)}</strong></div>
          <div class="schedule-detail"><span class="text-tertiary">Próximo:</span> <strong>${s.proximo ? new Date(s.proximo).toLocaleString('pt-BR') : '—'}</strong></div>
          <div class="schedule-detail"><span class="text-tertiary">Última execução:</span> <strong>${esc(s.ultimaExecucao || 'Nunca')}</strong></div>
          <div class="schedule-detail"><span class="text-tertiary">Custo:</span> <strong>$${(s.custo || 0).toFixed(2)}</strong></div>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn-outline" data-action="edit" data-id="${esc(s.id)}">Editar</button>
        <button class="btn-secondary" data-action="toggle" data-id="${esc(s.id)}" data-ativo="${s.ativo}">
          ${s.ativo ? 'Pausar' : 'Ativar'}
        </button>
        <button class="btn-text" data-action="delete" data-id="${esc(s.id)}">Excluir</button>
      </div>
    </div>
  `).join('');
}

function showScheduleModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Novo Agendamento';
  document.getElementById('schedule-form').reset();
  document.getElementById('schedule-modal').classList.add('show');
}
function closeScheduleModal() { document.getElementById('schedule-modal').classList.remove('show'); }

function editSchedule(id) {
  const s = schedulesData.find(x => x.id === id);
  if (!s) return;
  editingId = id;
  document.getElementById('modal-title').textContent = 'Editar Agendamento';
  document.getElementById('schedule-name').value = s.nome || '';
  document.getElementById('schedule-template').value = s.template_id || '';
  document.getElementById('schedule-frequency').value = s.frequencia || '';
  document.getElementById('schedule-time').value = s.hora || '';
  document.getElementById('schedule-enabled').value = s.ativo ? 'true' : 'false';
  document.getElementById('schedule-description').value = s.descricao || '';
  document.getElementById('schedule-modal').classList.add('show');
}

async function toggleSchedule(id, enable) {
  try {
    const response = await fetch(`/api/schedules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativo: enable })
    });
    if (!response.ok) throw new Error('Falha ao atualizar');
    showNotification(`${enable ? 'Ativado' : 'Pausado'}`, enable ? 'success' : 'warning');
    loadSchedules();
  } catch (error) {
    showNotification('Erro ao atualizar agendamento.', 'error');
  }
}

async function deleteSchedule(id) {
  if (!confirm('Excluir este agendamento?')) return;
  try {
    const response = await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Falha ao excluir');
    showNotification('Agendamento excluído.', 'warning');
    loadSchedules();
  } catch (error) {
    showNotification('Erro ao excluir agendamento.', 'error');
  }
}

document.getElementById('btn-new-schedule')?.addEventListener('click', showScheduleModal);
document.getElementById('btn-modal-close')?.addEventListener('click', closeScheduleModal);
document.getElementById('btn-modal-cancel')?.addEventListener('click', closeScheduleModal);

document.getElementById('schedules-grid')?.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.action === 'edit') editSchedule(id);
  else if (btn.dataset.action === 'toggle') toggleSchedule(id, btn.dataset.ativo !== 'true');
  else if (btn.dataset.action === 'delete') deleteSchedule(id);
});

document.getElementById('schedule-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const body = {
    nome: document.getElementById('schedule-name').value,
    template_id: document.getElementById('schedule-template').value,
    frequencia: document.getElementById('schedule-frequency').value,
    hora: document.getElementById('schedule-time').value,
    ativo: document.getElementById('schedule-enabled').value === 'true',
    descricao: document.getElementById('schedule-description').value
  };
  try {
    const response = await fetch(editingId ? `/api/schedules/${editingId}` : '/api/schedules', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('Falha ao salvar');
    closeScheduleModal();
    loadSchedules();
    showNotification(editingId ? 'Agendamento atualizado.' : 'Agendamento criado.', 'success');
  } catch (error) {
    showNotification('Erro ao salvar agendamento.', 'error');
  }
});

document.getElementById('filter-status')?.addEventListener('change', loadSchedules);
document.getElementById('filter-template')?.addEventListener('change', loadSchedules);

document.addEventListener('DOMContentLoaded', () => {
  loadSchedules();
  setInterval(loadSchedules, 30000);
});
