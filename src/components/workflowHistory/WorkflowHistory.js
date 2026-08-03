import Component from '../_classes/component/Component';
import { getStatusHistory, extractErrorMessage } from '../workflow/utils/workflowClient';

/**
 * Read-only status-history table for the registration this form is embedded in. Fetches its
 * own data from `registrations/{id}/status-history` -- it no longer parses a JSON blob shared
 * by a sibling `workflow` component (that indirection existed only because the old Domino
 * component cached everything client-side; the new backend is the source of truth).
 */
export default class WorkflowHistoryComponent extends Component {
  static schema(...extend) {
    return Component.schema({
      type: 'workflowHistory',
      label: 'Workflow History',
      key: 'workflowHistory',
      input: false,
      persistent: false,
      tableView: false,
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Workflow History',
      group: 'basic',
      icon: 'history',
      weight: 1010,
      documentation: '/userguide/#workflowhistory',
      schema: WorkflowHistoryComponent.schema(),
    };
  }

  get defaultSchema() {
    return WorkflowHistoryComponent.schema();
  }

  init() {
    super.init();
    this.history = [];
    this.busy = false;
    this.errorMessage = null;
    if (!this.builderMode) {
      this.refresh();
    }
  }

  refresh() {
    this.busy = true;
    return getStatusHistory(this)
      .then((history) => {
        this.busy = false;
        this.history = history || [];
        this.redraw();
      })
      .catch((err) => {
        this.busy = false;
        this.errorMessage = extractErrorMessage(err);
        this.redraw();
      });
  }

  render() {
    return super.render(this.renderTemplate('workflowHistory', {
      component: this.component,
      history: this.history,
      busy: this.busy,
      errorMessage: this.errorMessage,
    }));
  }
}
