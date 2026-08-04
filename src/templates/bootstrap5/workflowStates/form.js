function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

export default function(ctx) {
  let html = `<div class="formio-workflow-states-component">`;

  if (ctx.errorMessage) {
    html += `<div class="alert alert-danger" role="alert">${escapeHtml(ctx.errorMessage)}</div>`;
  }

  if (!ctx.busy && !(ctx.states || []).length && !ctx.errorMessage) {
    html += `<span class="text-muted">${ctx.t('No status yet')}</span>`;
  }
  else {
    html += `<div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;">`;
    (ctx.states || []).forEach((state, index) => {
      let badgeClass = 'badge bg-light text-dark border';
      if (state.current) {
        badgeClass = 'badge bg-primary';
      }
      else if (state.reached) {
        badgeClass = 'badge bg-secondary';
      }
      html += `<span class="${badgeClass}">${escapeHtml(state.name)}</span>`;
      if (index < ctx.states.length - 1) {
        html += `<i class="fa fa-arrow-right text-muted"></i>`;
      }
    });
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}
