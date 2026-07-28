export default [  
  {
      type: 'content',
      html: 'When you add this component to the form, the location is determined and stored when the submission is saved for the first time.<br/><br/>',     
      weight: 1,      
  },  
  {
    type: 'checkbox',
    label: 'Hide element',
    key: 'hideElement',
    input: true,
    weight: 2,
    tooltip: 'Do not show this element to the user',
    description: 'If you hide this element, the browser still tries to retrieve the location and wil ask the user for permission.'
  },
  {
      type: 'checkbox',
      label: 'Show location coordinates in degrees format (DMS)',
      key: 'showDMSCoordinates',
      input: true,
      weight: 3,
  },
  {
    type: 'checkbox',
    label: 'Show location coordinates in decimal format (DD)',
    key: 'showDDCoordinates',
    input: true,
    weight: 4,
  },
  {
    type: 'checkbox',
    label: 'Show location in Google Maps image',
    key: 'showGoogleMaps',
    input: true,
    weight: 5,
  }, 
  {
    type: 'select',
    input: true,
    key: 'maptype',
    label: 'Google Maptype',
    tooltip: '',
    weight: 30,
    defaultValue: 'roadmap',
    dataSrc: 'values',
    data: {
      values: [
        { label: 'Roadmap', value: 'roadmap' },
        { label: 'Satellite', value: 'satellite' },
        { label: 'Hybrid', value: 'hybrid' },
        { label: 'Terrain', value: ' terrain' }
      ]
    }
  },
  {
    type: 'select',
    input: true,
    key: 'zoom',
    label: 'Google Maps Zoom',
    tooltip: '',
    weight: 30,
    defaultValue: '1',
    dataSrc: 'values',
    data: {
      values: [
        { label: 'World', value: '1' },
        { label: 'Landmass/continent', value: '5' },
        { label: 'City', value: '10' },
        { label: 'Streets', value: '15' },
        { label: 'Buildings', value: '20' },
      ]
    }
  },
  {
    type: 'checkbox',
    label: 'Do a reverse lookup for this location and show the name',
    key: 'showLocationName',
    input: true,
    weight: 6,
    tooltip: 'Using the Google Places API',
    ignore: true,
  },
  {
      key: 'label',
      ignore: true,
  },
  {
      key: 'labelPosition',
      ignore: true
  },
  {
      key: 'placeholder',
      ignore: true
  },   
  {
      key: 'hideLabel',
      ignore: true,
  },
  {
      key: 'autofocus',
      ignore: true
  },
  {
    key: 'tooltip',
    ignore: true
},
];
