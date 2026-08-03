// The form-design page always renders at /{tenant}/infoware/{database}/forms/{key} -- parsed
// here (module-eval time, once per page load) the same way Title/Location's editForm fields
// derive their own admin-API URLs from `location.href`.
const pathSegments = location.pathname.split('/');
const workflowListUrl = `/api/${pathSegments[1]}/isoware/${pathSegments[3]}/workflow/definitions?resourceType=REGISTRATION&t=${Date.now()}`;

export default [
  {
    type: 'select',
    input: true,
    key: 'workflowId',
    weight: 1,
    label: 'Workflow',
    tooltip: 'Kies de workflow die gebruikt moet worden voor registraties van dit formulier.',
    dataSrc: 'url',
    data: {
      url: workflowListUrl,
    },
    valueProperty: 'id',
    template: '<span>{{ item.name }}</span>',
    lazyLoad: false,
  },
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
