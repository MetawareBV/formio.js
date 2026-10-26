import FileComponent from '../file/File';

/**
 * Een bijlage bij een melding — Improware, zie changes/IMPROWARE_BOUWPLAN.md §14.2.
 *
 * <h4>Waarom dit een eigen componenttype is en geen gewoon bestandsveld</h4>
 *
 * Een melder moet een foto of een document kunnen meesturen in het formulier zelf. Dat kán met
 * formio's eigen `file`-component, maar dan moet de auteur twee dingen goed zetten die hij niet kan
 * weten: de opslagvorm (`base64`, want het bestand reist mee in de inzending — vorm B uit §14.2) en
 * de maximale grootte (gelijk aan wat de backend toestaat). Zet hij ze fout, dan ziet de melder zijn
 * melding pas sneuvelen ná het indienen, of levert het veld een bestand op dat nergens heen gaat.
 *
 * Dit component zet die twee vast. De auteur sleept "Bijlage" in zijn ontwerp en hoeft verder niets
 * te weten; hetzelfde principe als bij {@link TicketSubjectComponent}, waar het componenttype de rol
 * draagt in plaats van een instelling.
 *
 * <h4>Wat de backend ermee doet</h4>
 *
 * Bij het aanmaken van een melding haalt `TicketService.extractFormFiles` de inhoud uit de
 * antwoorden en maakt er een gewone bijlage van, met de zichtbaarheidsregels van §3.6. Wat er in de
 * antwoorden achterblijft is naam, grootte en type — nooit de inhoud zelf, want een base64-blob in
 * de jsonb is een bijlage die al die regels ontloopt en meerijdt in elke respons.
 *
 * <p>De backend herkent dit veld aan zijn type én aan het gewone `file`-type, zodat een ontwerp dat
 * het standaardveld gebruikt blijft werken.
 *
 * <h4>Wat de auteur wél mag veranderen</h4>
 *
 * Alles wat een gewoon bestandsveld ook kan: label, beschrijving, plaatsing, meerdere bestanden,
 * toegestane bestandstypen, voorwaarden — en de sleutel, want de backend zoekt op type en niet op
 * naam. De opslagvorm en de maximale grootte staan in het instellingenvenster nog steeds te lezen;
 * wie ze omzet, doet dat bewust.
 */
export default class TicketAttachmentComponent extends FileComponent {
  static schema(...extend) {
    return FileComponent.schema(
      {
        type: 'ticketAttachment',
        label: 'Bijlage',
        key: 'bijlage',
        // Het bestand reist mee in de inzending (vorm B): één verzoek, en dus geen half-geüploade
        // bestanden die opgeruimd moeten worden als er nooit op indienen wordt gedrukt.
        storage: 'base64',
        // Gelijk aan TicketAttachmentService.MAX_FORM_ATTACHMENT_BYTES in de backend. Staat hier
        // meer dan daar, dan weigert de server een bestand dat het scherm toeliet.
        fileMaxSize: '20MB',
      },
      ...extend,
    );
  }

  static get builderInfo() {
    return {
      title: 'Bijlage',
      icon: 'file',
      group: 'improware',
      weight: 30,
      schema: TicketAttachmentComponent.schema(),
    };
  }

  get defaultSchema() {
    return TicketAttachmentComponent.schema();
  }
}
