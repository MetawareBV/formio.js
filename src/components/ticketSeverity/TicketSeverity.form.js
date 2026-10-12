import SelectForm from '../select/Select.form';

/**
 * Hetzelfde instellingenvenster als een gewone keuzelijst; de rol zit in het componenttype.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
export default function(...extend) {
  return SelectForm(...extend);
}
