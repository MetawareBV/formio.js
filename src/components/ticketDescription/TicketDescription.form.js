import TextAreaForm from '../textarea/TextArea.form';

/**
 * Hetzelfde instellingenvenster als een gewoon tekstvlak; de rol zit in het componenttype.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
export default function(...extend) {
  return TextAreaForm(...extend);
}
