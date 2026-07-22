import Harness from '../../../test/harness';
import ImageComponent from './Image';
import sinon from 'sinon';
import assert from 'power-assert';

import {
  comp1,
  comp2
} from './fixtures';

describe('Image Component', () => {
  it('Should build an image component', () => {
    return Harness.testCreate(TitleComponent, comp1);
  });

  it('Should build an html component and ignore empty attribute name', () => {
    const comp = comp1;
    comp.attrs.push({
      'attr': '',
      'value': ''
    });

    return Harness.testCreate(ImageComponent, comp1);
  });

  it('setContent should not be called if it is not conditionally visible', () => {
    return Harness.testCreate(ImageComponent, comp2).then((component) => {
      const emit = sinon.spy(component, 'setContent');
      component.checkRefreshOn(null);
      assert.equal(emit.callCount, 0);
    });
  });
});
