import SelectComponent from '../select/Select';
import { getRelationById, searchContacts } from '../relationPicker/utils/relationClient';

/** Het componenttype van de relatiekiezer waar dit veld zijn filter van afleidt. */
const RELATION_TYPE = 'relationPicker';

/**
 * De contactpersoon bij de gekozen relatie — zie §14.6 van changes/IMPROWARE_BOUWPLAN.md in de
 * hoofdrepo.
 *
 * <h4>Twee velden en niet één</h4>
 *
 * "Welke klant" en "wie daar" zijn twee vragen; de legacy hield ze ook apart
 * (`relation1Unid` naast `callerUnid`). Een eigen componenttype is bovendien nodig omdat de backend
 * de rol uit het **type** leest: `relationPicker` gaat naar `ticket.relation_id`, dit veld naar
 * `ticket.contact_id`. Eén component met een instelling "is dit de klant of de contactpersoon?" zou
 * die afleiding kapotmaken.
 *
 * <h4>🔴 Het vindt de relatiekiezer zelf, zonder instelling</h4>
 *
 * De voor de hand liggende oplossing is `refreshOn`: de auteur wijst aan op welk ander veld dit veld
 * moet reageren. Dat is een instelling die hij kan vergeten en fout kan zetten, en dan is het
 * symptoom een lijst met de contactpersonen van álle klanten — niet een foutmelding.
 *
 * In plaats daarvan zoekt dit component het relatieveld op **type** op, net zoals de backend dat
 * doet. Dat mag, want een ontwerp bevat er per afspraak precies één (`IMPROWARE_UNIQUE_TYPES` in de
 * frontend, `duplicateRoles` bij het publiceren). Staat er géén relatieveld in het formulier, dan
 * zoekt dit veld in alle personen en vult de backend de klant aan uit de contactpersoon zelf — ook
 * dat is een geldige inrichting.
 *
 * <h4>Wisselt de klant, dan vervalt de keuze — maar alleen bij een échte wissel</h4>
 *
 * Een contactpersoon hoort bij één klant. Blijft hij staan terwijl de klant wijzigt, dan weigert de
 * backend bij het opslaan (regel 2 van `resolveRelation`) — een omweg om te zeggen wat hier meteen
 * duidelijk kan zijn. Daarom luistert dit component op wijzigingen en maakt het zijn eigen waarde
 * leeg zodra de relatie een andere wordt. Dezelfde keuze als op het detailscherm van een melding.
 *
 * <p>🔴 <b>"Van geen klant naar een klant" is géén wissel.</b> De eerste versie maakte dat
 * onderscheid niet, en daardoor wiste dit veld zichzelf bij het <b>openen van een opgeslagen
 * melding</b>: het formulier vult bij het laden eerst de relatie in, deze luisteraar zag een
 * wijziging, en de contactpersoon die er netjes in stond verdween uit beeld (gezien door Rene,
 * 2026-10-29 — de melding zelf had hem wél, het formulier toonde een leeg veld). Dezelfde fout trof
 * de melder die zijn contactpersoon vóór zijn klant invult; de backend vult daar juist de klant aan.
 * Leegmaken hoort dus alleen als er al een andere klant stond.
 */
export default class ContactPickerComponent extends SelectComponent {
  static schema(...extend) {
    return SelectComponent.schema(
      {
        type: 'contactPicker',
        label: 'Contactpersoon',
        key: 'contactpersoon',
        dataSrc: 'url',
        data: { url: '' },
        valueProperty: 'id',
        template: '<span>{{ item.name }}</span>',
        searchField: 'search',
        minSearch: 0,
        lazyLoad: false,
      },
      ...extend,
    );
  }

  static get builderInfo() {
    return {
      title: 'Contactpersoon',
      // Bestaat als `bi-person`; een onbekende icoonnaam faalt stil (geen icoon, geen fout).
      icon: 'person',
      // Groep `data`, net als de relatiekiezer: ook dit veld is niet improware-eigen.
      group: 'data',
      weight: 11,
      schema: ContactPickerComponent.schema(),
    };
  }

  get defaultSchema() {
    return ContactPickerComponent.schema();
  }

  /**
   * Zie {@link RelationPickerComponent#className}: de opmaak van een keuzelijst hangt aan
   * `formio-component-select`, en een eigen type erft die class niet.
   * @returns {string} - De CSS-classes van dit component.
   */
  get className() {
    return `${super.className} formio-component-select`;
  }

  init() {
    super.init();
    this.lastRelationId = this.currentRelationId();

    // `this.on` hangt aan de emitter van het formulier en wordt bij destroy opgeruimd. Luisteren op
    // elke wijziging en zelf vergelijken is hier eenvoudiger dan `refreshOn`, dat een schemaveld is
    // en dus in het ontwerp zou moeten staan.
    this.on(
      'change',
      () => {
        const current = this.currentRelationId();
        if (current === this.lastRelationId) {
          return;
        }
        const previous = this.lastRelationId;
        this.lastRelationId = current;

        // Alleen bij een échte wissel (van klant A naar klant B) vervalt de keuze. Van "nog geen
        // klant" naar een klant is het laden van een bestaande inzending of een melder die de
        // volgorde omdraait — in allebei die gevallen is er niets ongeldigs om weg te gooien, en
        // weggooien kost de gebruiker juist wat hij al had ingevuld.
        if (previous && this.dataValue) {
          // Eerst de waarde weg, dan pas de lijst verversen: andersom zou de oude naam nog even
          // naast de nieuwe lijst staan.
          this.setValue('', { modified: true });
        }
        this.triggerUpdate();
      },
      true,
    );
  }

  /** Het id van de relatie die in het relatieveld van dit formulier staat, of `null`. */
  currentRelationId() {
    const root = this.root;
    if (!root || typeof root.everyComponent !== 'function') {
      return null;
    }
    let found = null;
    root.everyComponent((component) => {
      if (component && component.component && component.component.type === RELATION_TYPE) {
        found = component;
        return false;
      }
      return true;
    });
    const value = found && found.dataValue;
    return typeof value === 'string' && value ? value : null;
  }

  /**
   * Haalt de contactpersonen zelf op — zie {@link RelationPickerComponent#updateItems} voor waarom
   * dat niet via `component.data.url` loopt.
   *
   * <p>De gekozen relatie komt uit het andere veld en niet uit het ontwerp: zo hoeft de auteur niets
   * te koppelen en kan hij het ook niet verkeerd koppelen.
   * @param {string} searchInput - De zoekterm uit het veld, of leeg.
   */
  updateItems(searchInput) {
    const value = this.dataValue;
    searchContacts(this, searchInput, this.currentRelationId())
      .then((found) => {
        const items = Array.isArray(found) ? found : [];
        const hasValue = value && typeof value === 'string';
        if (!hasValue || items.some((item) => item.id === value)) {
          return items;
        }
        // Een opgeslagen contactpersoon die niet in de lijst zit, er apart bij halen: anders toont
        // het veld een rauw uuid bij het openen van een bestaande inzending.
        return getRelationById(this, value).then((extra) => (Array.isArray(extra) ? extra : []).concat(items));
      })
      .then((items) => {
        this.setItems(items, !!searchInput);
      })
      .catch((err) => {
        this.handleLoadingError(err);
      });
  }
}
