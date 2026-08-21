async function loadDashboardData() {
  await loadApiKey();
  try {
    const [execRes, metricsRes] = await Promise.all([
      fetch('/api/executions'),
      fetch('/api/metrics')
    ]);

    const executions = await execRes.json();
    const metrics = await metricsRes.json();

    updateExecutionsList(executions);
    updateMetricsSummary(metrics);
  } catch (error) {
    console.error('Error loading dashboard:', error);
    showNotification('Erro ao carregar dados do dashboard', 'error');
  }
}

function updateExecutionsList(executions) {
  const container = document.getElementById('executions-list');
  if (!executions || executions.length === 0) {
    container.innerHTML = `
      <div class="loading-state">
        <p>Nenhuma execução encontrada.</p>
      </div>
    `;
    return;
  }
  container.innerHTML = executions.slice(0, 5).map(e => {
    const statusClass = e.status === 'success' ? 'success'
                     : e.status === 'error' ? 'error'
                     : e.status === 'running' ? 'running'
                     : 'pending';
    return `
      <div class="execution-item">
        <span class="execution-status ${statusClass}">${e.status}</span>
        <div class="execution-info">
          <strong>${e.template}</strong>
          <span>${new Date(e.timestamp).toLocaleString('pt-BR')}</span>
        </div>
      </div>
    `;
  }).join('');
}

function updateMetricsSummary(metrics) {
  const container = document.getElementById('metrics-summary');
  container.innerHTML = `
    <div class="metric-item">
      <span>Total de execuções</span>
      <span class="metric-value">${metrics.total || 0}</span>
    </div>
    <div class="metric-item">
      <span>Taxa de sucesso</span>
      <span class="metric-value">${metrics.taxaSucesso || 0}%</span>
    </div>
    <div class="metric-item">
      <span>Custo total</span>
      <span class="metric-value">$${(metrics.custoTotal || 0).toFixed(2)}</span>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', loadDashboardData);
