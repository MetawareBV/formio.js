export default [
  {
    key: 'labelPosition',
    ignore: true,
  },
  {
    key: 'placeholder',
    ignore: true,
  },
  {
    key: 'hideLabel',
    ignore: true,
  },
  {
    key: 'autofocus',
    ignore: true,
  },
  {
    key: 'tabindex',
    ignore: true,
  },
  {
    key: 'tableView',
    ignore: true,
  },
  {
    type: 'select',
    input: true,
    key: 'alignment',
    weight: 10,
    label: 'Button alignment',
    tooltip: 'Alignment of the workflow action buttons.',
    defaultValue: 'right',
    dataSrc: 'values',
    data: {
      values: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
  },
  {
    type: 'checkbox',
    input: true,
    key: 'showSaveButton',
    label: 'Submit the form after executing an action',
    tooltip: 'Calls the form\'s own submit flow right after a workflow action succeeds.',
    weight: 20,
  },
  {
    type: 'checkbox',
    input: true,
    key: 'showValidations',
    label: 'Validate the form before allowing an action',
    tooltip: 'Blocks executing any workflow action while the form has validation errors.',
    weight: 30,
  },
];
