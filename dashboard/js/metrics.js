let chart = null;
let metricsCache = {};

const chartColors = {
  accent: '#2563EB',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444'
};

async function loadMetrics() {
  try {
    const period = document.getElementById('time-range').value;
    const [metricsRes, templatesRes, apisRes] = await Promise.all([
      fetch(`/api/metrics?periodo=${period}`),
      fetch(`/api/metrics/templates?periodo=${period}`),
      fetch(`/api/metrics/apis?periodo=${period}`)
    ]);

    metricsCache = {
      metrics: await metricsRes.json(),
      templates: await templatesRes.json(),
      apis: await apisRes.json()
    };

    updateMetricsDisplay();
    renderChart();
    updateTables();
  } catch (error) {
    console.error('Erro ao carregar métricas:', error);
    showNotification('Erro ao carregar métricas', 'error');
  }
}

function updateMetricsDisplay() {
  const d = metricsCache.metrics || {};
  document.getElementById('total-executions').textContent = d.total || 0;
  document.getElementById('success-rate').textContent = `${d.successRate ?? '0%'}`;
  document.getElementById('avg-time').textContent = `${d.avgTime ?? 0}s`;
  document.getElementById('total-cost').textContent = `$${(d.totalCost || 0).toFixed(2)}`;
}

function renderChart() {
  const ctx = document.getElementById('executionsChart').getContext('2d');
  const data = metricsCache.metrics?.dailyExecutions || [0,0,0,0,0,0,0];

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
      datasets: [{
        label: 'Execuções',
        data,
        borderColor: chartColors.accent,
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, color: '#A1A1AA' },
          grid: { color: '#27272A' }
        },
        x: {
          ticks: { color: '#A1A1AA' },
          grid: { display: false }
        }
      }
    }
  });
}

function updateTables() {
  const tbody1 = document.getElementById('templates-table-body');
  tbody1.innerHTML = (metricsCache.templates || []).map(t => {
    const rate = t.taxaSucesso || 0;
    const rateClass = rate >= 95 ? 'success' : rate >= 80 ? 'warning' : 'error';
    return `
      <tr>
        <td><strong>${t.nome}</strong></td>
        <td>${t.execucoes || 0}</td>
        <td><span class="status-badge ${rateClass}">${rate}%</span></td>
        <td>${t.taxaErro ?? 0}%</td>
        <td>${t.tempoMedio ?? 0}s</td>
        <td>$${(t.custoTotal || 0).toFixed(2)}</td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="6" class="loading-cell">Sem dados</td></tr>';

  const tbody2 = document.getElementById('apis-table-body');
  tbody2.innerHTML = (metricsCache.apis || []).map(a => {
    const uptimeColor = a.uptime >= 99.9 ? 'success' : a.uptime >= 99 ? 'warning' : 'error';
    return `
      <tr>
        <td><strong>${a.provedor}</strong></td>
        <td>${a.requisicoes || 0}</td>
        <td>${a.taxaErro ?? 0}%</td>
        <td>$${(a.custo || 0).toFixed(2)}</td>
        <td>
          <div class="status-indicator">
            <span class="status-dot ${uptimeColor}"></span>
            <span>${a.uptime || 0}%</span>
          </div>
        </td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="5" class="loading-cell">Sem dados</td></tr>';
}

function refreshMetrics() {
  showNotification('Atualizando métricas…', 'info');
  loadMetrics();
}

document.getElementById('time-range')?.addEventListener('change', loadMetrics);
document.getElementById('btn-refresh')?.addEventListener('click', refreshMetrics);
document.addEventListener('DOMContentLoaded', loadMetrics);
