import TextFieldForm from '../textfield/TextField.form';

/**
 * Hetzelfde instellingenvenster als een gewoon tekstveld. Er valt hier niets extra's in te stellen:
 * de rol zit in het componenttype en niet in een instelling — dat is het hele punt (zie
 * {@link TicketSubjectComponent}).
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
export default function(...extend) {
  return TextFieldForm(...extend);
}
