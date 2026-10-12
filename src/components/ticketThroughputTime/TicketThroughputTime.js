import NumberComponent from '../number/Number';

/**
 * De afgesproken doorlooptijd van een melding — Improware, §3.1 van changes/IMPROWARE_BOUWPLAN.md.
 *
 * <p>Zie {@link TicketSubjectComponent} voor waarom de rol in het componenttype zit. Niet verplicht:
 * de meeste soorten krijgen hun doorlooptijd uit de SLA-inrichting en niet van de melder.
 *
 * <p>Een geheel getal, want de kolom is een {@code Integer}. Een auteur die hier decimalen toestaat
 * krijgt een waarde die de backend niet kan overnemen; die valt dan stil weg (met een regel in het
 * log) omdat een melding opslaan belangrijker is dan haar doorlooptijd. Vandaar {@code integer} aan
 * in de validatie.
 *
 * <p><b>De eenheid hoort hier nog niet bij.</b> {@code Ticket.throughputTimeUnit} (uren of dagen)
 * bestaat wel als kolom, maar de projectie in de backend kent er geen rol voor — een component dat
 * de eenheid vraagt zou dus stil niets doen. Dat is een keuze voor fase 5, waar de berekening
 * gebouwd wordt: die moet een lege eenheid sowieso expliciet afhandelen.
 */
export default class TicketThroughputTimeComponent extends NumberComponent {
  static schema(...extend) {
    return NumberComponent.schema(
      {
        type: 'ticketThroughputTime',
        label: 'Doorlooptijd',
        key: 'throughputTime',
        validate: {
          integer: true,
          min: 0,
        },
      },
      ...extend,
    );
  }

  static get builderInfo() {
    return {
      title: 'Doorlooptijd',
      icon: 'clock-o',
      group: 'improware',
      weight: 40,
      schema: TicketThroughputTimeComponent.schema(),
    };
  }

  get defaultSchema() {
    return TicketThroughputTimeComponent.schema();
  }
}
