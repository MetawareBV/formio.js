function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

function formatDate(value) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? escapeHtml(value) : date.toLocaleString();
}

export default function(ctx) {
  let html = `<div class="formio-workflow-history-component" style="padding:0.75rem 0;">`;

  if (ctx.errorMessage) {
    html += `<div class="alert alert-danger" role="alert">${escapeHtml(ctx.errorMessage)}</div>`;
  }

  if (!ctx.busy && !(ctx.history || []).length && !ctx.errorMessage) {
    html += `<span class="text-muted">${ctx.t('No history yet')}</span>`;
  }
  else if ((ctx.history || []).length) {
    html += `<table class="table table-sm">`;
    html += `<thead><tr>`;
    html += `<th>${ctx.t('Status')}</th>`;
    html += `<th>${ctx.t('Actor')}</th>`;
    html += `<th>${ctx.t('Action')}</th>`;
    html += `<th>${ctx.t('When')}</th>`;
    html += `<th>${ctx.t('Comment')}</th>`;
    html += `</tr></thead><tbody>`;
    (ctx.history || []).forEach((entry) => {
      const isCurrent = !entry.completedAt;
      const statusName = ctx.statusNames?.[entry.status] || entry.status;
      html += `<tr${isCurrent ? ' class="table-active"' : ''}>`;
      html += `<td>${escapeHtml(statusName)}</td>`;
      html += `<td>${escapeHtml(entry.assignee ? entry.assignee.name : '')}</td>`;
      html += `<td>${escapeHtml(entry.action)}</td>`;
      html += `<td>${formatDate(entry.startedAt)}</td>`;
      html += `<td>${escapeHtml(entry.comment)}</td>`;
      html += `</tr>`;
    });
    html += `</tbody></table>`;
  }

  html += `</div>`;
  return html;
}
