import Input from '../_classes/input/Input';
import FormioUtils from '../../utils';
import _ from 'lodash';

/**
 * The default palette: the semantic design tokens of the host application (shadcn/Tailwind).
 *
 * Every value is stored *as a usable CSS color*, so whatever renders the value can drop it
 * straight into a style attribute -- see the title template's `background-color:${ctx.backgroundcolor}`
 * (src/templates/bootstrap5/title/form.js). Because the tokens are injected per tenant
 * (frontend/components/theme-injector.tsx writes a `:root`/`.dark` block per customer), a form that
 * stores `var(--card, #ffffff)` follows the tenant's theme *and* switches with light/dark mode
 * instead of freezing one hex at design time.
 *
 * The `#rrggbb` inside each `var()` is the fallback for when the token is absent -- a PDF render, an
 * e-mail, or the plain formio preview outside the app. They are hand-converted approximations of the
 * light-mode oklch values in frontend/app/globals.css; they only have to be close, never exact.
 * @type {{label: string, colors: {label: string, value: string}[]}[]}
 */
export const DEFAULT_COLOR_GROUPS = [
  {
    label: 'Basic',
    colors: [
      { label: 'No color', value: 'transparent' },
      { label: 'White', value: '#ffffff' },
      { label: 'Black', value: '#000000' },
    ],
  },
  {
    label: 'Theme',
    colors: [
      { label: 'Background', value: 'var(--background, #fcfcfc)' },
      { label: 'Foreground', value: 'var(--foreground, #0b0b0b)' },
      { label: 'Card', value: 'var(--card, #ffffff)' },
      { label: 'Card foreground', value: 'var(--card-foreground, #0b0b0b)' },
      { label: 'Muted', value: 'var(--muted, #f2f2f2)' },
      { label: 'Muted foreground', value: 'var(--muted-foreground, #767676)' },
      { label: 'Secondary', value: 'var(--secondary, #ebebeb)' },
      { label: 'Selected', value: 'var(--selected, #e6e6e6)' },
      { label: 'Border', value: 'var(--border, #d7d7d7)' },
      { label: 'Sidebar', value: 'var(--sidebar, #f5f5f5)' },
      { label: 'Primary', value: 'var(--primary, #71717a)' },
      { label: 'Primary foreground', value: 'var(--primary-foreground, #fcfcfc)' },
      { label: 'Accent', value: 'var(--accent, #52525b)' },
      { label: 'Accent foreground', value: 'var(--accent-foreground, #fcfcfc)' },
    ],
  },
  {
    label: 'Status',
    colors: [
      { label: 'Success', value: 'var(--success, #16a34a)' },
      { label: 'Success subtle', value: 'var(--success-subtle, #e8f7ee)' },
      { label: 'Warning', value: 'var(--warning, #b45309)' },
      { label: 'Warning subtle', value: 'var(--warning-subtle, #fbf1e0)' },
      { label: 'Info', value: 'var(--info, #2563eb)' },
      { label: 'Info subtle', value: 'var(--info-subtle, #e9f1fd)' },
      { label: 'Destructive', value: 'var(--destructive, #dc2626)' },
      { label: 'Destructive subtle', value: 'var(--destructive-subtle, #fdeeeb)' },
    ],
  },
];

/**
 * Matches the only value the native `<input type="color">` can hold: a full or shorthand hex color.
 * Anything else we store (`transparent`, `var(--card, #fff)`, `rgb(...)`) has no representation
 * there, so the native input is left alone and the swatch preview -- which is plain CSS and thus
 * resolves tokens by itself -- is what shows the current color.
 * @type {RegExp}
 */
const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export default class ColorPickerComponent extends Input {
  static schema(...extend) {
    return Input.schema(
      {
        type: 'colorpicker',
        label: 'Color',
        key: 'color',
        input: true,
        defaultValue: '',
        /**
         * Presets to show as swatches. Empty means DEFAULT_COLOR_GROUPS. Accepts either a flat
         * `[{label, value}]` list (what the editForm's data grid produces) or pre-grouped
         * `[{label, colors: [{label, value}]}]`.
         */
        colors: [],
        allowCustomColor: true,
        allowNoColor: true,
      },
      ...extend,
    );
  }

  static get builderInfo() {
    return {
      title: 'Color',
      icon: 'tint',
      group: 'advanced',
      weight: 60,
      schema: ColorPickerComponent.schema(),
    };
  }

  static savedValueTypes(schema) {
    return (
      FormioUtils.getComponentSavedTypes(schema) || [FormioUtils.componentValueTypes.string]
    );
  }

  get defaultSchema() {
    return ColorPickerComponent.schema();
  }

  get inputInfo() {
    const info = super.inputInfo;
    info.type = 'input';
    info.attr.type = 'text';
    info.attr.class = 'form-control formio-colorpicker-input';
    info.attr.autocomplete = 'off';
    info.attr.spellcheck = 'false';
    if (!info.attr.placeholder) {
      info.attr.placeholder = '#ffffff';
    }
    info.changeEvent = 'input';
    return info;
  }

  get allowCustomColor() {
    return this.component.allowCustomColor !== false;
  }

  /**
   * The swatch groups to render, normalized to `[{label, colors: [{label, value}]}]`.
   * @returns {{label: string, colors: {label: string, value: string}[]}[]} - The groups.
   */
  get colorGroups() {
    const configured = this.component.colors;
    if (Array.isArray(configured) && configured.length) {
      const grouped = Array.isArray(configured[0]?.colors)
        ? configured
        : [{ label: '', colors: configured }];
      return grouped
        .map((group) => ({
          label: group.label || '',
          colors: (group.colors || []).filter((color) => color && color.value),
        }))
        .filter((group) => group.colors.length);
    }
    if (this.component.allowNoColor === false) {
      return DEFAULT_COLOR_GROUPS.map((group) => ({
        ...group,
        colors: group.colors.filter((color) => color.value !== 'transparent'),
      })).filter((group) => group.colors.length);
    }
    return DEFAULT_COLOR_GROUPS;
  }

  renderElement(value, index) {
    const info = this.inputInfo;
    info.attr = info.attr || {};
    info.attr.value = (value == null ? '' : String(value)).replace(/"/g, '&quot;');
    return this.renderTemplate('colorpicker', {
      input: info,
      value: value == null ? '' : value,
      index,
      groups: this.colorGroups,
      allowCustomColor: this.allowCustomColor,
    });
  }

  attach(element) {
    const attached = super.attach(element);
    this.loadRefs(element, { colorpicker: 'multiple' });
    (this.refs.colorpicker || []).forEach((wrapper, index) => this.attachPicker(wrapper, index));
    this.updatePickerState();
    return attached;
  }

  /**
   * Wires up the parts of one picker that are not the value input itself -- the preset swatches and
   * the native color input. Both write into `refs.input[index]` and then let the regular
   * `updateValue` path run, so there is exactly one source of truth for the value.
   * @param {HTMLElement} wrapper - The `colorpicker` wrapper of this row.
   * @param {number} index - The row index (only ever > 0 for a `multiple` component).
   */
  attachPicker(wrapper, index) {
    const refAttr = this._referenceAttributeName || 'ref';
    wrapper.querySelectorAll(`[${refAttr}="colorSwatch"]`).forEach((swatch) => {
      this.addEventListener(swatch, 'click', (event) => {
        event.preventDefault();
        this.setColorValue(swatch.getAttribute('data-color') || '', index);
      });
    });
    const native = wrapper.querySelector(`[${refAttr}="colorNative"]`);
    if (native) {
      this.addEventListener(native, 'input', () => this.setColorValue(native.value, index));
    }
  }

  /**
   * @param {string} color - The CSS color to store.
   * @param {number} index - The row to store it in.
   */
  setColorValue(color, index) {
    const input = _.get(this.refs, ['input', index]);
    if (!input) {
      return;
    }
    input.value = color;
    // Mirrors what Multivalue's own change handler does: the input holds the value, `updateValue`
    // reads it back through `getValue()` -- and refreshes the preview/selection along the way.
    this.updateValue(null, { modified: true }, index);
  }

  setValueAt(index, value, flags = {}) {
    super.setValueAt(index, value, flags);
    this.updatePickerState(index);
  }

  updateValue(value, flags, index) {
    const changed = super.updateValue(value, flags, index);
    this.updatePickerState(index);
    return changed;
  }

  /**
   * Reflects the current value in the parts that only display it: the preview swatch, the selected
   * state of the presets and -- for a plain hex value -- the native color input.
   * @param {number} [index] - Limit the update to one row; all rows when omitted.
   */
  updatePickerState(index) {
    const wrappers = this.refs?.colorpicker;
    if (!wrappers || !wrappers.length) {
      return;
    }
    const refAttr = this._referenceAttributeName || 'ref';
    const indexes = _.isNumber(index) ? [index] : _.range(wrappers.length);
    indexes.forEach((i) => {
      const wrapper = wrappers[i];
      if (!wrapper) {
        return;
      }
      const value = _.get(this.refs, ['input', i, 'value']) || '';
      const preview = wrapper.querySelector(`[${refAttr}="colorPreview"]`);
      if (preview) {
        // An inline `background` would paint over the checkerboard that marks "no color", so an
        // empty/transparent value gets the class instead of a style -- see the template.
        const noColor = !value || value === 'transparent' || value === 'none';
        // Written as an attribute rather than through `style.background`: the CSSOM drops values it
        // cannot parse, and `var(--token, #fff)` is exactly such a value in jsdom.
        preview.setAttribute('style', noColor ? '' : `background: ${value};`);
        this[noColor ? 'addClass' : 'removeClass'](preview, 'formio-colorpicker-none');
      }
      const native = wrapper.querySelector(`[${refAttr}="colorNative"]`);
      if (native && HEX_COLOR.test(value)) {
        native.value = ColorPickerComponent.expandHex(value);
      }
      wrapper.querySelectorAll(`[${refAttr}="colorSwatch"]`).forEach((swatch) => {
        const selected = swatch.getAttribute('data-color') === value;
        swatch.setAttribute('aria-pressed', selected ? 'true' : 'false');
        this[selected ? 'addClass' : 'removeClass'](swatch, 'is-selected');
      });
    });
  }

  /**
   * `<input type="color">` only accepts the 7-character form, so `#fff` has to be doubled up.
   * @param {string} hex - A 4 or 7 character hex color.
   * @returns {string} - The 7 character form.
   */
  static expandHex(hex) {
    return hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex.toLowerCase();
  }

  getValueAsString(value) {
    return value == null ? '' : String(value);
  }
}
