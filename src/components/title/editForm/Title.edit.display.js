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
  {
    key: 'tooltip',
    ignore: true
  },
  {
    key: 'hideLabel',
    ignore: true
  },
  {
    key: 'autofocus',
    ignore: true
  },
  {
    key: 'disabled',
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
    key: 'label',
    ignore: true
  },
  {
    type: 'textarea',
    input: true,    
    rows: 3,
    as: 'html',
    label: 'Title',
    tooltip: 'The title text.',
    defaultValue: 'Title',
    key: 'content',
    weight: 1
  },
  {
    type: 'select',
    input: true,
    key: 'tag',
    weight: 50,
    label: 'Heading size',
    tooltip: 'Choose a heading size',
    defaultValue: 'H1',
    onChange: (context) => {
      context.data.widget = _.pick(context.data.widget, 'type');
    },
    dataSrc: 'values',
    data: {
      values: [
        { label: 'Heading 1', value: 'H1' },
        { label: 'Heading 2', value: 'H2' },
        { label: 'Heading 3', value: 'H3' },
        { label: 'Paragraph', value: 'P' },
        { label: 'Normal', value: 'span' },
      ]
    }
  },
  {
    type: 'select',
    input: true,
    key: 'alignment',
    weight: 51,
    label: 'Title alignment',
    tooltip: 'Title alignment',
    defaultValue: 'center',
    onChange: (context) => {
      context.data.widget = _.pick(context.data.widget, 'type');
    },
    dataSrc: 'values',
    data: {
      values: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ]
    }
  },
  // Both colors used to be selects fed by the Domino `CustomApi.xsp/admin/settings/colors`
  // endpoint. They are pickers now: the value is a CSS color that the title template drops straight
  // into its style attribute, and the default palette is the host application's theme tokens, so a
  // title follows the tenant's theme and light/dark mode instead of a hex frozen at design time.
  {
    type: 'colorpicker',
    input: true,
    key: 'backgroundcolor',
    weight: 51,
    label: 'Backgroundcolor',
    tooltip: 'Background color of the title.',
    defaultValue: 'var(--card, #ffffff)',
  },
  {
    type: 'colorpicker',
    input: true,
    key: 'color',
    weight: 52,
    label: 'Text color',
    tooltip: 'Color of the title text.',
    defaultValue: 'var(--card-foreground, #0b0b0b)',
  },
];
