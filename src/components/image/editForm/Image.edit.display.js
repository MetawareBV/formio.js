import Formio from "../../../Formio";

// The form-design page always renders at /{tenant}/infoware/{database}/forms/{key} -- parsed
// here (module-eval time, once per page load) the same way Workflow's editForm field derives
// its own admin-API URL from `location.href`. Must be an absolute URL (location.origin + path,
// not a bare `/api/...` path): `Formio.request` rewrites any URL starting with `/` to
// `Formio.baseUrl + url`, and `Formio.baseUrl` defaults to `https://api.form.io` since this app
// never calls `Formio.setBaseUrl` -- a bare path silently ends up calling Form.io's own cloud API.
const pathSegments = location.pathname.split('/');
const imageListUrl = `${location.origin}/api/${pathSegments[1]}/infoware/${pathSegments[3]}/attachments/image`;

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
    type: 'select',
    label: 'Image',
    key: 'imageSource',
    input: true,
    weight: 1,
    dataSrc: 'url',
    data: {
      url: imageListUrl
    },
    // Matches GET /api/{tenant}/infoware/{database}/attachments/image?search= (partial
    // filename, case-insensitive) -- see attachments/image/route.ts.
    searchField: 'search',
    template: '<span>{{ item.filename }}</span>',
    valueProperty: 'id',
    lazyLoad: false
},
{
  type: 'checkbox',
  label: 'Image with caption',
  key: 'showImageTitle',
  input: true,
  weight: 49,
  tooltip: ''
},
{
  type: 'textfield',
  input: true,
  key: 'imageTitle',
  label: 'Caption',
  placeholder: '',  
  weight: 50,
  conditional: {
    json: { '===': [{ var: 'data.showImageTitle' }, true] }
  }
},
{
  type: 'select',
  input: true,
  multiple: true,
  key: 'imageClass',
  label: 'Style',
  tooltip: '',
  weight: 51,
  defaultValue: '',
  dataSrc: 'values',
  data: {
    values: [
      { label: 'Rounded', value: 'rounded' },
      { label: 'Circle', value: 'rounded-circle' },
      { label: 'Thumbnail', value: 'img-thumbnail' },    
    ]
  }
},
{
    type: 'select',
    input: true,
    key: 'figureClass',
    weight: 52,
    label: 'Image alignment',
    tooltip: 'Image alignment',
    defaultValue: 'center',
    onChange: (context) => {
      context.data.widget = _.pick(context.data.widget, 'type');
    },
    dataSrc: 'values',
    data: {
      values: [
        { label: 'Full width', value: 'img-fullwidth' },
        { label: 'Responsive image', value: 'img-fluid' },
        { label: 'Left', value: 'float-left' },
        { label: 'Center', value: 'mx-auto d-block' },
        { label: 'Right', value: 'float-right' },
      ]
    }
  }, 
  {
    type: 'textfield',
    input: true,
    key: 'width',
    label: 'Width [px]',
    placeholder: '',  
    weight: 53,
    conditional: {
      json: { '!==': [{ var: 'data.figureClass' }, 'img-fullwidth'] }
    }
  }, 
];
