import Harness from '../../../test/harness';
import ColorPickerComponent from './ColorPicker';
import assert from 'power-assert';

import { comp1, comp2 } from './fixtures';

describe('ColorPicker Component', () => {
  it('Should build a colorpicker component', () => {
    return Harness.testCreate(ColorPickerComponent, comp1).then((component) => {
      assert(component.element.querySelector('[ref="colorpicker"]'), 'No colorpicker wrapper');
      const inputs = component.element.querySelectorAll('input[ref="input"]');
      assert.equal(inputs.length, 1);
      assert.equal(inputs[0].getAttribute('type'), 'text');
      assert(component.element.querySelector('input[ref="colorNative"]'), 'No native color input');
      assert(
        component.element.querySelectorAll('[ref="colorSwatch"]').length > 20,
        'Expected the default theme palette to be rendered as swatches',
      );
    });
  });

  it('Should not paint an inline background over the "no color" checkerboard', () => {
    return Harness.testCreate(ColorPickerComponent, comp1).then((component) => {
      const noColor = component.element.querySelector('[data-color="transparent"]');
      assert(noColor, 'No "no color" swatch');
      assert.equal(noColor.getAttribute('style'), null);
    });
  });

  it('Should store the value of a clicked swatch and mark it as selected', () => {
    return Harness.testCreate(ColorPickerComponent, comp1).then((component) => {
      const swatch = component.element.querySelector('[data-color="var(--primary, #71717a)"]');
      assert(swatch, 'No swatch for the primary theme token');
      swatch.dispatchEvent(new window.Event('click'));
      assert.equal(component.dataValue, 'var(--primary, #71717a)');
      assert.equal(component.refs.input[0].value, 'var(--primary, #71717a)');
      assert.equal(swatch.getAttribute('aria-pressed'), 'true');
      assert(swatch.className.indexOf('is-selected') !== -1, 'Swatch is not marked as selected');
      const preview = component.element.querySelector('[ref="colorPreview"]');
      assert(
        preview.getAttribute('style').indexOf('var(--primary') !== -1,
        `Preview does not show the value: ${preview.getAttribute('style')}`,
      );
    });
  });

  it('Should sync a plain hex value into the native color input', () => {
    return Harness.testCreate(ColorPickerComponent, comp1).then((component) => {
      component.setValue('#fff');
      assert.equal(component.element.querySelector('input[ref="colorNative"]').value, '#ffffff');
    });
  });

  it('Should show a transparent preview when there is no color', () => {
    return Harness.testCreate(ColorPickerComponent, comp1).then((component) => {
      component.setValue('#ff0000');
      component.setValue('transparent');
      const preview = component.element.querySelector('[ref="colorPreview"]');
      assert(
        preview.className.indexOf('formio-colorpicker-none') !== -1,
        'Preview is not marked as having no color',
      );
      assert.equal(preview.style.background, '');
    });
  });

  it('Should use the configured presets instead of the default palette', () => {
    return Harness.testCreate(ColorPickerComponent, comp2).then((component) => {
      assert.equal(component.element.querySelectorAll('[ref="colorSwatch"]').length, 2);
      assert.equal(component.element.querySelectorAll('input[ref="colorNative"]').length, 0);
      assert.equal(
        component.element.querySelector('[data-color="#ff0000"]').getAttribute('title'),
        'Rood',
      );
    });
  });
});
