export default [
  {
    key: 'labelPosition',
    ignore: true
  },
  {
    key: 'placeholder',
    ignore: true
  },
  {
    key: 'description',
    ignore: true
  },
  // Was a select fed by the Domino `CustomApi.xsp/admin/settings/colors` endpoint; see the same
  // change in Title.edit.display.js for why this is a picker over theme tokens now.
  {
    type: 'colorpicker',
    input: true,
    key: 'backgroundcolor',
    weight: 51,
    label: 'Backgroundcolor',
    tooltip: 'Background color of the well.',
    defaultValue: 'var(--card, #ffffff)',
  },
  {
    key: 'autofocus',
    ignore: true
  },
  {
    key: 'tooltip',
    ignore: true
  },
  {
    key: 'tabindex',
    ignore: true
  },
  {
    key: 'tableView',
    ignore: true
  },
  {
    key: 'hideLabel',
    ignore: true
  },
  {
    weight: 0,
    type: 'textfield',
    input: true,
    key: 'label',
    label: 'Label',
    placeholder: 'Field Label',
    tooltip: 'The label for this field.',
    validate: {
      required: true
    },
    autofocus: true,
    overrideEditForm: true
  },
];
