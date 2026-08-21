let allLogs = [];

async function loadLogs() {
  try {
    await loadApiKey();
    const url = new URL('/api/logs', window.location.origin);
    const nivel = document.getElementById('filter-nivel').value;
    const servico = document.getElementById('filter-servico').value;
    if (nivel) url.searchParams.append('nivel', nivel);
    if (servico) url.searchParams.append('servico', servico);

    const response = await fetch(url);
    allLogs = await response.json();
    updateLogStats();
    displayLogs(allLogs);
  } catch (error) {
    console.error('Erro ao carregar logs:', error);
    showNotification('Erro ao carregar logs', 'error');
  }
}

function applyFilters() { loadLogs(); }

function clearFilters() {
  document.getElementById('filter-nivel').value = '';
  document.getElementById('filter-servico').value = '';
  document.getElementById('filter-search').value = '';
  loadLogs();
}

function updateLogStats() {
  document.getElementById('total-logs').textContent = allLogs.length;
  document.getElementById('error-logs').textContent = allLogs.filter(l => l.nivel === 'error').length;
  document.getElementById('warning-logs').textContent = allLogs.filter(l => l.nivel === 'warn').length;
  document.getElementById('info-logs').textContent = allLogs.filter(l => l.nivel === 'info').length;
}

function displayLogs(logs) {
  const search = document.getElementById('filter-search')?.value.toLowerCase() || '';
  const filtered = search ? logs.filter(log =>
    (log.mensagem || '').toLowerCase().includes(search) ||
    (log.servico || '').toLowerCase().includes(search)) : logs;

  document.getElementById('logs-list').innerHTML = filtered.length === 0
    ? '<div class="loading-state"><p>Nenhum log encontrado.</p></div>'
    : filtered.map(log => {
        const statusClass = log.nivel === 'error' ? 'error'
                         : log.nivel === 'warn' ? 'warning'
                         : log.nivel === 'info' ? 'info'
                         : 'neutral';
        return `
          <div class="log-item" data-id="${log.id}">
            <span class="status-badge ${statusClass}">${log.nivel}</span>
            <span class="log-timestamp">${new Date(log.createdAt).toLocaleString('pt-BR')}</span>
            <span class="text-tertiary">[${log.servico}]</span>
            <span class="log-message">${log.mensagem}</span>
          </div>
        `;
      }).join('');
}

function showLogDetail(log) {
  document.getElementById('modal-title').textContent = `Detalhes — ${log.servico}`;
  document.getElementById('log-detail-content').innerHTML = `
    <div class="log-detail-item">
      <div class="detail-row"><span class="text-secondary">Nível:</span> <strong>${log.nivel.toUpperCase()}</strong></div>
      <div class="detail-row"><span class="text-secondary">Serviço:</span> <strong>${log.servico}</strong></div>
      <div class="detail-row"><span class="text-secondary">Timestamp:</span> <strong>${new Date(log.createdAt).toLocaleString('pt-BR')}</strong></div>
      <div class="detail-row"><span class="text-secondary">Mensagem:</span></div>
      <pre class="log-detail-message">${log.mensagem}</pre>
    </div>
  `;
  document.getElementById('log-detail-modal').classList.add('show');
}

function closeLogDetail() {
  document.getElementById('log-detail-modal').classList.remove('show');
}

function exportLogs() {
  const blob = new Blob([JSON.stringify(allLogs, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotification('Logs exportados.', 'success');
}

document.getElementById('btn-reload-logs')?.addEventListener('click', loadLogs);
document.getElementById('btn-export-logs')?.addEventListener('click', exportLogs);
document.getElementById('btn-apply-filters')?.addEventListener('click', applyFilters);
document.getElementById('btn-clear-filters')?.addEventListener('click', clearFilters);
document.getElementById('btn-close-log-detail')?.addEventListener('click', closeLogDetail);

document.getElementById('logs-list')?.addEventListener('click', (e) => {
  const item = e.target.closest('.log-item[data-id]');
  if (!item) return;
  const log = allLogs.find(l => String(l.id) === item.dataset.id);
  if (log) showLogDetail(log);
});

document.addEventListener('DOMContentLoaded', loadLogs);
