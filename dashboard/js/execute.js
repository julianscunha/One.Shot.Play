let selectedTemplate = null;
let executionsData = [];
let templatesData = [];

async function loadTemplates() {
  try {
    const response = await fetch('/api/templates');
    const templates = await response.json();
    templatesData = templates;
    displayTemplates(templates);
  } catch (error) {
    console.error('Erro ao carregar templates:', error);
    document.getElementById('template-grid').innerHTML =
      '<div class="loading-state"><p>Erro ao carregar templates.</p></div>';
    showNotification('Erro ao carregar templates', 'error');
  }
}

function displayTemplates(templates) {
  const grid = document.getElementById('template-grid');
  if (!templates || templates.length === 0) {
    grid.innerHTML = '<div class="loading-state"><p>Nenhum template disponível.</p></div>';
    return;
  }
  grid.innerHTML = templates.map(t => `
    <div class="template-card" data-template-id="${t.id}">
      <div class="template-card-header">
        <div class="template-icon" aria-hidden="true">${getTemplateIcon(t.tipo)}</div>
        <div>
          <h4 class="template-title">${t.nome}</h4>
          <span class="template-badge">${t.tipo === 'standard' ? 'Padrão' : t.tipo === 'quick' ? 'Rápido' : 'Detalhado'}</span>
        </div>
      </div>
      <div class="template-card-body">
        <p class="template-description">${t.descricao || 'Sem descrição.'}</p>
        <div class="template-stats">
          <div class="stat-item"><span class="stat-value">${t.uso || 0}</span><span class="stat-label">usos</span></div>
          <div class="stat-item"><span class="stat-value">$${t.custo || '0.00'}</span><span class="stat-label">custo</span></div>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn-outline" data-action="preview" data-id="${t.id}">
          Visualizar
        </button>
        <button class="btn-primary" data-action="execute" data-id="${t.id}">
          Executar
        </button>
      </div>
    </div>
  `).join('');
}

function getTemplateIcon(tipo) {
  const icons = { standard: 'YT', quick: 'Q', detailed: 'D', custom: 'C' };
  return icons[tipo] || 'T';
}

function selectTemplateAndExecute(templateId) {
  const card = document.querySelector(`[data-template-id="${templateId}"]`);
  if (card) card.classList.add('selected');
  selectedTemplate = templateId;
  executeTemplate(templateId);
}

function selectTemplateAndPreview(templateId) {
  const card = document.querySelector(`[data-template-id="${templateId}"]`);
  if (card) card.classList.add('selected');
  selectedTemplate = templateId;
  showTemplatePreview(templateId);
}

function showTemplatePreview(templateId) {
  const previews = {
    'standard': {
      title: 'Standard YouTube',
      description: 'Template padrão otimizado para canais principais. Suporte a HD e 4K, legendas automáticas e tags geradas por IA.',
      features: ['HD +4K', 'Legendas automáticas', 'Tags IA', 'SEO otimizado'],
    },
    'quick': {
      title: 'Quick Upload',
      description: 'Upload rápido e simples com configurações mínimas para publicações frequentes.',
      features: ['Upload único', 'Sem processamento IA', 'Velocidade máxima'],
    },
    'detailed': {
      title: 'Detailed YouTube',
      description: 'Template completo com processamento avançado de IA, thumbnail inteligente e descrições otimizadas.',
      features: ['Geração IA de tags', 'Thumbnail inteligente', 'Descrição SEO'],
    }
  };

  const preview = previews[templateId] || { title: 'Template', description: 'Detalhes do template.', features: [] };
  const content = document.getElementById('preview-content');
  content.innerHTML = `
    <div class="template-preview-content">
      <p>${preview.description}</p>
      <div class="template-stats">
        ${preview.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
      </div>
    </div>
  `;
  document.getElementById('preview-title').textContent = preview.title;
  const executeBtn = document.getElementById('execute-btn');
  executeBtn.onclick = () => { closeTemplatePreview(); selectTemplateAndExecute(templateId); };
  document.getElementById('template-preview').classList.add('show');
}

function closeTemplatePreview() {
  document.getElementById('template-preview').classList.remove('show');
}

async function executeTemplate(templateId) {
  if (!templateId) {
    showNotification('Selecione um template primeiro.', 'warning');
    return;
  }
  try {
    const template = templatesData.find(t => t.id === templateId);
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id: templateId, template: template?.nome, tipo: 'manual' })
    });
    const result = await response.json();
    if (result.success) {
      document.getElementById('progress-card').style.display = 'block';
      showNotification('Execução iniciada.', 'success');
      monitorExecution(result.execution.id);
    } else {
      showNotification(`Erro: ${result.error}`, 'error');
    }
  } catch (error) {
    showNotification('Erro ao iniciar execução', 'error');
  }
}

function monitorExecution(executionId) {
  const interval = setInterval(async () => {
    try {
      const response = await fetch(`/api/executions/${executionId}`);
      const execution = await response.json();
      document.getElementById('progress-fill').style.width = `${execution.progresso || 0}%`;
      document.getElementById('progress-text').textContent = `${execution.status} — ${execution.faseAtual || ''}`;
    } catch (error) {
      clearInterval(interval);
    }
  }, 2000);
}

document.getElementById('template-grid')?.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.action === 'preview') selectTemplateAndPreview(id);
  else if (btn.dataset.action === 'execute') selectTemplateAndExecute(id);
});

document.getElementById('btn-preview-close')?.addEventListener('click', closeTemplatePreview);
document.getElementById('btn-preview-back')?.addEventListener('click', closeTemplatePreview);

document.addEventListener('DOMContentLoaded', loadTemplates);
