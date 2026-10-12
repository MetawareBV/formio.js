import TextFieldComponent from '../textfield/TextField';

/**
 * Het onderwerp van een melding — Improware, zie changes/IMPROWARE_BOUWPLAN.md §3.1.
 *
 * <h4>Waarom dit een eigen componenttype is en geen gewoon tekstveld</h4>
 *
 * §3.1 eist dat de verplichte velden ín het ontwerp zitten: de auteur plaatst onderwerp en urgentie
 * waar hij wil, in de groepering en opmaak die hij wil, want "een vaste kop met titel en urgentie
 * boven een los ontworpen onderstuk is twee formulieren onder elkaar, geen ontwerp". Dat kan alleen
 * als de backend weet wélk veld het onderwerp is.
 *
 * De eerste poging deed dat met een sleutelafbeelding per formulierversie — een tweede scherm waarin
 * je per rol een schemaveld aanwees. Afgekeurd 2026-10-12. Dit is het alternatief: het componenttype
 * *is* de rol. De auteur sleept "Onderwerp" in zijn ontwerp en er valt niets meer af te beelden; de
 * backend herkent de rol aan {@code type} en leest de waarde op de {@code key} die dat component in
 * het schema draagt.
 *
 * <h4>Wat de auteur wél mag veranderen</h4>
 *
 * Alles wat een gewoon tekstveld ook kan: label, beschrijving, plaatsing, breedte, voorwaarden,
 * validatie — en de sleutel. De sleutel is bewust vrij: de backend zoekt op type, niet op naam, dus
 * een hernoeming breekt de projectie niet. Dat was bij de sleutelafbeelding juist de breekbare kant.
 *
 * <p><b>Verplicht staat standaard aan</b>, want zonder onderwerp heeft een melding geen regel in de
 * meldingenlijst. De auteur kan dat uitzetten, maar de backend weigert een melding zonder onderwerp
 * alsnog — formio-validatie is ontwerpgemak, geen waarborg: een inzending kan rechtstreeks gepost
 * worden, buiten de renderer om (§3.1).
 */
export default class TicketSubjectComponent extends TextFieldComponent {
  static schema(...extend) {
    return TextFieldComponent.schema(
      {
        type: 'ticketSubject',
        label: 'Onderwerp',
        key: 'subject',
        validate: {
          required: true,
        },
      },
      ...extend,
    );
  }

  static get builderInfo() {
    return {
      title: 'Onderwerp',
      icon: 'font',
      group: 'improware',
      weight: 0,
      schema: TicketSubjectComponent.schema(),
    };
  }

  get defaultSchema() {
    return TicketSubjectComponent.schema();
  }
}
