import { Formio } from '../../src/Formio';
import Harness from '../harness';
import DataMapComponent from '../../src/components/datamap/DataMap';
<<<<<<< HEAD
import { comp1, formWithConditionalPanel } from './fixtures/datamap';
import assert from 'power-assert';

describe('DataMap Component', () => {
  it('Should build a data map component', () => {
    return Harness.testCreate(DataMapComponent, comp1);
  });

  it('Should get and set values within the datamap.', () => {
=======
import { comp1, formWithConditionalPanel } from './fixtures/datamap/index';
import assert from 'power-assert';

describe('DataMap Component', function () {
  it('Should build a data map component', function () {
    return Harness.testCreate(DataMapComponent, comp1);
  });

  it('Should get and set values within the datamap.', function () {
>>>>>>> upstream/main
    return Harness.testCreate(DataMapComponent, comp1).then((component) => {
      Harness.testSetGet(component, {
        one: 'One',
        two: 'Two',
<<<<<<< HEAD
        three: 'Three'
=======
        three: 'Three',
>>>>>>> upstream/main
      });
    });
  });

<<<<<<< HEAD
  it(
    'Should render data from submission properly when the Data Map is inside conditionally shown layout component',
    (done) => {
      Formio.createForm(document.createElement('div'), formWithConditionalPanel, { readOnly: true })
        .then((form) => {
          form.submission = {
            data: {
              checkbox: true,
              dataMap1: {
                key: 'a'
              },
              dataMap: {
                key: 'b',
                key1: 'c',
              },
            },
            state: 'submitted',
          };

          setTimeout(() => {
            const dataMap1 = form.getComponent(['dataMap1']);
            const dataMap = form.getComponent(['dataMap']);
            assert.equal(dataMap1.visible, true, 'Data Map should become visible');
            assert.equal(dataMap.visible, true, 'Data Map inside a panel should become visible');
            assert.deepEqual(dataMap1.dataValue, {
              key: 'a'
            }, 'Should set value of the Data Map properly');
            assert.deepEqual(dataMap.dataValue, {
              key: 'b',
              key1: 'c',
            }, 'Should set value of the Data Map inside a panel properly');
            assert.equal(dataMap1.rows.length, 1, 'Should create rows for Data Grid');
            assert.equal(dataMap.rows.length, 2, 'Should create rows for Data Grid inside a panel');

            done();
          }, 300);
        })
        .catch(done);
    }
  );
=======
  it('Should render datamap values for review page and email views', function () {
    return Harness.testCreate(DataMapComponent, comp1).then((component) => {
      component.setValue({
        one: 'One',
        two: 'Two',
      });

      const reviewView = component.getView(component.dataValue, { email: true, review: true });
      assert(reviewView.includes('One'), 'Should include first value');
      assert(reviewView.includes('Two'), 'Should include second value');
      assert(!reviewView.includes('undefined'), 'Should not include undefined values');
      assert(reviewView.includes('<table'), 'Should render as a table');
    });
  });

  it('Should render data from submission properly when the Data Map is inside conditionally shown layout component', function (done) {
    Formio.createForm(document.createElement('div'), formWithConditionalPanel, { readOnly: true })
      .then((form) => {
        form.submission = {
          data: {
            checkbox: true,
            dataMap1: {
              key: 'a',
            },
            dataMap: {
              key: 'b',
              key1: 'c',
            },
          },
          state: 'submitted',
        };

        setTimeout(() => {
          const dataMap1 = form.getComponent([
            'dataMap1',
          ]);
          const dataMap = form.getComponent([
            'dataMap',
          ]);
          assert.equal(dataMap1.visible, true, 'Data Map should become visible');
          assert.equal(dataMap.visible, true, 'Data Map inside a panel should become visible');
          assert.deepEqual(
            dataMap1.dataValue,
            {
              key: 'a',
            },
            'Should set value of the Data Map properly',
          );
          assert.deepEqual(
            dataMap.dataValue,
            {
              key: 'b',
              key1: 'c',
            },
            'Should set value of the Data Map inside a panel properly',
          );
          assert.equal(dataMap1.rows.length, 1, 'Should create rows for Data Grid');
          assert.equal(dataMap.rows.length, 2, 'Should create rows for Data Grid inside a panel');

          done();
        }, 300);
      })
      .catch(done);
  });
>>>>>>> upstream/main
});
