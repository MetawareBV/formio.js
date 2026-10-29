import { Formio } from '../../../Formio';

/**
 * REST-client voor het `relationPicker`-component — zie §14.6 van changes/IMPROWARE_BOUWPLAN.md in
 * de hoofdrepo.
 *
 * Praat met de Next.js-proxyroute `/{tenant}/relations` onder `options.apiBase`, die de
 * Authorization server-side aanzet en 1-op-1 doorzet naar de Spring Boot
 * `BusinessRelationController`. Het component ziet dus nooit een token; het doet alleen
 * same-origin fetches. Zelfde opzet als `workflowClient.js`.
 *
 * `apiBase` MOET een absolute URL zijn en geen kaal `/api`-pad: `Formio.request` (de fetch-wrapper
 * achter `Formio.makeRequest`) herschrijft elke URL die met `/` begint naar `Formio.baseUrl + url`,
 * en `Formio.baseUrl` is standaard `https://api.form.io` omdat deze app nooit `Formio.setBaseUrl`
 * aanroept. Zonder `location.origin` hieronder gaat elke aanroep dus stilletjes naar de cloud van
 * Form.io in plaats van naar onze eigen proxy.
 *
 * De route is bewust **plat** (geen `/{application}/{database}/`): het relatieregister is
 * tenant-breed, en hetzelfde formulier draait straks onder improware én infoware.
 */
function getContext(component) {
  const options = component.options || {};
  return {
    apiBase: options.apiBase || `${window.location.origin}/api`,
    tenant: options.tenant,
  };
}

function request(component, url) {
  const headers = new Formio.Headers();
  headers.set('Accept', 'application/json');
  return Formio.makeRequest(component.options.formio, 'relations', url, 'GET', null, {
    ignoreCache: true,
    header: headers,
  });
}

function url(component, params) {
  const { apiBase, tenant } = getContext(component);
  return `${apiBase}/${tenant}/relations?${params.toString()}`;
}

/**
 * De relaties die bij een zoekterm horen.
 *
 * `topLevelOnly` en niet `organisationOnly`: het filter kijkt naar de **plaats in de boom** en niet
 * naar de soort. Een tenant mag een persoonssoort inrichten zonder "hangt onder een andere relatie"
 * — een zzp'er, een particulier — en zo iemand ís de klant. Dat onderscheid is in de app zelf twee
 * keer misgegaan; zie de vuistregel in §14.6.
 * @param {import('../RelationPicker').default} component - Het component dat de vraag stelt.
 * @param {string} search - De zoekterm, of leeg voor de eerste lading.
 * @returns {Promise<object[]>} - De gevonden relaties.
 */
export function searchRelations(component, search) {
  const { tenant } = getContext(component);
  if (!tenant) {
    // Zonder tenant is er niets te bevragen. Dat gebeurt in de bouwer-preview, en daar is een lege
    // lijst het eerlijke antwoord — beter dan een aanroep die op een 404 eindigt.
    return Promise.resolve([]);
  }
  const params = new URLSearchParams();
  params.set('topLevelOnly', 'true');
  if (search) {
    params.set('search', search);
  }
  return request(component, url(component, params));
}

/**
 * De contactpersonen die bij een zoekterm horen, eventueel beperkt tot één relatie.
 *
 * `personOnly` is hier wél het juiste filter: een contactpersoon ís een mens, en dat is precies de
 * vraag. Staat er een relatie, dan komt `parentId` erbij en blijft de lijst tot díé klant beperkt.
 * Zonder relatie zoekt hij in alle personen — de backend vult de klant dan aan uit de
 * contactpersoon zelf (regel 3 van `resolveRelation`).
 * @param {object} component - Het component dat de vraag stelt.
 * @param {string} search - De zoekterm, of leeg voor de eerste lading.
 * @param {string|null} parentId - De gekozen relatie, of null.
 * @returns {Promise<object[]>} - De gevonden contactpersonen.
 */
export function searchContacts(component, search, parentId) {
  const { tenant } = getContext(component);
  if (!tenant) {
    return Promise.resolve([]);
  }
  const params = new URLSearchParams();
  params.set('personOnly', 'true');
  if (parentId) {
    params.set('parentId', parentId);
  }
  if (search) {
    params.set('search', search);
  }
  return request(component, url(component, params));
}

/**
 * Eén relatie, opgehaald op id.
 *
 * Nodig voor een formulier dat met een opgeslagen waarde wordt geopend: de zoeklijst is afgetopt op
 * 200 treffers, dus de gekozen relatie zit er niet per se in — en dan zou het veld het rauwe uuid
 * tonen in plaats van de naam.
 * @param {import('../RelationPicker').default} component - Het component dat de vraag stelt.
 * @param {string} id - Het id van de relatie.
 * @returns {Promise<object[]>} - Een lijst met nul of één relatie.
 */
export function getRelationById(component, id) {
  const { tenant } = getContext(component);
  if (!tenant || !id) {
    return Promise.resolve([]);
  }
  const params = new URLSearchParams();
  params.set('id', id);
  return request(component, url(component, params)).catch(() => []);
}
