import Component from '../_classes/component/Component';
import _ from 'lodash';

export default class TitleComponent extends Component {
  static schema(...extend) {
    return Component.schema({
      label: 'Title',
      type: 'title',
      tag: 'H1',
      alignment: 'center',
      color: '#000',
      backgroundcolor: '#fff',
      attrs: [],
      content: 'Title',
      input: false,
      persistent: false
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Title',
      group: 'layout',
      icon: 'comment',
      weight: -10,
      documentation: '/userguide/#title-component',
      schema: TitleComponent.schema()
    };
  }

  get defaultSchema() {
    return TitleComponent.schema();
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
    return this.renderTemplate('title', {
      component: this.component,
      tag: this.component.tag,
      alignment: this.component.alignment,
      color: this.component.color,
      backgroundcolor: this.component.backgroundcolor,
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
