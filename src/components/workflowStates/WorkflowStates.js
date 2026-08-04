import _ from 'lodash';
import Component from '../_classes/component/Component';
import {
  getStatusHistory,
  getWorkflowDefinition,
  getWorkflowId,
  extractErrorMessage,
} from '../workflow/utils/workflowClient';

/**
 * Status "breadcrumb" for the registration this form is embedded in.
 *
 * `entry.status` (from `registrations/{id}/status-history`) is a `WorkflowStatus` id, not a
 * name -- see WorkflowHistory.js for why. With `options.workflowId` available, this fetches the
 * workflow definition and renders its full, ordered status list (`sortOrder`), flagging which
 * ones the registration has already reached/is currently in -- so upcoming, not-yet-reached
 * statuses show up too. Without a `workflowId` (or if the definition fetch fails), it degrades to
 * only the statuses found in the history, in the order first reached -- no "upcoming" badges,
 * and the raw status id shown as the name.
 */
export default class WorkflowStatesComponent extends Component {
  static schema(...extend) {
    return Component.schema({
      type: 'workflowStates',
      label: 'Workflow States',
      key: 'workflowStates',
      input: false,
      persistent: false,
      tableView: false,
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Workflow States',
      group: 'basic',
      icon: 'road',
      weight: 1020,
      documentation: '/userguide/#workflowstates',
      schema: WorkflowStatesComponent.schema(),
    };
  }

  get defaultSchema() {
    return WorkflowStatesComponent.schema();
  }

  init() {
    super.init();
    this.states = [];
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
        this.states = this.deriveStates(history || [], workflow);
        this.redraw();
      })
      .catch((err) => {
        this.busy = false;
        this.errorMessage = extractErrorMessage(err);
        this.redraw();
      });
  }

  /**
   * With a workflow definition available: its full status list (`sortOrder`), each flagged
   * `reached` (appears in history) and `current` (the still-open entry, no completedAt).
   * Without one: falls back to only the distinct statuses reached, in the order first seen,
   * showing the raw status id as the name (see class doc).
   */
  deriveStates(history, workflow) {
    const currentEntry = _.find(history, (entry) => !entry.completedAt);
    if (workflow && (workflow.statuses || []).length) {
      const reachedIds = new Set(history.map((entry) => entry.status));
      return _.sortBy(workflow.statuses, 'sortOrder').map((status) => ({
        name: status.name,
        current: !!currentEntry && currentEntry.status === status.id,
        reached: reachedIds.has(status.id),
      }));
    }
    const seen = [];
    history.forEach((entry) => {
      if (!_.some(seen, { name: entry.status })) {
        seen.push({ name: entry.status, current: false, reached: true });
      }
    });
    if (currentEntry) {
      const currentState = _.find(seen, { name: currentEntry.status });
      if (currentState) {
        currentState.current = true;
      }
    }
    return seen;
  }

  render() {
    return super.render(this.renderTemplate('workflowStates', {
      component: this.component,
      states: this.states,
      busy: this.busy,
      errorMessage: this.errorMessage,
    }));
  }
}
