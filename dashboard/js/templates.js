let templatesData = [];
let editingId = null;

async function loadTemplates() {
  try {
    await loadApiKey();
    const response = await fetch('/api/templates');
    templatesData = await response.json();
    updateStats();
    displayTemplates(templatesData);
  } catch (error) {
    console.error('Erro ao carregar templates:', error);
    showNotification('Erro ao carregar templates', 'error');
  }
}

function updateStats() {
  const total = templatesData.length;
  const youtube = templatesData.filter(t => t.tipo === 'standard').length;
  const quick = templatesData.filter(t => t.tipo === 'quick').length;
  const usageRate = total > 0
    ? ((templatesData.reduce((s, t) => s + (t.uso || 0), 0) / (total * 10)) * 100).toFixed(0)
    : 0;
  document.getElementById('total-templates').textContent = total;
  document.getElementById('youtube-templates').textContent = youtube;
  document.getElementById('quick-templates').textContent = quick;
  document.getElementById('usage-rate').textContent = `${usageRate}%`;
}

function displayTemplates(templates) {
  const grid = document.getElementById('templates-grid');
  if (!templates || templates.length === 0) {
    grid.innerHTML = '<div class="loading-state"><p>Nenhum template encontrado.</p></div>';
    return;
  }
  grid.innerHTML = templates.map(t => `
    <div class="template-card ${t.uso > 0 ? 'used' : ''}">
      <div class="template-card-header">
        <div class="template-icon">${getTemplateTypeIcon(t.tipo)}</div>
        <div>
          <h4 class="template-title">${t.nome}</h4>
          <span class="template-badge ${t.tipo}">${t.tipo === 'standard' ? 'Padrão' : t.tipo === 'quick' ? 'Rápido' : 'Detalhado'}</span>
        </div>
      </div>
      <div class="template-card-body">
        <p class="template-description">${t.descricao || 'Sem descrição.'}</p>
        <div class="template-stats">
          <div class="stat-item"><span class="stat-value">${t.uso || 0}</span><span class="stat-label">usos</span></div>
          <div class="stat-item"><span class="stat-value">$${t.custo || '0.00'}</span><span class="stat-label">custo</span></div>
          <div class="stat-item"><span class="stat-value">${t.tempoMedio || 0}s</span><span class="stat-label">média</span></div>
        </div>
      </div>
      <div class="template-card-footer">
        <button class="template-action-btn" data-action="view" data-id="${t.id}" title="Ver detalhes">
          <span>Ver</span>
        </button>
        <button class="template-action-btn" data-action="edit" data-id="${t.id}" title="Editar">
          <span>Editar</span>
        </button>
        <button class="template-action-btn" data-action="delete" data-id="${t.id}" title="Excluir">
          <span>Excluir</span>
        </button>
      </div>
    </div>
  `).join('');
}

const typeIcons = { standard: 'YT', quick: 'Q', detailed: 'D', custom: 'C' };
function getTemplateTypeIcon(tipo) { return typeIcons[tipo] || 'T'; }

function showTemplateModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Novo Template';
  document.getElementById('template-form').reset();
  document.getElementById('template-modal').classList.add('show');
}
function closeTemplateModal() {
  document.getElementById('template-modal').classList.remove('show');
}

function viewTemplateDetails(id) {
  const t = templatesData.find(t => t.id === id);
  if (!t) return;
  showNotification(`${t.nome} — ${t.tipo} — ${t.descricao || 'sem descrição'}`, 'info');
}

function editTemplate(id) {
  const t = templatesData.find(t => t.id === id);
  if (!t) return;
  editingId = id;
  document.getElementById('modal-title').textContent = 'Editar Template';
  document.getElementById('template-name').value = t.nome || '';
  document.getElementById('template-type').value = t.tipo || '';
  document.getElementById('template-language').value = t.idioma || '';
  document.getElementById('template-description').value = t.descricao || '';
  document.getElementById('template-settings').value = t.config ? JSON.stringify(t.config, null, 2) : '';
  document.getElementById('template-modal').classList.add('show');
}

async function deleteTemplate(id) {
  if (!confirm('Excluir este template?')) return;
  try {
    const response = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Falha ao excluir');
    showNotification('Template excluído.', 'warning');
    loadTemplates();
  } catch (error) {
    showNotification('Erro ao excluir template.', 'error');
  }
}

function exportTemplates() {
  const blob = new Blob([JSON.stringify(templatesData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `templates-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotification('Templates exportados.', 'success');
}

function applyFilters() {
  const type = document.getElementById('filter-type').value;
  const lang = document.getElementById('filter-language').value;
  const search = document.getElementById('filter-search').value.toLowerCase();
  const filtered = templatesData.filter(t =>
    (!type || t.tipo === type) &&
    (!lang || t.idioma === lang) &&
    (!search || (t.nome || '').toLowerCase().includes(search) || (t.descricao || '').toLowerCase().includes(search))
  );
  displayTemplates(filtered);
}

document.getElementById('btn-export')?.addEventListener('click', exportTemplates);
document.getElementById('btn-new-template')?.addEventListener('click', showTemplateModal);
document.getElementById('btn-modal-close')?.addEventListener('click', closeTemplateModal);
document.getElementById('btn-modal-cancel')?.addEventListener('click', closeTemplateModal);

document.getElementById('templates-grid')?.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.action === 'view') viewTemplateDetails(id);
  else if (btn.dataset.action === 'edit') editTemplate(id);
  else if (btn.dataset.action === 'delete') deleteTemplate(id);
});

document.getElementById('template-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  let config;
  const rawSettings = document.getElementById('template-settings').value.trim();
  try {
    config = rawSettings ? JSON.parse(rawSettings) : {};
  } catch (error) {
    showNotification('JSON de configurações inválido.', 'error');
    return;
  }
  const body = {
    nome: document.getElementById('template-name').value,
    tipo: document.getElementById('template-type').value,
    idioma: document.getElementById('template-language').value,
    descricao: document.getElementById('template-description').value,
    config
  };
  try {
    const response = await fetch(editingId ? `/api/templates/${editingId}` : '/api/templates', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('Falha ao salvar');
    closeTemplateModal();
    loadTemplates();
    showNotification(editingId ? 'Template atualizado.' : 'Template criado.', 'success');
  } catch (error) {
    showNotification('Erro ao salvar template.', 'error');
  }
});

document.getElementById('filter-type')?.addEventListener('change', applyFilters);
document.getElementById('filter-language')?.addEventListener('change', applyFilters);
document.getElementById('filter-search')?.addEventListener('input', () => {
  setTimeout(applyFilters, 300);
});

document.addEventListener('DOMContentLoaded', loadTemplates);
