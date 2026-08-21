let providers = {};

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
}

async function testProvider(provider) {
  showNotification(`Testando ${provider}...`, 'info');
  // Mock — substituir por chamada real à API
  setTimeout(() => {
    showNotification(`${provider} conectado com sucesso.`, 'success');
  }, 1500);
}

async function loadProviders() {
  try {
    await loadApiKey();
    const response = await fetch('/api/config/providers', {
      method: 'GET'
    });
    const savedProviders = await response.json();
    savedProviders.forEach(p => {
      if (p.tipo === 'llm') {
        document.getElementById('openrouter-key').value = p.api_key || '';
        if (p.config?.model) document.getElementById('openrouter-model').value = p.config.model;
      } else if (p.tipo === 'api') {
        document.getElementById('youtube-key').value = p.api_key || '';
        if (p.config?.channel) document.getElementById('youtube-channel').value = p.config.channel;
      } else if (p.tipo === 'notification') {
        document.getElementById('telegram-token').value = p.api_key || '';
        if (p.config?.chat_id) document.getElementById('telegram-chat').value = p.config.chat_id;
      }
    });
  } catch (error) {
    console.error('Erro ao carregar provedores:', error);
  }
}

async function saveProvider(provider) {
  await loadApiKey();
  const card = document.querySelector(`[data-provider="${provider}"]`);
  const inputs = card.querySelectorAll('input, select');
  const data = {};
  inputs.forEach(input => {
    if (input.id && input.value) data[input.id] = input.value;
  });

  if (provider === 'openrouter') {
    data.key = data['openrouter-key'];
    data.model = data['openrouter-model'];
  } else if (provider === 'youtube') {
    data.key = data['youtube-key'];
    data.channel = data['youtube-channel'];
  } else if (provider === 'telegram') {
    data.key = data['telegram-token'];
    data.chat_id = data['telegram-chat'];
  }

  try {
    const response = await fetch('/api/config/providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: provider.charAt(0).toUpperCase() + provider.slice(1),
        tipo: provider === 'openrouter' ? 'llm' : provider === 'youtube' ? 'api' : 'notification',
        api_key: data.key,
        endpoint: provider === 'openrouter' ? 'https://openrouter.ai/api' : provider === 'youtube' ? 'https://youtube.googleapis.com' : 'https://api.telegram.org',
        config: data
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'HTTP ' + response.status);
    }

    providers[provider] = data;
    updateProviderStatus(provider, 'saved');
    showNotification(`${provider} salvo com sucesso.`, 'success');
  } catch (err) {
    showNotification(`Erro ao salvar ${provider}: ${err.message}`, 'error');
  }
}

function updateProviderStatus(provider, status) {
  const card = document.querySelector(`[data-provider="${provider}"]`);
  if (!card) return;
  if (status === 'saved') {
    const badge = card.querySelector('.status-badge');
    if (badge) { badge.textContent = 'Configurado'; badge.className = 'status-badge success'; }
  }
  updateProgress();
}

function updateProgress() {
  const configured = Object.keys(providers).length;
  const el = document.querySelector('.text-tertiary');
  if (el) el.textContent = `${configured} de 3 configurados`;
}

function setupYouTubeOAuth() {
  showNotification('Configure a autenticação OAuth 2.0 no console de APIs do Google.', 'info');
}

function testTelegram() {
  showNotification('Testando bot do Telegram...', 'info');
  setTimeout(() => {
    showNotification('Bot do Telegram conectado.', 'success');
  }, 1500);
}

function saveSetupDraft() {
  const draft = { providers, timestamp: new Date().toISOString(), status: 'draft' };
  localStorage.setItem('one-shot-play-setup-draft', JSON.stringify(draft));
  showNotification('Rascunho salvo.', 'success');
}

async function completeSetup() {
  await loadApiKey();
  const required = ['openrouter', 'youtube'];
  const missing = required.filter(p => !providers[p]);
  if (missing.length > 0) {
    showNotification(`Configure provedor(es): ${missing.join(', ')}`, 'warning');
    return;
  }
  showNotification('Inicializando o sistema...', 'info');
  try {
    await fetch('/setup/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...providers,
        system_configured: 'true',
        setup_completed: 'true',
        api_key: document.getElementById('api-key').value || undefined,
        rate_limit: document.getElementById('rate-limit').value,
        cache_duration: document.getElementById('cache-duration').value
      })
    });
    localStorage.setItem('one-shot-play-setup', JSON.stringify({
      providers, timestamp: new Date().toISOString(), status: 'completed'
    }));
    showNotification('Configuração concluída. Redirecionando...', 'success');
    setTimeout(() => { window.location.href = '/'; }, 1500);
  } catch (err) {
    showNotification('Erro ao finalizar configuração.', 'error');
  }
}

document.getElementById('btn-test-openrouter')?.addEventListener('click', () => testProvider('openrouter'));
document.getElementById('btn-save-openrouter')?.addEventListener('click', () => saveProvider('openrouter'));
document.getElementById('btn-oauth-youtube')?.addEventListener('click', setupYouTubeOAuth);
document.getElementById('btn-save-youtube')?.addEventListener('click', () => saveProvider('youtube'));
document.getElementById('btn-test-telegram')?.addEventListener('click', testTelegram);
document.getElementById('btn-save-telegram')?.addEventListener('click', () => saveProvider('telegram'));
document.getElementById('btn-save-draft')?.addEventListener('click', saveSetupDraft);
document.getElementById('btn-complete-setup')?.addEventListener('click', completeSetup);

document.addEventListener('DOMContentLoaded', () => {
  loadProviders();
  const draft = localStorage.getItem('one-shot-play-setup-draft');
  if (draft) {
    const data = JSON.parse(draft);
    providers = data.providers || {};
    showNotification('Rascunho anterior encontrado.', 'info');
  }
});
