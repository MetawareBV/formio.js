import _ from 'lodash';
import Field from '../_classes/field/Field';

export default class LocationComponent extends Field {
  static schema(...extend) {
    return Field.schema({
      type: 'location',
      label: 'Location',
      key: 'location',
      fields: {
        latitude: {
          type: 'number',
          placeholder: '',
          value: -1,
          required: false
        },
        longitude: {
          type: 'number',
          placeholder: '',
          value: -1,
          required: false
        },
        locationName: {
          type: 'text',
          placeholder: '',
          value:'',
          required: false
        }
      },
      hideLabel: true,
      hideElement: false,
      showDMSCoordinates: true,
      showDDCoordinates: false,
      showGoogleMaps: true,
      showLocationName: false,
      maptype: 'roadmap',
      zoom: '15',
      //showGoogleMaps: false,
      //detectLocation: false
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Location',
      group: 'advanced',
      icon: 'map-marker',
      documentation: '/userguide/#locatoin',
      weight: 150,
      schema: LocationComponent.schema()
    };
  }

  coordinates = {} ; 

  init() {    
    if (this.root) {
      let _this = this;
      this.root.submissionReady.then(function(res){
                              _this.redraw();       
                           });
    }
    
    if (this.localRoot === undefined || this.localRoot.formio == null || this.localRoot.formio.submissionId === undefined || this.localRoot.formio.submissionId === '') {
      if (this.coordinates) {
        if (!this.coordinates.latitude) {       
          // data is geladen in het formulier. Dus nu checken of de locatie al ingevuld is.
          this.resolveLocation();            
        }
      }
    }       
    super.init();   
  }

  /**
 * The empty value for day component.
 *
 * @return Stringified location object
 */
  get emptyValue() {
    return JSON.stringify({
                  latitude: -1,
                  longitude: -1,
                  locationName: '',
                  DMS: '',                  
                });
  }

  get defaultSchema() {
    return LocationComponent.schema();
  }

  get inputInfo() {
    const info = super.elementInfo();
    info.type = 'input';
    info.attr.type = 'hidden';
    info.changeEvent = 'input';
    return info;
  }

  inputDefinition(name) {    
    return {
      type: 'input',
      ref: name,
      attr: {
        id: `${this.component.key}-${name}`,
        class: `form-control ${this.transform('class', `formio-location-component-${name}`)}`,
        type: this.component.fields[name].type === 'select' ? 'select' : 'number',
        placeholder: this.component.fields[name].placeholder,      
      }
    };
  }

  selectDefinition(name) {
    return {
      multiple: false,
      ref: name,
      widget: 'html5',
      attr: {
        id: `${this.component.key}-${name}`,
        class: 'form-control',
        name,
        lang: this.options.language
      }
    };
  }

  setErrorClasses(elements, dirty, hasError) {
    super.setErrorClasses(elements, dirty, hasError);
    super.setErrorClasses([this.refs.latitude, this.refs.longitude, this.refs.locationName], dirty, hasError);
  }

  removeInputError(elements) {
    super.removeInputError([this.refs.latitude, this.refs.longitude, this.refs.locationName]);
    super.removeInputError(elements);
  }

  

  resolveLocation() {
    let _this = this;
    function success(position) {        
      _this.coordinates.latitude = position.coords.latitude;
      _this.coordinates.longitude = position.coords.longitude;
      _this.coordinates.DMS =  _this.convertDMS(position.coords.latitude, position.coords.longitude);
      try {
        _this.refs.input.value = _this.getLocation();
      } catch(e) { 

      }

      let options = options || {};
      let method = 'GET';
      const headers = new Formio.Headers();      
      let endpoint = '/Form.xsp/infoware/admin/geocoding/' + position.coords.latitude + ',' + position.coords.longitude ;
      let params = '&maptype=' + _this.component.maptype + '&zoom=' + _this.component.zoom;
      let url =  location.href.substring(0, location.href.lastIndexOf("/application.nsf") ) + "/application.nsf" + endpoint + "?open" + params; 
        
      options.ignoreCache = true;
      options.header = headers;
      Formio.makeRequest(_this.options.formio, 'select', url, method, null, options)
        .then((response) => {
          let val = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            locationName: '',
            base64Image: response.imageBase64,
            DMS: _this.coordinates.DMS 
          }
          _this.coordinates.base64Image = response.imageBase64;
          _this._data.location = JSON.stringify(val);
          _this.redraw();  
        })
        .catch((err) => {
          console.warn(`Unable to resolve location`);
        });

      //$('#locationError').html('');
      // Welke API service gaan we gebruiken voor een reverse lookup van de coords?
      // https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY  

        
    }
  
    function error() {
      _this.coordinates.error ='Unable to retrieve your location' ;
      _this.redraw(); 
    }

    if (!this.disabled && this.options.attachMode !== 'builder') {
      if (!this.coordinates.latitude || this.coordinates.latitude == -1|| this.coordinates.latitude === '') {
        if(!navigator.geolocation) {
          _this.coordinates.error = 'Geolocation is not supported by your browser' ;
        } else {
          navigator.geolocation.getCurrentPosition(success, error);
        }
      }
    }
  }

  render() {    
    return super.render(this.renderTemplate('location', {      
      showLocationCoordinates: this.showLocationCoordinates, 
     // coordinates: this.coordinates,    
      value: this.getValueObject(), 
      //latitude: this.renderField('latitude'),
      //longitude: this.renderField('longitude'),
      //locationName: this.renderField('locationName'),
    }));
  }

  renderField(name) {   
    return this.renderTemplate('input', {
      prefix: this.prefix,
      suffix: this.suffix,
      input: this.inputDefinition(name)
    });    
  }

  attach(element) {
    this.loadRefs(element, {  input: 'multiple' });
    //latitude: 'single', longitude: 'single', locationName: 'single',
    const superAttach = super.attach(element);       
    this.addEventListener(this.refs.input, this.info.changeEvent, () => this.updateValue(null, { modified: true }));

    this.setValue(this.dataValue);
    return superAttach;
  }

  
  normalizeValue(value) {
    if (!value || value.substring(0,1) === '{') {
      return value;
    }
    let valueObject = JSON.parse(value);
    return JSON.stringify(valueObject);
  }

  /**
   * Set the value at a specific index.
   *
   * @param index
   * @param value
   */
  setValueAt(index, value) {
    // temporary solution to avoid input reset
    // on invalid date.
    if (!value || value === 'Invalid location') {
      return null;
    }
    const o = JSON.parse(value);
   
    this.coordinates.latitude = o.latitude;
    this.coordinates.longitude = o.longitude;
    try {
      this.coordinates.locationName = o.locationName;    
    } catch(e) {}
  }

  /**
   * Return the location for this component.
   *
   * @param value
   * @return {*}
   */
   getLocation(value) {
    let val = {
              latitude: 100,
              longitude: 100,
              locationName: '',
              base64Image:'',
              DMS: ''
            }

    val.latitude = this.coordinates.latitude;
    val.longitude = this.coordinates.longitude;
    val.longitude = this.coordinates.DMS;
    //val.DMS = this.convertDMS(this.coordinates.latitude, this.coordinates.longitude);

    return JSON.stringify(val);
  }

  /**
   * Return the date object for this component.
   * @returns {Date}
   */
  get location() {
    return this.getLocation();
  }

  /**
   * Return the raw value.
   *
   * @returns {Date}
   */
  get validationValue() {
    [this.component.minDate, this.component.maxDate] = this.dayFirst ? this.normalizeMinMaxDates()
      : [this.component.minDate, this.component.maxDate];
    return this.dataValue;
  }

  getValue() {
    const result = super.getValue();
    const o = JSON.parse(result);
    this.coordinates.latitude = o.latitude;
    this.coordinates.longitude = o.longitude;
    return (!result) ? this.dataValue : result;
  }

  getValueObject() {
    return JSON.parse(this.getValue());
  }

  /**
   * Get the value at a specific index.
   *
   * @param index
   * @returns {*}
   */
  getValueAt(index) {
    const loc = this.location;
    if (loc) {
      this.refs.input[index].value = loc;
      return this.refs.input[index].value;
    } else {
      this.refs.input[index].value = '';
      return null;
    }
  }


  focus() {
   
    
  }

  /**
 * Convert longitude/latitude decimal degrees to degrees and minutes
 * DDD to DMS, no seconds
 * @param lat, latitude degrees decimal
 * @param lng, longitude degrees decimal
 */
        
 convertDMS( lat, lng ) {
 
  var convertLat = Math.abs(lat);
  var LatDeg = Math.floor(convertLat);
  var LatMin = (Math.floor((convertLat - LatDeg) * 60));
  var LatCardinal = ((lat > 0) ? "N" : "S");
   
  var convertLng = Math.abs(lng);
  var LngDeg = Math.floor(convertLng);
  var LngMin = (Math.floor((convertLng - LngDeg) * 60));
  var LngCardinal = ((lng > 0) ? "E" : "W");
   
  return LatDeg + '°' + LatMin  + "'" + LatCardinal + ", " + LngDeg  + '°' +  LngMin + "'" + LngCardinal + "";
}

}
