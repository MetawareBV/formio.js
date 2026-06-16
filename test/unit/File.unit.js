import assert from 'power-assert';
import Harness from '../harness';
import FileComponent from '../../src/components/file/File';
<<<<<<< HEAD
import { comp1, comp2 } from './fixtures/file';
import { Formio } from '../../src/Formio';
import _ from 'lodash';

describe('File Component', () => {
  it('Should create a File Component', () => {
=======
import { comp1, comp2, comp4 } from './fixtures/file/index';
import { Formio } from '../../src/Formio';
import _ from 'lodash';
import { wait } from '../util';
import * as testFileUpload from '../forms/formWithFileComponent';

describe('File Component', function () {
  it('Should create a File Component', function () {
>>>>>>> upstream/main
    return Harness.testCreate(FileComponent, comp1).then((component) => {
      const parentNode = document.createElement('div');
      const element = document.createElement('div');
      parentNode.appendChild(element);
      component.build(element);
      Harness.testElements(component, 'ul.list-group-striped li.list-group-header', 1);
      Harness.testElements(component, 'ul.list-group-striped li.list-group-item', 1);
      Harness.testElements(component, 'a.browse', 1);
      assert(component.checkValidity(component.getValue()), 'Item should be valid');
      component.setValue([
        {
          storage: 'base64',
          name: 'IMG_5235-ce0abe18-5d3e-4ab4-84ca-b3e06684bc86.jpg',
          url: 'data:image/jpg;base64,AAAAIGZ0eXBoZWljAAAAAG1pZjF',
          size: 1159732,
          type: 'image/jpeg',
          originalName: 'IMG_5235.jpg',
        },
        {
          storage: 'base64',
          name: 'IMG_5235-ce0abe18-5d3e-4ab4-84ca-b3e06684bc86.png',
          url: 'data:image/jpg;base64,AAAAIGZ0eXBoZWljAAAAAG1pZjF',
          size: 34533,
          type: 'image/png',
          originalName: 'IMG_5235.png',
<<<<<<< HEAD
        }
=======
        },
>>>>>>> upstream/main
      ]);
      Harness.testElements(component, 'ul.list-group-striped li.list-group-header', 1);
      Harness.testElements(component, 'ul.list-group-striped li.list-group-item', 3);
      Harness.testElements(component, 'a.browse', 0);
      assert(component.checkValidity(component.getValue()), 'Item should be valid');
    });
  });

<<<<<<< HEAD
  it('Should hide loader after loading process', () => {
=======
  it('Should show correct error messages maxSize and minSize ', async () => {
    const comp4Cloned = _.cloneDeep(comp4);
    const element = document.createElement('div');

    const form = await Formio.createForm(element, comp4Cloned);
    const value =
      [{
        lastModified: 1746689434865,
        lastModifiedDate: "Thu May 08 2025",
        name: "basic.json",
        size: 200000000000000,   // huge file > 5MB
        type: "application/json",
        webkitRelativePath: ""
      }]
    const file = form.getComponent('file');
    file.handleFilesToUpload(value);
    await wait(300);
    const errorMax = file.element.querySelector('.list-group-item .status.text-danger');
    assert.equal(errorMax.textContent, "File is too big; it must be at most 5MB");
    file.rebuild();
    await wait(300);
    value[0].size = 10;  // tiny file < 1MB
    file.handleFilesToUpload(value);
    await wait(300);
    const errorMin = file.element.querySelector('.list-group-item .status.text-danger');
    assert.equal(errorMin.textContent, "File is too small; it must be at least 1MB");
  });

  it('Should be returned an error about invalid parameters if we made a typo in a parameter in the configuration', async () => {
    const comp4Cloned = _.cloneDeep(comp4);
    delete comp4Cloned.config.maxAttachmentSize;
    comp4Cloned.config.maxxxxxxAttachmentSize = '5MB' // special typo to get typo error
    const element = document.createElement('div');

    const form = await Formio.createForm(element, comp4Cloned);
    const value =
      [{
        lastModified: 1746689434865,
        lastModifiedDate: "Thu May 08 2025",
        name: "basic.json",
        size: 20000000000,
        type: "application/json",
        webkitRelativePath: ""
      }]

    const file = form.getComponent('file');
    file.handleFilesToUpload(value);
    await wait(300);
    const errorTypo = file.element.querySelector('.list-group-item .status.text-danger');
    assert.equal(errorTypo.textContent, "Please, check the entered parameters");
  });

  it('Should hide loader after loading process', function () {
>>>>>>> upstream/main
    return Harness.testCreate(FileComponent, comp1).then((component) => {
      const parentNode = document.createElement('div');
      const element = document.createElement('div');
      parentNode.appendChild(element);
      component.build(element);
      Harness.testElements(component, 'div.loader-wrapper', 1);
      component.setValue([
        {
          storage: 'base64',
          name: 'IMG_5235-ce0abe18-5d3e-4ab4-84ca-b3e06684bc86.jpg',
          url: 'data:image/jpg;base64,AAAAIGZ0eXBoZWljAAAAAG1pZjF',
          size: 1159732,
          type: 'image/jpeg',
          originalName: 'IMG_5235.jpg',
<<<<<<< HEAD
        }
=======
        },
>>>>>>> upstream/main
      ]);
      Harness.testElements(component, 'div.loader-wrapper', 0);
    });
  });

<<<<<<< HEAD
  it('Should create a multiple File Component', () => {
=======
  it('Should create a multiple File Component', function () {
>>>>>>> upstream/main
    comp1.multiple = true;
    return Harness.testCreate(FileComponent, comp1).then((component) => {
      const parentNode = document.createElement('div');
      const element = document.createElement('div');
      parentNode.appendChild(element);
      component.build(element);
      Harness.testElements(component, 'ul.list-group-striped li.list-group-header', 1);
      Harness.testElements(component, 'ul.list-group-striped li.list-group-item', 1);
      Harness.testElements(component, 'a.browse', 1);
      assert(component.checkValidity(component.getValue()), 'Item should be valid');
      component.setValue([
        {
          storage: 'base64',
          name: 'IMG_5235-ce0abe18-5d3e-4ab4-84ca-b3e06684bc86.jpg',
          url: 'data:image/jpg;base64,AAAAIGZ0eXBoZWljAAAAAG1pZjF',
          size: 1159732,
          type: 'image/jpeg',
          originalName: 'IMG_5235.jpg',
        },
        {
          storage: 'base64',
          name: 'IMG_5235-ce0abe18-5d3e-4ab4-84ca-b3e06684bc86.png',
          url: 'data:image/jpg;base64,AAAAIGZ0eXBoZWljAAAAAG1pZjF',
          size: 34533,
          type: 'image/png',
          originalName: 'IMG_5235.png',
<<<<<<< HEAD
        }
=======
        },
>>>>>>> upstream/main
      ]);
      Harness.testElements(component, 'ul.list-group-striped li.list-group-header', 1);
      Harness.testElements(component, 'ul.list-group-striped li.list-group-item', 3);
      Harness.testElements(component, 'a.browse', 1);
      assert(component.checkValidity(component.getValue()), 'Item should be valid');
    });
  });

<<<<<<< HEAD
  it('Should validate uploaded file according to the pattern', (done) => {
    Harness.testCreate(FileComponent, comp1).then((component) => {
      const validFiles =[
        {
          name: 'test.jpg',
          size: 27401,
          type: 'image/jpeg'
=======
  it('Should validate uploaded file according to the pattern', function (done) {
    Harness.testCreate(FileComponent, comp1).then((component) => {
      const validFiles = [
        {
          name: 'test.jpg',
          size: 27401,
          type: 'image/jpeg',
>>>>>>> upstream/main
        },
        {
          name: 'TypeScript.pdf',
          size: 203123,
<<<<<<< HEAD
          type: 'application/pdf'
=======
          type: 'application/pdf',
>>>>>>> upstream/main
        },
        {
          name: 'build with dist.png',
          size: 137321,
<<<<<<< HEAD
          type: 'image/png'
        }
=======
          type: 'image/png',
        },
>>>>>>> upstream/main
      ];

      const invalidFiles = [
        {
          name: 'eventsList.xlsx',
          size: 16022,
<<<<<<< HEAD
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
=======
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
>>>>>>> upstream/main
        },
        {
          name: 'lazy load.mp4',
          size: 9083622,
<<<<<<< HEAD
          type: 'video/mp4'
=======
          type: 'video/mp4',
>>>>>>> upstream/main
        },
      ];

      const pattern = '  .jpg,     .png,    .exe,     .pdf ';

      const checkValidatePattern = (files, valid) => {
<<<<<<< HEAD
        files.forEach(file => {
          assert.equal(component.validatePattern(file, pattern), valid, `File ${file.name} should ${valid ? '' : 'not'} correspond to the pattern`);
=======
        files.forEach((file) => {
          assert.equal(
            component.validatePattern(file, pattern),
            valid,
            `File ${file.name} should ${valid ? '' : 'not'} correspond to the pattern`,
          );
>>>>>>> upstream/main
        });
      };

      checkValidatePattern(validFiles, true);
      checkValidatePattern(invalidFiles, false);
      done();
    });
  });

<<<<<<< HEAD
  it('Should display uploaded file in file component only after saving', (done) => {
    const form = _.cloneDeep(comp2);
    const element = document.createElement('div');

    Formio.createForm(element, form).then(form => {
      const value = [
        {
          storage: 'base64',
          name: '33-0ae897b9-c808-4832-a5e1-4e5d0c725f1b.jpg',
          url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD…CiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//2Q==',
          size: 102691,
          type: 'image/jpeg',
          originalName: '33.jpg',
        },
      ];
      const file = form.getComponent('file');
      const openModalButton = file.componentModal.refs.openModal;
      const clickEvent = new Event('click');
      openModalButton.dispatchEvent(clickEvent);

      setTimeout(() => {
        assert.equal(file.componentModal.isOpened, true);
        file.dataValue = value;
        file.redraw();

        setTimeout(() => {
          assert.equal(file.refs.fileLink.length, 1);
          const modalOverlayButton = file.componentModal.refs.modalOverlay;
          modalOverlayButton.dispatchEvent(clickEvent);

          setTimeout(() => {
            assert.equal(!!file.componentModal.dialogElement, true);
            const dialogYesButton = file.componentModal.dialogElement.refs.dialogYesButton;
            dialogYesButton.dispatchEvent(clickEvent);

            setTimeout(() => {
              assert.equal(!!file.componentModal.dialogElement, false);
              file.componentModal.closeModal();

              setTimeout(() => {
                assert.equal(file.componentModal.isOpened, false);
                assert.equal(file.refs.fileLink.length, 0);
                assert.equal(file.componentModal.refs.openModal.textContent.trim(), 'Click to set value');
                done();
=======
  it('Should display uploaded file in file component only after saving', function (done) {
    const form = _.cloneDeep(comp2);
    const element = document.createElement('div');

    Formio.createForm(element, form)
      .then((form) => {
        const value = [
          {
            storage: 'base64',
            name: '33-0ae897b9-c808-4832-a5e1-4e5d0c725f1b.jpg',
            url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD…CiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//2Q==',
            size: 102691,
            type: 'image/jpeg',
            originalName: '33.jpg',
          },
        ];
        const file = form.getComponent('file');
        const openModalButton = file.componentModal.refs.openModal;
        const clickEvent = new Event('click');
        openModalButton.dispatchEvent(clickEvent);

        setTimeout(() => {
          assert.equal(file.componentModal.isOpened, true);
          file.dataValue = value;
          file.redraw();

          setTimeout(() => {
            assert.equal(file.refs.fileLink.length, 1);
            const modalOverlayButton = file.componentModal.refs.modalOverlay;
            modalOverlayButton.dispatchEvent(clickEvent);

            setTimeout(() => {
              assert.equal(!!file.componentModal.dialogElement, true);
              const dialogYesButton = file.componentModal.dialogElement.refs.dialogYesButton;
              dialogYesButton.dispatchEvent(clickEvent);

              setTimeout(() => {
                assert.equal(!!file.componentModal.dialogElement, false);
                file.componentModal.closeModal();

                setTimeout(() => {
                  assert.equal(file.componentModal.isOpened, false);
                  assert.equal(file.refs.fileLink.length, 0);
                  assert.equal(
                    file.componentModal.refs.openModal.textContent.trim(),
                    'Click to set value',
                  );
                  done();
                }, 200);
>>>>>>> upstream/main
              }, 200);
            }, 200);
          }, 200);
        }, 200);
<<<<<<< HEAD
      }, 200);
    }).catch(done);
  });

  it('Should not incorrectly validate a non-multiple File component', () => {
=======
      })
      .catch(done);
  });

  it('Should not incorrectly validate a non-multiple File component', function () {
>>>>>>> upstream/main
    comp1.multiple = false;
    return Harness.testCreate(FileComponent, comp1).then((component) => {
      assert(component.checkValidity(), 'Item should be valid');
      component.setValue([
        {
          storage: 'base64',
          name: 'IMG_5235-ce0abe18-5d3e-4ab4-84ca-b3e06684bc86.jpg',
          url: 'data:image/jpg;base64,AAAAIGZ0eXBoZWljAAAAAG1pZjF',
          size: 1159732,
          type: 'image/jpeg',
          originalName: 'IMG_5235.jpg',
<<<<<<< HEAD
        }
      ]);
      assert(component.checkValidity(), 'Item should be valid');
    });
  })

  it('Should not incorrectly validate a multiple File Component', () => {
=======
        },
      ]);
      assert(component.checkValidity(), 'Item should be valid');
    });
  });

  it('Should not incorrectly validate a multiple File Component', function () {
>>>>>>> upstream/main
    comp1.multiple = true;
    return Harness.testCreate(FileComponent, comp1).then((component) => {
      assert(component.checkValidity(), 'Item should be valid');
      component.setValue([
        {
          storage: 'base64',
          name: 'IMG_5235-ce0abe18-5d3e-4ab4-84ca-b3e06684bc86.jpg',
          url: 'data:image/jpg;base64,AAAAIGZ0eXBoZWljAAAAAG1pZjF',
          size: 1159732,
          type: 'image/jpeg',
          originalName: 'IMG_5235.jpg',
<<<<<<< HEAD
        }
=======
        },
>>>>>>> upstream/main
      ]);
      assert(component.checkValidity(), 'Item should be valid');
    });
  });

<<<<<<< HEAD
  it('Should abort the correct file when user clicks the file remove button', (done) => {
    const cmp =  _.cloneDeep(comp1);
=======
  it('Should abort the correct file when user clicks the file remove button', function (done) {
    const cmp = _.cloneDeep(comp1);
>>>>>>> upstream/main
    const abortedFiles = [];
    cmp.multiple = true;
    cmp.storage = 'url';

    const options = {
      fileService: {
<<<<<<< HEAD
        uploadFile: function(storage, file, fileName, dir, progressCallback, url, options, fileKey, groupPermissions, groupId, uploadStartCallback, abortCallbackSetter) {
=======
        uploadFile: function (
          storage,
          file,
          fileName,
          dir,
          progressCallback,
          url,
          options,
          fileKey,
          groupPermissions,
          groupId,
          uploadStartCallback,
          abortCallbackSetter,
        ) {
>>>>>>> upstream/main
          return new Promise((resolve, reject) => {
            // complete upload after 1s.
            setTimeout(() => {
              progressCallback({ loaded: 1, total: 1 });
            }, 10);

            const timeout = setTimeout(() => {
              const uploadResponse = {
                name: fileName,
                size: file.size,
                type: 'application/pdf',
<<<<<<< HEAD
                url: `fake/url/${fileName}`
=======
                url: `fake/url/${fileName}`,
>>>>>>> upstream/main
              };
              resolve(uploadResponse);
            }, 1000);

<<<<<<< HEAD
            abortCallbackSetter(function() {
=======
            abortCallbackSetter(function () {
>>>>>>> upstream/main
              abortedFiles.push(file.name);
              clearTimeout(timeout);
              reject({
                type: 'abort',
              });
            });
          });
<<<<<<< HEAD
        }
      }
    };

    Harness.testCreate(FileComponent, cmp, options).then((component) => {
      component.root = { everyComponent: () => {}, options: options, form: { submissionRevisions: false, components: [cmp] } };
=======
        },
      },
    };

    Harness.testCreate(FileComponent, cmp, options).then((component) => {
      component.root = {
        everyComponent: () => {},
        options: options,
        form: {
          submissionRevisions: false,
          components: [
            cmp,
          ],
        },
      };
>>>>>>> upstream/main
      const parentNode = document.createElement('div');
      const element = document.createElement('div');
      parentNode.appendChild(element);
      component.build(element);

<<<<<<< HEAD
      const content = [1];
      const files = [new File(content, 'file.0'), new File([content], 'file.1'), new File([content], 'file.2')];

      component.handleFilesToUpload(files);

      setTimeout(function() {
=======
      const content = [
        1,
      ];
      const files = [
        new File(content, 'file.0'),
        new File(
          [
            content,
          ],
          'file.1',
        ),
        new File(
          [
            content,
          ],
          'file.2',
        ),
      ];

      component.handleFilesToUpload(files);

      setTimeout(function () {
>>>>>>> upstream/main
        // Table header and 3 rows for files
        Harness.testElements(component, '.list-group-item', 4);
        assert.equal(component.dataValue.length, 0);
        assert.equal(component.filesToSync.filesToUpload.length, 3);
        assert.equal(component.filesToSync.filesToUpload[1].status, 'progress');
        assert.equal(component.filesToSync.filesToDelete.length, 0);

<<<<<<< HEAD
        const abortIcon = component.element.querySelectorAll(`#abort-${component.filesToSync.filesToUpload[1].id}`)[0];
=======
        const abortIcon = component.element.querySelectorAll(
          `#abort-${component.filesToSync.filesToUpload[1].id}`,
        )[0];
>>>>>>> upstream/main
        assert.notEqual(abortIcon, null);
        abortIcon.click();

        setTimeout(() => {
          assert.notEqual(component !== null);
          assert(abortedFiles[0] === 'file.1' && abortedFiles.length === 1);
          assert.equal(component.filesToSync.filesToUpload[1].status, 'error');
          assert.equal(component.filesToSync.filesToUpload[1].message, 'Request was aborted');

          Harness.testElements(component, '.list-group-item', 4);
          component.root = null;
          done();
        }, 20);
      }, 100);
    });
  });
<<<<<<< HEAD
  it('should not error on upload when noDefaults is set to true', () => {
    return Formio.createForm(document.createElement('div'), comp2,{ noDefaults: true }).then((form)=>{
      const file = form.getComponent('file');
      return file.handleFilesToUpload([{ name: 'mypdf.pdf', size: 123123, type: 'application/pdf' }]);
    });
  });

  it('Should emit fileUploadError event on file upload failure', (done) => {
=======

  it('should not error on upload when noDefaults is set to true', function () {
    return Formio.createForm(document.createElement('div'), comp2, { noDefaults: true }).then(
      (form) => {
        const file = form.getComponent('file');
        return file.handleFilesToUpload([
          { name: 'mypdf.pdf', size: 123123, type: 'application/pdf' },
        ]);
      },
    );
  });

  it('Should emit fileUploadError event on file upload failure', function (done) {
>>>>>>> upstream/main
    const cmp = _.cloneDeep(comp1);
    const fileServiceError = new Error('Upload failed');

    const options = {
      fileService: {
<<<<<<< HEAD
        uploadFile: function(storage, file, fileName, dir, progressCallback, url, options, fileKey, groupPermissions, groupId, uploadStartCallback, abortCallbackSetter) {
=======
        uploadFile: function (
          storage,
          file,
          fileName,
          dir,
          progressCallback,
          url,
          options,
          fileKey,
          groupPermissions,
          groupId,
          uploadStartCallback,
          abortCallbackSetter,
        ) {
>>>>>>> upstream/main
          return new Promise((resolve, reject) => {
            // Simulate upload failure
            setTimeout(() => {
              const response = {
                status: 500,
                message: 'Internal Server Error',
                data: fileServiceError,
              };
              reject(response);
            }, 10);

            abortCallbackSetter(() => {});
          });
<<<<<<< HEAD
        }
      }
    };

    Harness.testCreate(FileComponent, cmp, options).then((component) => {
      component.root = { everyComponent: () => {}, options: options, form: { submissionRevisions: false, components: [cmp] } };
=======
        },
      },
    };

    Harness.testCreate(FileComponent, cmp, options).then((component) => {
      component.root = {
        everyComponent: () => {},
        options: options,
        form: {
          submissionRevisions: false,
          components: [
            cmp,
          ],
        },
      };
>>>>>>> upstream/main
      const parentNode = document.createElement('div');
      const element = document.createElement('div');
      parentNode.appendChild(element);
      component.build(element);

      // Attach an event listener to catch the fileUploadError event
      component.on('fileUploadError', (data) => {
        try {
          assert.equal(data.fileToSync.status, 'error');
          assert.equal(data.response.status, 500);
          assert.equal(data.response.message, 'Internal Server Error');
          assert.equal(data.response.data, fileServiceError);
          done();
        } catch (err) {
          done(err);
        }
      });

      // Trigger file upload
<<<<<<< HEAD
      const content = [1];
      const file = new File(content, 'file.0');
      component.handleFilesToUpload([file]);
=======
      const content = [
        1,
      ];
      const file = new File(content, 'file.0');
      component.handleFilesToUpload([
        file,
      ]);
    });
  });

  it('Should emit fileUploadingStart and fileUploadingEnd events', function (done) {
    Formio.createForm(document.createElement('div'), testFileUpload.form).then((form) => {
      const controlParameters = {
        uploadStart: 0,
        uploadEnd: 0,
      };

      form.on('fileUploadingStart', () => {
        ++controlParameters.uploadStart;
        console.log('start');
      });
      form.on('fileUploadingEnd', () => {
        ++controlParameters.uploadEnd;
        console.log('end');
      });

      const fileComponent = form.getComponent('file');
      fileComponent.handleFilesToUpload(testFileUpload.files);

      setTimeout(() => {
        _.each(controlParameters, (value, param) => {
          assert.equal(value, 1, `The ${param} should be equal to 1`);
        });
        done();
      }, 300);
    });
  });

  it('Should set pristine flag to false after file upload', function (done) {
    Formio.createForm(document.createElement('div'), testFileUpload.form).then((form) => {
      assert.equal(form.pristine, true);
      const fileComponent = form.getComponent('file');
      fileComponent.handleFilesToUpload(testFileUpload.files);

      setTimeout(() => {
        assert.equal(form.pristine, false);
        done();
      }, 300);
>>>>>>> upstream/main
    });
  });
});
