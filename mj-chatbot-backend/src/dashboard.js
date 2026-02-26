/**
 * Analytics Dashboard HTML
 * Single-page dashboard served by the Cloudflare Worker
 * Uses Chart.js from CDN for visualizations
 */

function getDashboardHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MJ Chatbot Analytics</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
  <style>
    :root {
      --primary: #2563eb;
      --primary-light: #dbeafe;
      --bg: #f8fafc;
      --card: #ffffff;
      --text: #1e293b;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --success: #22c55e;
      --warning: #f59e0b;
      --danger: #ef4444;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }

    .header {
      background: var(--primary);
      color: white;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .header h1 { font-size: 20px; font-weight: 600; }

    .header-controls {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-white {
      background: white;
      color: var(--primary);
    }
    .btn-white:hover { background: var(--primary-light); }

    .btn-outline {
      background: transparent;
      color: white;
      border: 1px solid rgba(255,255,255,0.4);
    }
    .btn-outline:hover { background: rgba(255,255,255,0.1); }
    .btn-outline.active { background: rgba(255,255,255,0.2); border-color: white; }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .loading {
      text-align: center;
      padding: 80px 20px;
      color: var(--text-muted);
      font-size: 16px;
    }

    .loading .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .error-message {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    /* Stat Cards */
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 20px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--primary);
      line-height: 1.2;
    }

    .stat-label {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .stat-change {
      font-size: 12px;
      margin-top: 8px;
    }
    .stat-change.up { color: var(--success); }
    .stat-change.down { color: var(--danger); }

    /* Charts */
    .chart-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    @media (max-width: 860px) {
      .chart-grid { grid-template-columns: 1fr; }
    }

    .chart-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 20px;
    }

    .chart-card h3 {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 16px;
      color: var(--text);
    }

    .chart-container {
      position: relative;
      height: 250px;
    }

    /* Tables */
    .table-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 24px;
    }

    .table-card h3 {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    th, td {
      text-align: left;
      padding: 10px 12px;
      border-bottom: 1px solid var(--border);
    }

    th {
      font-weight: 600;
      color: var(--text-muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    td { color: var(--text); }

    tr:last-child td { border-bottom: none; }

    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .badge-danger { background: #fef2f2; color: #991b1b; }
    .badge-warning { background: #fffbeb; color: #92400e; }
    .badge-success { background: #f0fdf4; color: #166534; }

    .empty-state {
      text-align: center;
      padding: 32px;
      color: var(--text-muted);
      font-size: 14px;
    }

    .question-text {
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Footer */
    .footer {
      text-align: center;
      padding: 24px;
      color: var(--text-muted);
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>MJ Chatbot Analytics</h1>
    <div class="header-controls">
      <button class="btn btn-outline active" data-days="7" onclick="loadData(7)">7 Days</button>
      <button class="btn btn-outline" data-days="30" onclick="loadData(30)">30 Days</button>
      <button class="btn btn-outline" data-days="90" onclick="loadData(90)">90 Days</button>
      <button class="btn btn-white" onclick="exportData('csv')">Export CSV</button>
      <button class="btn btn-white" onclick="exportData('json')">Export JSON</button>
      <button class="btn btn-white" onclick="loadData(currentDays)">Refresh</button>
    </div>
  </div>

  <div class="container" id="app">
    <div class="loading">
      <div class="spinner"></div>
      Loading analytics data...
    </div>
  </div>

  <div class="footer">
    MJ Chatbot Analytics &middot; Data refreshes on page load
  </div>

  <script>
    let currentDays = 7;
    let chartInstances = {};

    function getAuthHeader() {
      // Reuse the Basic auth that was used to load this page
      // The browser sends it automatically for same-origin requests
      return {};
    }

    async function loadData(days) {
      currentDays = days;

      // Update button states
      document.querySelectorAll('[data-days]').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.days) === days);
      });

      const app = document.getElementById('app');
      app.innerHTML = '<div class="loading"><div class="spinner"></div>Loading analytics data...</div>';

      try {
        const response = await fetch('/analytics/data?days=' + days);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        renderDashboard(data);
      } catch (error) {
        app.innerHTML = '<div class="error-message">Failed to load analytics data: ' + error.message + '</div>';
      }
    }

    function renderDashboard(data) {
      const app = document.getElementById('app');

      app.innerHTML = ''
        + renderStatCards(data)
        + renderCharts(data)
        + renderKnowledgeGaps(data)
        + renderPerformance(data)
        + renderErrors(data)
        + renderPages(data);

      // Render charts after DOM is ready
      setTimeout(function() { initCharts(data); }, 50);
    }

    function renderStatCards(data) {
      var v = data.volume;
      return '<div class="stat-grid">'
        + statCard(v.totalMessages, 'Messages', '')
        + statCard(v.sessionsWithMessages, 'Conversations', '')
        + statCard(v.avgMessagesPerSession, 'Msgs/Session', '')
        + statCard(data.performance.avgTotalTimeMs ? (data.performance.avgTotalTimeMs / 1000).toFixed(1) + 's' : 'N/A', 'Avg Response', '')
        + statCard(v.bubbleOpens, 'Bubble Opens', '')
        + statCard(v.suggestionClicks, 'Suggestion Clicks', '')
        + '</div>';
    }

    function statCard(value, label, change) {
      return '<div class="stat-card">'
        + '<div class="stat-value">' + value + '</div>'
        + '<div class="stat-label">' + label + '</div>'
        + (change ? '<div class="stat-change">' + change + '</div>' : '')
        + '</div>';
    }

    function renderCharts(data) {
      return '<div class="chart-grid">'
        + '<div class="chart-card"><h3>Messages Over Time</h3><div class="chart-container"><canvas id="volumeChart"></canvas></div></div>'
        + '<div class="chart-card"><h3>Topic Distribution</h3><div class="chart-container"><canvas id="topicChart"></canvas></div></div>'
        + '</div>';
    }

    function renderKnowledgeGaps(data) {
      if (!data.gaps || data.gaps.length === 0) {
        return '<div class="table-card"><h3>Knowledge Gaps</h3><div class="empty-state">No knowledge gaps detected yet. Questions with no RAG matches will appear here.</div></div>';
      }

      var rows = data.gaps.map(function(gap) {
        return '<tr>'
          + '<td class="question-text" title="' + escapeAttr(gap.question) + '">' + escapeHtml(gap.question) + '</td>'
          + '<td><span class="badge ' + (gap.count >= 5 ? 'badge-danger' : gap.count >= 3 ? 'badge-warning' : 'badge-success') + '">' + gap.count + 'x</span></td>'
          + '<td>' + formatDate(gap.lastSeen) + '</td>'
          + '</tr>';
      }).join('');

      return '<div class="table-card"><h3>Knowledge Gaps (Questions with No RAG Match)</h3>'
        + '<table><thead><tr><th>Question</th><th>Count</th><th>Last Seen</th></tr></thead>'
        + '<tbody>' + rows + '</tbody></table></div>';
    }

    function renderPerformance(data) {
      var p = data.performance;
      if (p.sampleSize === 0) {
        return '<div class="table-card"><h3>Performance Metrics</h3><div class="empty-state">No performance data yet.</div></div>';
      }

      return '<div class="table-card"><h3>Performance Metrics (' + p.sampleSize + ' samples)</h3>'
        + '<table><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>'
        + '<tr><td>Avg RAG Retrieval</td><td>' + p.avgRagTimeMs + 'ms</td></tr>'
        + '<tr><td>Avg AI Generation</td><td>' + p.avgAiTimeMs + 'ms</td></tr>'
        + '<tr><td>Avg Total Response</td><td>' + p.avgTotalTimeMs + 'ms</td></tr>'
        + '<tr><td>P95 Response Time</td><td>' + p.p95TotalTimeMs + 'ms</td></tr>'
        + '</tbody></table></div>';
    }

    function renderErrors(data) {
      var e = data.errors;
      if (e.totalErrors === 0) {
        return '<div class="table-card"><h3>Errors</h3><div class="empty-state">No errors recorded. Error rate: 0%</div></div>';
      }

      var typeRows = Object.entries(e.byType).map(function(entry) {
        return '<tr><td>' + escapeHtml(entry[0]) + '</td><td>' + entry[1] + '</td></tr>';
      }).join('');

      var recentRows = e.recent.map(function(err) {
        return '<tr>'
          + '<td>' + formatDate(err.timestamp) + '</td>'
          + '<td><span class="badge badge-danger">' + escapeHtml(err.type || 'unknown') + '</span></td>'
          + '<td class="question-text">' + escapeHtml(err.message || '') + '</td>'
          + '</tr>';
      }).join('');

      return '<div class="table-card"><h3>Errors (Rate: ' + e.errorRate + ')</h3>'
        + '<table><thead><tr><th>Type</th><th>Count</th></tr></thead><tbody>' + typeRows + '</tbody></table>'
        + (recentRows ? '<h3 style="margin-top:16px">Recent Errors</h3><table><thead><tr><th>Time</th><th>Type</th><th>Message</th></tr></thead><tbody>' + recentRows + '</tbody></table>' : '')
        + '</div>';
    }

    function renderPages(data) {
      if (!data.pages || data.pages.length === 0) {
        return '';
      }

      var rows = data.pages.map(function(p) {
        return '<tr><td>' + escapeHtml(p.page) + '</td><td>' + p.count + '</td></tr>';
      }).join('');

      var refRows = (data.referrers || []).map(function(r) {
        return '<tr><td>' + escapeHtml(r.source) + '</td><td>' + r.count + '</td></tr>';
      }).join('');

      return '<div class="chart-grid">'
        + '<div class="table-card"><h3>Top Pages</h3><table><thead><tr><th>Page</th><th>Events</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
        + (refRows ? '<div class="table-card"><h3>Traffic Sources</h3><table><thead><tr><th>Source</th><th>Events</th></tr></thead><tbody>' + refRows + '</tbody></table></div>' : '')
        + '</div>';
    }

    function initCharts(data) {
      // Destroy existing charts
      Object.values(chartInstances).forEach(function(c) { c.destroy(); });
      chartInstances = {};

      // Volume chart (line)
      var volumeCtx = document.getElementById('volumeChart');
      if (volumeCtx && data.daily) {
        chartInstances.volume = new Chart(volumeCtx, {
          type: 'line',
          data: {
            labels: data.daily.map(function(d) { return d.date.slice(5); }),
            datasets: [{
              label: 'Messages',
              data: data.daily.map(function(d) { return d.message_sent || 0; }),
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 2
            }, {
              label: 'Bubble Opens',
              data: data.daily.map(function(d) { return d.bubble_opened || 0; }),
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: false,
              tension: 0.3,
              pointRadius: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: {
              y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
          }
        });
      }

      // Topic chart (doughnut)
      var topicCtx = document.getElementById('topicChart');
      if (topicCtx && data.topics && data.topics.length > 0) {
        var colors = ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
        chartInstances.topic = new Chart(topicCtx, {
          type: 'doughnut',
          data: {
            labels: data.topics.map(function(t) { return t.topic; }),
            datasets: [{
              data: data.topics.map(function(t) { return t.count; }),
              backgroundColor: colors.slice(0, data.topics.length)
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'right', labels: { font: { size: 12 } } }
            }
          }
        });
      } else if (topicCtx) {
        topicCtx.parentElement.innerHTML = '<div class="empty-state">No topic data yet</div>';
      }
    }

    function exportData(format) {
      window.location.href = '/analytics/export?format=' + format + '&days=' + currentDays;
    }

    function formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      var d = new Date(dateStr);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }

    function escapeHtml(str) {
      if (!str) return '';
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    function escapeAttr(str) {
      if (!str) return '';
      return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Load initial data
    loadData(7);
  </script>
</body>
</html>`;
}

module.exports = { getDashboardHTML };
