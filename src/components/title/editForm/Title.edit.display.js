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
  {
    type: 'select',
    input: true,
    key: 'backgroundcolor',
    weight: 51,
    label: 'Backgroundcolor',
    tooltip: 'Backgroundcolor',
    defaultValue: '#fff',
    dataSrc: 'url',
    data: {
      url: location.href.substring(0, location.href.lastIndexOf("/application.nsf")) + '/application.nsf/CustomApi.xsp/admin/settings/colors' 
    },
    searchField: 'title__regex',
    valueProperty: '_id',
    template: '<span>{{ item.title }}</span>',
  },
  {
    type: 'select',
    input: true,
    key: 'color',
    weight: 51,
    label: 'Text color',
    tooltip: 'Text color',
    defaultValue: '#000',
    dataSrc: 'url',
    data: {
      url: location.href.substring(0, location.href.lastIndexOf("/application.nsf")) + '/application.nsf/CustomApi.xsp/admin/settings/colors'  //'/form?limit=4294967295&select=_id,title,display'
    },
    searchField: 'title__regex',
    valueProperty: '_id',
    template: '<span>{{ item.title }}</span>',
  },
];
