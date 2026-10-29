import RelationPickerForm from '../relationPicker/RelationPicker.form';

/**
 * Hetzelfde instellingenvenster als de relatiekiezer: dezelfde velden liggen vast, om dezelfde
 * reden. Zie {@link RelationPickerForm} — daar staat ook waarom `baseEditForm` geen array oplevert.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
export default function (...extend) {
  return RelationPickerForm(...extend);
}
