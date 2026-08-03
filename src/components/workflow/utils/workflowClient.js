import { Formio } from '../../../Formio';

/**
 * Shared REST client for the workflow/workflowHistory/workflowStates components.
 *
 * Talks to the Next.js proxy routes under `options.apiBase` (default: this page's own origin +
 * `/api`), which attach auth server-side and forward 1:1 to the Spring Boot
 * RegistrationController/AclController endpoints -- the components themselves never see a bearer
 * token, they only do same-origin fetches against `/api/{tenant}/{application}/{database}/...`,
 * mirroring the app's existing `app/api/[tenant]/infoware/[database]/registrations/**` route
 * layout.
 *
 * `apiBase` MUST be an absolute URL (not a bare `/api` path): `Formio.request` (the fetch
 * wrapper behind `Formio.makeRequest`) rewrites any URL starting with `/` to
 * `Formio.baseUrl + url` -- and `Formio.baseUrl` defaults to `https://api.form.io`, since this
 * app never calls `Formio.setBaseUrl`. Without `location.origin` here, every call silently goes
 * to Form.io's own cloud API instead of this app's proxy routes.
 */
function getContext(component) {
  const options = component.options || {};
  return {
    apiBase: options.apiBase || `${window.location.origin}/api`,
    tenant: options.tenant,
    application: options.application || 'infoware',
    database: options.database,
    registrationId: options.registrationId,
    workflowId: options.workflowId,
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

/** A transition with no trigger rows is always manually callable; one with only TIME/EVENT
 *  triggers is automation-only. Mirrors `WorkflowEngineService.isManuallyCallable` server-side --
 *  duplicated here only for the entry-action preview (see getEntryActions), since that path has
 *  no registration yet for the server to run its own check against. */
function isManuallyCallable(transition) {
  const triggers = transition.triggers || [];
  return !triggers.length || triggers.some((t) => t.active && t.triggerType === 'MANUAL');
}

export function getRegistrationId(component) {
  return getContext(component).registrationId;
}

export function getWorkflowId(component) {
  return getContext(component).workflowId;
}

export function getAvailableActions(component) {
  const { registrationId } = getContext(component);
  if (!registrationId) {
    return Promise.resolve([]);
  }
  return request(component, 'GET', `${baseUrl(component)}/registrations/${registrationId}/actions`);
}

export function getWorkflowDefinition(component, workflowId) {
  // Workflow definitions are proxied under the "isoware" application segment -- same reasoning
  // as getParties: this is design-time configuration, not infoware-specific data.
  const { apiBase, tenant, database } = getContext(component);
  return request(component, 'GET', `${apiBase}/${tenant}/isoware/${database}/workflow/definitions/${workflowId}`);
}

/**
 * Preview of the actions that would become available the instant a not-yet-created registration
 * is submitted -- i.e. the transitions out of the workflow's entry (NEW-category) status. Used
 * so the `workflow` component can show (and act on) buttons before the registration exists; see
 * Workflow.js's `runEntryAction` for how clicking one actually creates the registration.
 */
export function getEntryActions(component) {
  const { workflowId } = getContext(component);
  if (!workflowId) {
    return Promise.resolve([]);
  }
  return getWorkflowDefinition(component, workflowId).then((workflow) => {
    const entryStatus = (workflow.statuses || []).find((s) => s.category === 'NEW');
    if (!entryStatus) {
      return [];
    }
    return (workflow.transitions || [])
      .filter((t) => t.fromStatusId === entryStatus.id && t.active && isManuallyCallable(t));
  });
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
