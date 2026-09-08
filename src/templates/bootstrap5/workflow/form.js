function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

/**
 * Lucide's `workflow` glyph, inlined. The app's zone opens with this exact icon and the bootstrap5
 * templates have no icon set that carries it (font-awesome's nearest, `random`, is a different
 * shape). 14px is lucide's `size-3.5`.
 */
const WORKFLOW_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"'
  + ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
  + ' style="flex-shrink:0;color:var(--muted-foreground,var(--bs-secondary-color,#6c757d));" aria-hidden="true">'
  + '<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/>'
  + '<rect width="8" height="8" x="13" y="13" rx="2"/></svg>';

/**
 * The app's `text-kicker` token (globals.css): small, letter-spaced, bold and uppercase. Read from
 * the host page's custom properties where they exist -- so a form embedded in the app follows the
 * user's font-size setting -- with the token's own values as fallback for a form rendered outside
 * it (the builder preview, tests).
 */
const KICKER_STYLE = 'font-size:var(--text-kicker,0.6875rem);line-height:1.2;letter-spacing:0.09em;'
  + 'font-weight:700;text-transform:uppercase;color:var(--muted-foreground,var(--bs-secondary-color,#6c757d));'
  + 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';

const SPINNER = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>';

/**
 * The workflow zone, laid out like `WorkflowActionButtons` in the app that renders the form
 * (frontend/components/workflow/workflow-action-buttons.tsx): the workflow icon, the status the
 * registration is in and the action buttons on one line, with an accent line under exactly that
 * line. The line is what marks the zone off -- it says these buttons take you out of *this* status
 * into a next one, where a border around them would put them in a box of their own.
 *
 * The status label sits at the bottom of the line (`align-self:flex-end`) so it sits tight above
 * the accent line, and keeps double the gap to the first button: it is a label, not an action, and
 * should not read as the first one.
 */
export default function(ctx) {
  const justify = ctx.component.alignment === 'left' ? 'flex-start' : 'flex-end';
  const actions = ctx.actions || [];
  let html = '<div class="formio-workflow-component" style="display:flex;flex-direction:column;gap:0.5rem;">';

  if (ctx.errorMessage) {
    html += `<div class="alert alert-danger" role="alert">${escapeHtml(ctx.errorMessage)}</div>`;
  }

  // The zone itself stays put while an action is being confirmed below it: the status and the
  // accent line are what the form always shows for its workflow, not part of one action's flow.
  // `margin-bottom` leaves room for the accent line, which hangs below the row rather than being
  // a `border-bottom` -- padding above a border would make the row taller than its own buttons.
  html += `<div class="formio-workflow-actions" style="position:relative;display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;justify-content:${justify};margin-bottom:0.625rem;">`;
  html += '<div class="formio-workflow-status" style="display:flex;align-items:center;align-self:flex-end;gap:0.375rem;min-width:0;padding-right:1.5rem;">';
  html += WORKFLOW_ICON;
  html += `<span style="${KICKER_STYLE}">${escapeHtml(ctx.statusName || ctx.t('Workflow'))}</span>`;
  html += '</div>';
  actions.forEach((action) => {
    const executing = ctx.executingActionId && String(ctx.executingActionId) === String(action.id);
    const disabled = ctx.busy || ctx.pendingAction ? ' disabled' : '';
    html += `<button type="button" class="btn btn-outline-secondary" ref="actionButton" data-action-id="${escapeHtml(action.id)}"${disabled}>${executing ? SPINNER : ''}${escapeHtml(action.name)}</button>`;
  });
  if (!ctx.busy && !ctx.pendingAction && !actions.length) {
    html += `<span class="text-muted">${ctx.t('No actions available')}</span>`;
  }
  if (actions.length) {
    html += '<span aria-hidden="true" style="position:absolute;left:0;right:0;bottom:-0.5rem;height:2px;border-radius:9999px;background:var(--primary,var(--bs-primary,#0d6efd));"></span>';
  }
  html += '</div>';

  // The app asks for a comment and for the actor(s) in a dialog. A form component has no dialog to
  // put them in, so they stay inline right under the zone -- same fields, same order, and the same
  // footer (cancel left of confirm, confirm being the only filled button on the row).
  if (ctx.pendingAction) {
    html += '<div class="card card-body formio-workflow-pending" style="gap:0.5rem;">';
    html += `<strong>${escapeHtml(ctx.pendingAction.name)}</strong>`;
    if (ctx.pendingAction.requireComment) {
      html += `<label class="form-label">${ctx.t('Comment')}<span class="text-danger"> *</span></label>`;
      html += `<textarea class="form-control" ref="commentInput" rows="3">${escapeHtml(ctx.comment)}</textarea>`;
    }
    if (ctx.pendingAction.eligibleParty) {
      html += `<label class="form-label">${ctx.t('Actor')} (${escapeHtml(ctx.pendingAction.eligibleParty.name)})</label>`;
      html += '<select class="form-control" ref="actorSelect">';
      html += `<option value="">${ctx.t('Select an actor')}</option>`;
      (ctx.parties || []).forEach((party) => {
        const selected = String(party.id) === String(ctx.selectedActorId) ? ' selected' : '';
        html += `<option value="${escapeHtml(party.id)}"${selected}>${escapeHtml(party.name)}</option>`;
      });
      html += '</select>';
    }
    html += '<div style="display:flex;gap:0.5rem;justify-content:flex-end;">';
    html += `<button type="button" class="btn btn-outline-secondary" ref="cancelAction"${ctx.busy ? ' disabled' : ''}>${ctx.t('Cancel')}</button>`;
    html += `<button type="button" class="btn btn-primary" ref="confirmAction"${ctx.busy ? ' disabled' : ''}>${ctx.busy ? SPINNER : ''}${ctx.t('Confirm')}</button>`;
    html += '</div></div>';
  }

  html += '</div>';
  return html;
}
