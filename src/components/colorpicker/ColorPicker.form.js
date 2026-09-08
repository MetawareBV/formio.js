import Components from '../Components';

import ColorPickerEditData from './editForm/ColorPicker.edit.data';
import ColorPickerEditDisplay from './editForm/ColorPicker.edit.display';

/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
export default function (...extend) {
  return Components.baseEditForm(
    [
      {
        key: 'display',
        components: ColorPickerEditDisplay,
      },
      {
        key: 'data',
        components: ColorPickerEditData,
      },
    ],
    ...extend,
  );
}
