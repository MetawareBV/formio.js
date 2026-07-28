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
    type: 'select',
    input: true,
    key: 'backgroundcolor',
    weight: 51,
    label: 'Backgroundcolor',
    tooltip: 'Backgroundcolor',
    defaultValue: '#fff',
    dataSrc: 'url',
    data: {
      url: location.href.substring(0, location.href.lastIndexOf("/application.nsf")) + '/application.nsf/CustomApi.xsp/admin/settings/colors?pc=' + new Date()  
    },
    searchField: 'title__regex',
    valueProperty: '_id',
    template: '<span>{{ item.title }}</span>',
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
