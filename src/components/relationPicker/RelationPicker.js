import SelectComponent from '../select/Select';
import { getRelationById, searchRelations } from './utils/relationClient';

/**
 * Een relatie uit het relatieregister kiezen — zie §14.6 van changes/IMPROWARE_BOUWPLAN.md in de
 * hoofdrepo.
 *
 * <h4>Waarom dit een eigen componenttype is</h4>
 *
 * Het kán met een gewone keuzelijst op een URL: `dataSrc: url`, het juiste pad, `valueProperty: id`,
 * een zoekveld en een sjabloon. Dat zijn vijf instellingen die een auteur niet kan weten en waarvan
 * er vier stil fout gaan — een verkeerd pad levert een lege lijst op, een vergeten `valueProperty`
 * slaat het hele object op in plaats van het id. Dit component zet ze vast.
 *
 * <h4>Bewust niet `ticketRelation`</h4>
 *
 * De andere eigen componenten heten `ticketSubject`, `ticketAttachment` — die naam draagt de
 * applicatie in zich. Een relatie aanwijzen is geen improware-eigenaardigheid: een
 * infoware-formulier wil het net zo goed (besloten met Rene, 2026-10-29). Hernoemen achteraf is
 * duur, want `TicketFormFields` in de backend schakelt op de letterlijke type-string en een bestaand
 * ontwerp houdt het oude type in `form_version.form_schema`.
 *
 * <h4>Wat het opslaat</h4>
 *
 * Het **id**, niet de naam. Een naam in de antwoorden wijst nergens meer naar zodra een relatie
 * wordt hernoemd. De weergavenaam komt bij het tonen uit het register; op een melding staat hij
 * daarnaast gedenormaliseerd in `ticket.relation_name`, bijgewerkt bij elke save.
 *
 * <h4>Waarom `updateItems` is overschreven en er geen URL in het ontwerp staat</h4>
 *
 * `ListComponent.updateItems` leest de URL uit `component.data.url` — dus uit het **opgeslagen
 * ontwerp**. De tenant staat pas bij het renderen vast (`options.tenant`), dus die URL zou óf in het
 * ontwerp gebakken worden (en dan klopt hij voor precies één klant), óf bij elke render in het
 * schema geschreven worden (en dan belandt hij alsnog in de opslag zodra de bouwer serialiseert).
 * Daarom haalt dit component zijn eigen lijst op en zet die met `setItems`; `dataSrc: 'url'` blijft
 * staan omdat de rest van `Select` daarop stuurt — geen client-side filteren, wachten op de server,
 * en de zoekterm via het `search`-event.
 */
export default class RelationPickerComponent extends SelectComponent {
  static schema(...extend) {
    return SelectComponent.schema(
      {
        type: 'relationPicker',
        label: 'Relatie',
        key: 'relatie',
        // De lijst komt van de server, niet uit het ontwerp. `data.url` blijft leeg: zie de uitleg
        // hierboven over waarom die niet in het schema hoort.
        dataSrc: 'url',
        data: { url: '' },
        // Het id als waarde, de naam als label.
        valueProperty: 'id',
        template: '<span>{{ item.name }}</span>',
        // Zet het zoekveld aan de serverkant: Choices filtert dan niet zelf en stuurt elke
        // toetsaanslag door als `search`-event. De naam van het veld komt terug in de query.
        searchField: 'search',
        // Zonder minimum zoekt hij ook bij een leeg veld, en dat is precies de bedoeling: de eerste
        // lading toont de relaties die er zijn, zoals het lijstscherm dat ook doet.
        minSearch: 0,
        lazyLoad: false,
      },
      ...extend,
    );
  }

  static get builderInfo() {
    return {
      title: 'Relatie',
      // Bestaat als `bi-building`; een onbekende icoonnaam faalt stil (geen icoon, geen fout).
      icon: 'building',
      // Groep `data` en niet `improware`: dit component is bedoeld om ook in infoware bruikbaar te
      // zijn, en `WebformBuilder.addBuilderComponentInfo` slaat een component over waarvan de groep
      // niet in `options.builder` staat. Een improware-groep zou het dus precies daar verbergen.
      group: 'data',
      weight: 10,
      schema: RelationPickerComponent.schema(),
    };
  }

  get defaultSchema() {
    return RelationPickerComponent.schema();
  }

  /**
   * De opmaak van een keuzelijst hangt aan `formio-component-select`, en die class komt uit het
   * componenttype ({@link Component#className} zet `formio-component-${type}`). Een eigen type
   * betekent dus een eigen class en opmaak die niet meer aanslaat — hetzelfde als bij
   * {@link TicketAttachmentComponent} en het bestandsveld, waar dat een onklikbare knop opleverde.
   * @returns {string} - De CSS-classes van dit component.
   */
  get className() {
    return `${super.className} formio-component-select`;
  }

  /**
   * Haalt de lijst zelf op in plaats van via `component.data.url`.
   *
   * <p>Staat er een waarde die niet in de zoekuitkomst zit — een formulier dat met een opgeslagen
   * relatie wordt geopend, terwijl de lijst op 200 treffers is afgetopt — dan wordt díé relatie er
   * apart bij gehaald. Zonder dat toont het veld het rauwe uuid, en dat leest als een kapot
   * formulier.
   * @param {string} searchInput - De zoekterm uit het veld, of leeg.
   */
  updateItems(searchInput) {
    const value = this.dataValue;
    searchRelations(this, searchInput)
      .then((found) => {
        const items = Array.isArray(found) ? found : [];
        const hasValue = value && typeof value === 'string';
        if (!hasValue || items.some((item) => item.id === value)) {
          return items;
        }
        return getRelationById(this, value).then((extra) => (Array.isArray(extra) ? extra : []).concat(items));
      })
      .then((items) => {
        this.setItems(items, !!searchInput);
      })
      .catch((err) => {
        // Niet fataal: een kapotte verbinding hoort het hele formulier niet onbruikbaar te maken.
        // `handleLoadingError` zet de foutstand van Select zelf en laat de rest staan.
        this.handleLoadingError(err);
      });
  }
}
