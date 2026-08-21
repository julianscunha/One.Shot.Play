let _apiKey = "";
let _apiKeyPromise = null;
const _origFetch = window.fetch;
function loadApiKey() {
  if (_apiKeyPromise) return _apiKeyPromise;
  _apiKeyPromise = _origFetch("/api/config/browser-key").then(r => r.json()).then(k => { _apiKey = k.apiKey || ""; }).catch(() => { _apiKey = ""; });
  return _apiKeyPromise;
}
window.fetch = async function(url, options) {
  options = options || {};
  options.headers = options.headers || {};
  await loadApiKey();
  if (_apiKey) options.headers["x-api-key"] = _apiKey;
  return _origFetch(url, options);
};
loadApiKey();

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  if (!container) return;
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  const span = document.createElement('span');
  span.className = 'notification-message';
  span.textContent = message;
  const btn = document.createElement('button');
  btn.className = 'notification-close';
  btn.type = 'button';
  btn.innerHTML = '&times;';
  btn.addEventListener('click', () => notification.remove());
  notification.appendChild(span);
  notification.appendChild(btn);
  container.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}
