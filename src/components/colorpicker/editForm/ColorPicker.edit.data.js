export default [
  {
    // Replaces the base text field with the picker itself, so a default color is chosen the same
    // way the form's user chooses one. `overrideEditForm` is what lets this win over the base
    // component of the same key -- see EditFormUtils.unifyComponents.
    type: 'colorpicker',
    input: true,
    key: 'defaultValue',
    label: 'Default Value',
    weight: 5,
    // The base field's placeholder is the words "Default Value"; the picker's own hex hint is more
    // useful, and an empty placeholder here is what lets ColorPicker's inputInfo fall back to it.
    placeholder: '',
    tooltip:
      'The Default Value will be the value for this field, before user interaction. Having a default value will override the placeholder text.',
    overrideEditForm: true,
  },
];
