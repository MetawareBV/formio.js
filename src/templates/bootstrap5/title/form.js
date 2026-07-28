export default function(ctx) {
  let attrs = '';
  (ctx.attrs || []).forEach((attr) => {
    attrs += ` ${attr.attr}="${attr.value}"`;
  });
  let html = `<${ctx.tag} class="card card-body titleComponent ${ctx.component.className || ''}" ref="title" style="text-align:${ctx.alignment};color:${ctx.color};background-color:${ctx.backgroundcolor};"${attrs}>${ctx.t(ctx.content)}`;
  if (!ctx.singleTags || ctx.singleTags.indexOf(ctx.tag) === -1) {
    html += `</${ctx.tag}>`;
  }
  return html;
}
