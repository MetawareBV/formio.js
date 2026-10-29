import SelectForm from '../select/Select.form';

/**
 * De instellingen die de bron van dit component vastleggen en die de auteur dus niet moet kunnen
 * omzetten.
 *
 * Anders dan bij {@link TicketAttachmentComponent}, waar de opslagvorm bewust zichtbaar bleef
 * ("wie hem omzet, doet dat bewust"), hoort dat hier niet: de lijst komt niet uit het ontwerp maar
 * uit het relatieregister, en de meeste van deze velden doen daarom **niets** terwijl ze wel
 * suggereren dat ze iets doen. `dataSrc` op "Values" zetten laat het veld niet van bron wisselen —
 * het haalt nog steeds relaties op — en dat is erger dan een ontbrekend veld: dan staat er iets
 * ingesteld dat niet klopt met wat er gebeurt.
 */
const FIXED_BY_DESIGN = [
  'dataSrc',
  'data.json',
  'data.values',
  'data.resource',
  'data.form',
  'data.custom',
  'valueProperty',
  'dataType',
  'idPath',
  'selectFields',
  'limit',
  'disableLimit',
  'filter',
  'sort',
  'searchField',
  'lazyLoad',
  'indexeddb.database',
  'indexeddb.table',
  'indexeddb.filter',
];

/**
 * Hetzelfde instellingenvenster als een gewone keuzelijst, minus de velden die de gegevensbron
 * instellen — die ligt vast in het componenttype.
 *
 * <p>Wat er wél blijft staan is alles waar een auteur iets zinnigs mee kan: label, beschrijving,
 * plaatsing, verplicht, voorwaarden, logica, en ook het sjabloon — wie liever het klantnummer in de
 * lijst ziet dan de naam, zet daar `{{ item.number }}` neer.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
export default function (...extend) {
  // `baseEditForm` levert geen array maar `{ components: [ {type:'tabs', components:[...]}, ... ] }`
  // — met een los `hidden`-veld voor `type` erachter. Dat verschil kostte een rondje: een `.map`
  // hierop gaf "is not a function", en dat bleek pas bij het renderen van het instellingenvenster.
  const form = SelectForm(...extend);
  const tabs = Array.isArray(form && form.components) ? form.components : [];
  return {
    ...form,
    components: tabs.map((entry) => {
      if (!entry || entry.type !== 'tabs' || !Array.isArray(entry.components)) {
        return entry;
      }
      return {
        ...entry,
        components: entry.components.map((tab) =>
          tab && tab.key === 'data' && Array.isArray(tab.components)
            ? {
                ...tab,
                components: tab.components.filter((field) => !FIXED_BY_DESIGN.includes(field && field.key)),
              }
            : tab,
        ),
      };
    }),
  };
}
