const FIELD_IDS = ['channel-name', 'upload-quality', 'upload-visibility', 'api-key',
  'session-timeout', 'enable-logging', 'max-retries', 'retry-delay', 'timeout'];

async function loadSettings() {
  try {
    await loadApiKey();
    const response = await fetch('/api/config');
    const config = await response.json();
    for (const id of FIELD_IDS) {
      const el = document.getElementById(id);
      if (el && config[id] !== undefined) el.value = config[id];
    }
  } catch (error) {
    showNotification('Erro ao carregar configurações.', 'error');
  }
}

async function saveSettings() {
  const body = {};
  for (const id of FIELD_IDS) {
    const el = document.getElementById(id);
    if (el) body[id] = el.value;
  }
  try {
    const response = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('Falha ao salvar');
    showNotification('Configurações salvas com sucesso.', 'success');
  } catch (error) {
    showNotification('Erro ao salvar configurações.', 'error');
  }
}

function resetSettings() {
  if (confirm('Restaurar as configurações padrão? Esta ação não pode ser desfeita.')) {
    document.querySelectorAll('main input, main select').forEach(el => {
      el.value = el.defaultValue || (el.options && el.options[0] ? el.options[0].value : '');
    });
    saveSettings();
    showNotification('Configurações restauradas para o padrão.', 'info');
  }
}

document.getElementById('btn-reset')?.addEventListener('click', resetSettings);
document.getElementById('btn-save')?.addEventListener('click', saveSettings);
document.addEventListener('DOMContentLoaded', loadSettings);
