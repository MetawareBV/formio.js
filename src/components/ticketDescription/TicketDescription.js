import TextAreaComponent from '../textarea/TextArea';

/**
 * De omschrijving van een melding — Improware, §3.1 van changes/IMPROWARE_BOUWPLAN.md.
 *
 * <p>Zie {@link TicketSubjectComponent} voor waarom de rol in het componenttype zit en niet in een
 * aangewezen sleutel. Anders dan het onderwerp is de omschrijving <b>niet verplicht</b>: een
 * meldingssoort die het met een onderwerp en een paar keuzevelden afkan is een geldige inrichting.
 *
 * <p>De waarde gaat naar de kolom {@code description} van de melding. Dat is een gewone tekstkolom;
 * een auteur die hier opmaak in wil, zet de editor van het tekstvlak aan en krijgt dan HTML in die
 * kolom — zichtbaar in de lijstweergave als platte tekst met tags erin. Beter: opmaak overlaten aan
 * losse velden in het ontwerp.
 */
export default class TicketDescriptionComponent extends TextAreaComponent {
  static schema(...extend) {
    return TextAreaComponent.schema(
      {
        type: 'ticketDescription',
        label: 'Omschrijving',
        key: 'description',
        rows: 5,
      },
      ...extend,
    );
  }

  static get builderInfo() {
    return {
      title: 'Omschrijving',
      icon: 'align-left',
      group: 'improware',
      weight: 10,
      schema: TicketDescriptionComponent.schema(),
    };
  }

  get defaultSchema() {
    return TicketDescriptionComponent.schema();
  }
}
