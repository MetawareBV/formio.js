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
  const justify = ctx.component.alignment === 'left' ? 'flex-start' : 'flex-end';
  let html = `<div class="formio-workflow-component" style="display:flex;flex-direction:column;gap:0.5rem;">`;

  if (ctx.errorMessage) {
    html += `<div class="alert alert-danger" role="alert">${escapeHtml(ctx.errorMessage)}</div>`;
  }

  if (ctx.pendingAction) {
    html += `<div class="card card-body formio-workflow-pending" style="gap:0.5rem;">`;
    html += `<strong>${escapeHtml(ctx.pendingAction.name)}</strong>`;
    if (ctx.pendingAction.eligibleParty) {
      html += `<label class="form-label">${ctx.t('Actor')} (${escapeHtml(ctx.pendingAction.eligibleParty.name)})</label>`;
      html += `<select class="form-control" ref="actorSelect">`;
      html += `<option value="">${ctx.t('Select an actor')}</option>`;
      (ctx.parties || []).forEach((party) => {
        const selected = String(party.id) === String(ctx.selectedActorId) ? ' selected' : '';
        html += `<option value="${escapeHtml(party.id)}"${selected}>${escapeHtml(party.name)}</option>`;
      });
      html += `</select>`;
    }
    if (ctx.pendingAction.requireComment) {
      html += `<label class="form-label">${ctx.t('Comment')}</label>`;
      html += `<textarea class="form-control" ref="commentInput" rows="2">${escapeHtml(ctx.comment)}</textarea>`;
    }
    html += `<div style="display:flex;gap:0.5rem;">`;
    html += `<button type="button" class="btn btn-primary" ref="confirmAction" ${ctx.busy ? 'disabled' : ''}>${ctx.t('Confirm')}</button>`;
    html += `<button type="button" class="btn btn-secondary" ref="cancelAction">${ctx.t('Cancel')}</button>`;
    html += `</div></div>`;
  }
  else {
    html += `<div class="formio-workflow-actions" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:${justify};">`;
    (ctx.actions || []).forEach((action) => {
      html += `<button type="button" class="btn btn-primary" ref="actionButton" data-action-id="${escapeHtml(action.id)}" ${ctx.busy ? 'disabled' : ''}>${escapeHtml(action.name)}</button>`;
    });
    if (!ctx.busy && !(ctx.actions || []).length) {
      html += `<span class="text-muted">${ctx.t('No actions available')}</span>`;
    }
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}
