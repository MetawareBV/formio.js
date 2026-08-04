import Component from '../_classes/component/Component';
import {
  getStatusHistory,
  getWorkflowDefinition,
  getWorkflowId,
  extractErrorMessage,
} from '../workflow/utils/workflowClient';

/**
 * Read-only status-history table for the registration this form is embedded in. Fetches its
 * own data from `registrations/{id}/status-history` -- it no longer parses a JSON blob shared
 * by a sibling `workflow` component (that indirection existed only because the old Domino
 * component cached everything client-side; the new backend is the source of truth).
 *
 * `entry.status` is a `WorkflowStatus` id (a UUID), not a display name -- the backend keeps a
 * registration's status history deliberately decoupled from the workflow's own status vocabulary
 * (see `WorkflowEngineService`). So when `options.workflowId` is available, this also fetches the
 * workflow definition to resolve ids to names; without it (or for a status id no longer defined
 * on the workflow) it falls back to showing the raw id.
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
    this.statusNames = {};
    this.busy = false;
    this.errorMessage = null;
    if (!this.builderMode) {
      this.refresh();
    }
  }

  refresh() {
    this.busy = true;
    const workflowId = getWorkflowId(this);
    const definition = workflowId ? getWorkflowDefinition(this, workflowId) : Promise.resolve(null);
    return Promise.all([getStatusHistory(this), definition])
      .then(([history, workflow]) => {
        this.busy = false;
        this.history = history || [];
        this.statusNames = {};
        (workflow?.statuses || []).forEach((status) => {
          this.statusNames[status.id] = status.name;
        });
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
      statusNames: this.statusNames,
      busy: this.busy,
      errorMessage: this.errorMessage,
    }));
  }
}
