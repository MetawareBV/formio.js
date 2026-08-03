import { Formio } from '../../../Formio';

/**
 * Shared REST client for the workflow/workflowHistory/workflowStates components.
 *
 * Talks to the Next.js proxy routes under `options.apiBase` (default `/api`), which attach auth
 * server-side and forward 1:1 to the Spring Boot RegistrationController/AclController endpoints
 * -- the components themselves never see a bearer token, they only do same-origin fetches
 * against `/api/{tenant}/{application}/{database}/...`, mirroring the app's existing
 * `app/api/[tenant]/infoware/[database]/registrations/**` route layout.
 */
function getContext(component) {
  const options = component.options || {};
  return {
    apiBase: options.apiBase || '/api',
    tenant: options.tenant,
    application: options.application || 'infoware',
    database: options.database,
    registrationId: options.registrationId,
  };
}

function baseUrl(component) {
  const { apiBase, tenant, application, database } = getContext(component);
  return `${apiBase}/${tenant}/${application}/${database}`;
}

function request(component, method, url, data) {
  const headers = new Formio.Headers();
  headers.set('Accept', 'application/json');
  if (data) {
    headers.set('Content-Type', 'application/json');
  }
  return Formio.makeRequest(component.options.formio, 'workflow', url, method, data || null, {
    ignoreCache: true,
    header: headers,
  });
}

export function getRegistrationId(component) {
  return getContext(component).registrationId;
}

export function getAvailableActions(component) {
  const { registrationId } = getContext(component);
  if (!registrationId) {
    return Promise.resolve([]);
  }
  return request(component, 'GET', `${baseUrl(component)}/registrations/${registrationId}/actions`);
}

export function executeAction(component, transitionId, { actorPartyId, comment } = {}) {
  const { registrationId } = getContext(component);
  const params = new URLSearchParams();
  if (actorPartyId) {
    params.set('actorPartyId', actorPartyId);
  }
  if (comment) {
    params.set('comment', comment);
  }
  const query = params.toString();
  const queryString = query ? `?${query}` : '';
  const url = `${baseUrl(component)}/registrations/${registrationId}/actions/${transitionId}${queryString}`;
  return request(component, 'POST', url);
}

export function getStatusHistory(component) {
  const { registrationId } = getContext(component);
  if (!registrationId) {
    return Promise.resolve([]);
  }
  return request(component, 'GET', `${baseUrl(component)}/registrations/${registrationId}/status-history`);
}

export function getParties(component) {
  // ACL endpoints are proxied under the "isoware" application segment regardless of which
  // module embeds this component -- matches every other acl/** route in the frontend.
  const { apiBase, tenant, database } = getContext(component);
  return request(component, 'GET', `${apiBase}/${tenant}/isoware/${database}/acl/parties`);
}

export function extractErrorMessage(err) {
  if (!err) {
    return 'Unknown error';
  }
  if (typeof err === 'string') {
    return err;
  }
  return err.message || err.error || 'Unknown error';
}
