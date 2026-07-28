export default function(ctx) {
  if (ctx.component.hideElement) {
    return '<input name="ctx.data[location]" type="hidden" class="form-control" lang="en" value="" ref="input">';
  }

  let html = '<div class="card card-body"';
  if (ctx.component.hideLabel) {
    html += ` aria-label="${ctx.component.label}"`;
  }
  else {
    html += ` aria-labelledby="l-${ctx.id}-${ctx.component.key}"`;
  }
  if (ctx.component.description) {
    html += ` aria-describedby="d-${ctx.id}-${ctx.component.key}"`;
  }
  html += '><div class="row">';

  if (ctx.component.showGoogleMaps) {
    html += '<div class="col">';
    if (ctx.value.base64Image && ctx.value.base64Image !== '') {
      html += `<img src="data:image/png;base64, ${ctx.value.base64Image}" alt="Location" />`;
    }
    else {
      html += '[Google Maps Image]';
    }
    html += '</div>';
  }

  html += '<div class="col"><strong>' + ctx.t('Location:') + '</strong>';

  if (ctx.component.showDDCoordinates) {
    html += '<div><i class="fa fa-map-marker" style="margin-right:5px;"></i>';
    if (ctx.value.latitude && ctx.value.latitude !== '' && ctx.value.latitude != -1) {
      html += `<a href="https://www.google.com/maps/search/?api=1&query=${ctx.value.latitude},${ctx.value.longitude}" target="_blank">${ctx.value.latitude}, ${ctx.value.longitude}</a>`;
    }
    html += '</div>';
  }

  if (ctx.component.showDMSCoordinates) {
    html += '<div><i class="fa fa-map-marker" style="margin-right:5px;"></i>';
    if (ctx.value.DMS && ctx.value.DMS !== '') {
      html += `<a href="https://www.google.com/maps/search/?api=1&query=${ctx.value.latitude},${ctx.value.longitude}" target="_blank">${ctx.value.DMS}</a>`;
    }
    html += '</div>';
  }

  if (ctx.component.showLocationName) {
    html += '<div><i class="fa fa-map-marker" style="margin-right:5px;"></i>';
    if (ctx.value.locationName && ctx.value.locationName !== '') {
      html += ctx.value.locationName;
    }
    html += '</div>';
  }

  html += '</div>';

  if (ctx.value.error && ctx.value.error !== '') {
    html += `<div class="formio-location-error">${ctx.value.error}</div>`;
  }

  html += '</div></div>';
  html += '<input name="ctx.data[location]" type="hidden" class="form-control" lang="en" value="" ref="input">';
  return html;
}
