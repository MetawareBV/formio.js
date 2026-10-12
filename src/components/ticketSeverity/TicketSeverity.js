import SelectComponent from '../select/Select';

/**
 * De ernst van een melding — Improware, §3.1 van changes/IMPROWARE_BOUWPLAN.md.
 *
 * <p>Zie {@link TicketUrgencyComponent}; dit is hetzelfde verhaal met één verschil: ernst is
 * <b>niet verplicht</b>. Urgentie zegt hoe snel het moet, ernst hoe erg het is, en de prioriteit
 * volgt uit de combinatie — maar een inrichting die alleen op urgentie stuurt is geldig.
 */
export default class TicketSeverityComponent extends SelectComponent {
  static schema(...extend) {
    return SelectComponent.schema(
      {
        type: 'ticketSeverity',
        label: 'Ernst',
        key: 'severity',
        data: {
          values: [
            { label: 'Laag', value: 'LAAG' },
            { label: 'Normaal', value: 'NORMAAL' },
            { label: 'Hoog', value: 'HOOG' },
          ],
        },
      },
      ...extend,
    );
  }

  static get builderInfo() {
    return {
      title: 'Ernst',
      icon: 'exclamation-triangle',
      group: 'improware',
      weight: 30,
      schema: TicketSeverityComponent.schema(),
    };
  }

  get defaultSchema() {
    return TicketSeverityComponent.schema();
  }
}
