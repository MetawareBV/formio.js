import Formio from "../../../Formio";
/*
function getDatabaseName() {  
  let params = new URLSearchParams(document.location.search);
  let name = params.get("database");
  if (name === undefined || name === "") return "";
  return name.substring(name.lastIndexOf('/')+1, name.indexOf('.nsf')) ;
}
*/
function getDatabaseName() {  
  const params = new URLSearchParams(document.location.search);
  const name = params.get("database") || ""; // Gebruik een standaardwaarde als er geen parameter is.
  
  if (!name) return ""; // Controleer meteen op een lege string.
  
  // Vervang backslashes door gewone slashes voor consistente verwerking
  const normalizedName = name.replace(/\\/g, '/');

  // Zoek naar de laatste '/' en '.nsf' in de string
  const lastSlashIndex = normalizedName.lastIndexOf('/');
  const nsfIndex = normalizedName.indexOf('.nsf');
  
  // Controleer of de indices geldig zijn
  if (lastSlashIndex === -1 || nsfIndex === -1 || nsfIndex <= lastSlashIndex) {
    return "";
  }
  
  // Haal de database-naam op
  return normalizedName.substring(lastSlashIndex + 1, nsfIndex);
}


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
      url:  location.href.substring(0, location.href.lastIndexOf("/application.nsf") ) + '/application.nsf/Form.xsp/infoware/' + getDatabaseName() + '/images?id=*'
    },
    searchField: 'title__regex',
    template: '<span>{{ item.title }}</span>',
    valueProperty: '_id',
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
