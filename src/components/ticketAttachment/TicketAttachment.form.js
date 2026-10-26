import FileForm from '../file/File.form';

/**
 * Hetzelfde instellingenvenster als een gewoon bestandsveld. Er valt hier niets extra's in te
 * stellen: wat dit component bijzonder maakt — de opslagvorm en de maximale grootte — staat in zijn
 * schema en niet in een extra instelling (zie {@link TicketAttachmentComponent}).
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
export default function(...extend) {
  return FileForm(...extend);
}
