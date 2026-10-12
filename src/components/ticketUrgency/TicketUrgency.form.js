import SelectForm from '../select/Select.form';

/**
 * Hetzelfde instellingenvenster als een gewone keuzelijst — inclusief het waardenoverzicht, want de
 * schaal is van de klant (zie {@link TicketUrgencyComponent}). De rol zit in het componenttype.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
export default function(...extend) {
  return SelectForm(...extend);
}
