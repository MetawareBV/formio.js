import Component from '../_classes/component/Component';
import _ from 'lodash';
import Formio from '../../Formio';

export default class ImageComponent extends Component {
  static schema(...extend) {
    return Component.schema({
      label: 'Image',
      type: 'image',
      imageSource: '',
      imageTitle: '',
      imageClass: '',
      figureClass: 'float-left',  
      width: '',    
      attrs: [],
      content: 'Title',
      showImageTitle: false,
      input: false,
      persistent: false
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Image',
      group: 'layout',
      icon: 'image',
      weight: -10,
      documentation: '/userguide/#image-component',
      schema: ImageComponent.schema()
    };
  }

  get defaultSchema() {
    return ImageComponent.schema();
  }

  get content() {
    if (this.builderMode) {
      return this.component.content;
    }
    const submission = _.get(this.root, 'submission', {});
    return this.component.content ? this.interpolate(this.component.content, {
      metadata: submission.metadata || {},
      submission: submission,
      data: this.rootValue,
      row: this.data
    }) : '';
  }

  get singleTags() {
    return ['br', 'img', 'hr'];
  }

  checkRefreshOn(changed) {
    super.checkRefreshOn(changed);
    if (!this.builderMode && this.component.refreshOnChange && this.element &&
      this.conditionallyVisible(this.data, this.row)) {
      this.setContent(this.element, this.renderContent());
    }
  }

  renderContent() {
    const submission = _.get(this.root, 'submission', {});
    return this.renderTemplate('image', {
      component: this.component,
      imageSource: this.component.imageSource,
      imageTitle: this.component.imageTitle,
      alignment: this.component.alignment,  
      showImageTitle: this.component.showImageTitle,   
      attrs: (this.component.attrs || []).map((attr) => {
        return {
          attr: attr.attr,
          value: this.interpolate(attr.value, {
            metadata: submission.metadata || {},
            submission: submission,
            data: this.rootValue,
            row: this.data
          })
        };
      }),
      content: this.content,
      singleTags: this.singleTags,
    });
  }

  render() {
    return super.render(this.renderContent());
  }

  attach(element) {
    this.loadRefs(element, { html: 'single' });
    return super.attach(element);
  }
}
