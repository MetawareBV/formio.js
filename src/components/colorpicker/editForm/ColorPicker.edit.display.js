export default [
  {
    key: 'placeholder',
    ignore: true,
  },
  {
    type: 'checkbox',
    input: true,
    key: 'allowCustomColor',
    label: 'Allow a custom color',
    tooltip: 'Shows a color picker next to the presets so any color can be entered.',
    defaultValue: true,
    weight: 410,
  },
  {
    type: 'checkbox',
    input: true,
    key: 'allowNoColor',
    label: 'Allow "no color"',
    tooltip:
      'Adds a transparent swatch to the default palette, for leaving the color unset. Has no effect once "Presets" below replaces the default palette.',
    defaultValue: true,
    weight: 411,
  },
  {
    type: 'datagrid',
    input: true,
    key: 'colors',
    label: 'Presets',
    tooltip:
      'Overrides the default palette of theme colors. A value is any CSS color: a hex code such as #ffffff, or a theme token such as var(--card, #ffffff) so the color follows the tenant theme.',
    weight: 412,
    reorder: true,
    addAnother: 'Add color',
    components: [
      {
        type: 'textfield',
        input: true,
        key: 'label',
        label: 'Label',
      },
      {
        type: 'textfield',
        input: true,
        key: 'value',
        label: 'Value',
        placeholder: 'var(--card, #ffffff)',
      },
    ],
  },
];
