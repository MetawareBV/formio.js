export default function(ctx) {
  let html = '<div class="container-fluid">';
  html += `<figure class="figure ${ctx.component.figureClass || ''}">`;
  if (ctx.component.imageSource) {
    // `imageSource` holds an attachment id (picked via the editForm's select, backed by
    // GET /api/{tenant}/infoware/{database}/attachments/image). The download route is
    // deliberately session-only (no {tenant}-{database} role check) so any form filler can
    // see the image they picked -- see attachments/[id]/download/route.ts. `ctx.options` is
    // `this.options` on the component instance, set from Formio.createForm's options by the
    // host app (mirrors workflowClient.js's getContext()).
    const options = ctx.options || {};
    const application = options.application || 'infoware';
    const src = `${location.origin}/api/${options.tenant}/${application}/${options.database}/attachments/${ctx.component.imageSource}/download`;
    html += `<img class="figure-img ${ctx.component.imageClass || ''} ${ctx.component.figureClass || ''}" src="${src}" alt="${ctx.component.imageTitle || ''}"`;
    if (ctx.component.width) {
      html += ` style="width:${ctx.component.width}px;"`;
    }
    html += ' />';
  }
  else {
    html += `[${ctx.t('No Image Selected')}]`;
  }
  if (ctx.component.showImageTitle) {
    html += `<figcaption class="figure-caption">${ctx.component.imageTitle}</figcaption>`;
  }
  html += '</figure><div class="clearfix"></div></div>';
  return html;
}
