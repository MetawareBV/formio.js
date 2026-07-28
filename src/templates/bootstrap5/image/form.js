export default function(ctx) {
  let html = '<div class="container-fluid">';
  html += `<figure class="figure ${ctx.component.figureClass || ''}">`;
  if (ctx.component.imageSource) {
    const src = location.href.substring(0, location.href.lastIndexOf('/application.nsf')) +
      '/application.nsf/InfowareForms.xsp/infoware/' + ctx.component.imageSource;
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
