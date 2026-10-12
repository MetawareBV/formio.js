import SelectComponent from '../select/Select';

/**
 * De urgentie van een melding — Improware, §3.1 van changes/IMPROWARE_BOUWPLAN.md.
 *
 * <p>Zie {@link TicketSubjectComponent} voor waarom de rol in het componenttype zit. Urgentie is
 * naast het onderwerp de tweede <b>verplichte</b> rol: zonder urgentie geen SLA-berekening en geen
 * escalatie (§7). Een ontwerp zonder dit component mag daarom niet gepubliceerd worden — die regel
 * staat in de backend, want alleen daar is te zien wat er echt gepubliceerd wordt.
 *
 * <h4>De waarden zijn van de klant</h4>
 *
 * {@code Ticket.urgency} is in het datamodel een vrije tekstkolom, juist omdat de classificatie per
 * klant verschilt. De drie waarden hieronder zijn dus een <b>startpunt, geen voorschrift</b>: de
 * auteur vervangt ze door zijn eigen schaal. Let er dan op dat de SLA-inrichting (fase 5) dezelfde
 * waarden gebruikt — de koppeling loopt over de opgeslagen {@code value}, niet over het label.
 */
export default class TicketUrgencyComponent extends SelectComponent {
  static schema(...extend) {
    return SelectComponent.schema(
      {
        type: 'ticketUrgency',
        label: 'Urgentie',
        key: 'urgency',
        data: {
          values: [
            { label: 'Laag', value: 'LAAG' },
            { label: 'Normaal', value: 'NORMAAL' },
            { label: 'Hoog', value: 'HOOG' },
          ],
        },
        validate: {
          required: true,
        },
      },
      ...extend,
    );
  }

  static get builderInfo() {
    return {
      title: 'Urgentie',
      icon: 'exclamation-circle',
      group: 'improware',
      weight: 20,
      schema: TicketUrgencyComponent.schema(),
    };
  }

  get defaultSchema() {
    return TicketUrgencyComponent.schema();
  }
}
