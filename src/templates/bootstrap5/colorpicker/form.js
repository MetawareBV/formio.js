/**
 * The colorpicker's markup: the stored value in a text input (the single source of truth, hence
 * `ref="input"` -- Multivalue attaches its change handler to it), a native color input for picking
 * an arbitrary color, and the configured presets as swatches.
 *
 * The styles are inlined on purpose. The host application runs Tailwind, but its content scanner
 * never sees this bundle, so utility classes here would simply not be generated; and formio's own
 * bootstrap CSS is loaded scoped (`.formio-scope`, see public/formio-builder.scoped.css) and may be
 * absent elsewhere. Plain CSS in the template keeps the picker looking the same everywhere, while
 * `var(--radius)`/`var(--ring)` still let it pick up the tenant's theme when it is available.
 * @param {any} ctx - The template context.
 * @returns {string} - The rendered markup.
 */
export default function (ctx) {
  const ref = ctx.instance._referenceAttributeName || 'ref';
  const attr = (value) => String(value == null ? '' : value).replace(/"/g, '&quot;');
  const isNoColor = (value) => !value || value === 'transparent' || value === 'none';
  const disabled = ctx.disabled ? ' disabled' : '';

  let html = `<style>
    .formio-colorpicker { display: flex; flex-direction: column; gap: 0.5rem; }
    .formio-colorpicker-value { display: flex; align-items: center; gap: 0.375rem; }
    .formio-colorpicker-preview,
    .formio-colorpicker-swatch,
    .formio-colorpicker-native { border: 1px solid rgba(0, 0, 0, 0.25); border-radius: var(--radius, 0.25rem); }
    .formio-colorpicker-preview { flex: 0 0 auto; width: 2.25rem; height: 2.25rem; }
    .formio-colorpicker-input { flex: 1 1 auto; min-width: 6rem; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .formio-colorpicker-native { flex: 0 0 auto; width: 2.25rem; height: 2.25rem; padding: 0.125rem; background: none; cursor: pointer; }
    .formio-colorpicker-native::-webkit-color-swatch-wrapper { padding: 0; }
    .formio-colorpicker-native::-webkit-color-swatch { border: none; }
    .formio-colorpicker-group { display: flex; flex-direction: column; gap: 0.25rem; }
    .formio-colorpicker-group-label { font-size: 0.75rem; letter-spacing: 0.04em; text-transform: uppercase; opacity: 0.65; }
    .formio-colorpicker-swatches { display: flex; flex-wrap: wrap; gap: 0.25rem; }
    .formio-colorpicker-swatch { width: 1.5rem; height: 1.5rem; padding: 0; background-clip: padding-box; cursor: pointer; }
    .formio-colorpicker-swatch.is-selected { border-color: transparent; box-shadow: 0 0 0 2px var(--ring, #71717a); }
    .formio-colorpicker-swatch[disabled], .formio-colorpicker-native[disabled] { cursor: not-allowed; opacity: 0.5; }
    /* Checkerboard, so "no color" reads as transparent rather than as white. */
    .formio-colorpicker-none {
      background-image:
        linear-gradient(45deg, #c9c9c9 25%, transparent 25%, transparent 75%, #c9c9c9 75%),
        linear-gradient(45deg, #c9c9c9 25%, transparent 25%, transparent 75%, #c9c9c9 75%);
      background-size: 0.5rem 0.5rem;
      background-position: 0 0, 0.25rem 0.25rem;
    }
  </style>`;

  html += `<div class="formio-colorpicker" ${ref}="colorpicker">`;

  html += '<div class="formio-colorpicker-value">';
  // An inline `background` would wipe the checkerboard's background-image, so a "no color" value
  // gets the class and no inline style -- ColorPicker's updatePickerState keeps that invariant.
  html += `<span class="formio-colorpicker-preview${isNoColor(ctx.value) ? ' formio-colorpicker-none' : ''}" ${ref}="colorPreview"`;
  html += isNoColor(ctx.value) ? '' : ` style="background: ${attr(ctx.value)};"`;
  html += ' aria-hidden="true"></span>';

  html += `<${ctx.input.type} ${ref}="input"`;
  for (const name in ctx.input.attr) {
    html += ` ${name}="${attr(ctx.input.attr[name])}"`;
  }
  if (!ctx.component.multiple) {
    html += ` id="${attr(`${ctx.instance.id}-${ctx.component.key}`)}"`;
  }
  html += ` aria-labelledby="l-${attr(ctx.instance.id)}-${attr(ctx.component.key)}"`;
  html += ` aria-required="${!!ctx.component.validate?.required}"`;
  html += `>${ctx.input.content || ''}</${ctx.input.type}>`;

  if (ctx.allowCustomColor) {
    html += `<input type="color" class="formio-colorpicker-native" ${ref}="colorNative" value="#ffffff" title="${attr(ctx.t('Pick a color'))}" aria-label="${attr(ctx.t('Pick a color'))}"${disabled}>`;
  }
  html += '</div>';

  (ctx.groups || []).forEach((group) => {
    html += '<div class="formio-colorpicker-group">';
    if (group.label) {
      html += `<span class="formio-colorpicker-group-label">${ctx.t(group.label)}</span>`;
    }
    html += '<div class="formio-colorpicker-swatches">';
    group.colors.forEach((color) => {
      const label = ctx.t(color.label || color.value);
      html += `<button type="button" class="formio-colorpicker-swatch${isNoColor(color.value) ? ' formio-colorpicker-none' : ''}"`;
      html += ` ${ref}="colorSwatch" data-color="${attr(color.value)}"`;
      html += isNoColor(color.value) ? '' : ` style="background: ${attr(color.value)};"`;
      html += ` title="${attr(label)}" aria-label="${attr(label)}" aria-pressed="false"${disabled}></button>`;
    });
    html += '</div></div>';
  });

  html += '</div>';
  return html;
}
