import _ from 'lodash';
import Component from '../_classes/component/Component';
import { getStatusHistory, extractErrorMessage } from '../workflow/utils/workflowClient';

/**
 * Status "breadcrumb" for the registration this form is embedded in.
 *
 * Note: without a `workflowId` link on the registration (see the plan's open items), this
 * component cannot resolve the full, ordered status list of the workflow definition -- so it
 * only knows about statuses the registration has actually been in, derived from
 * `registrations/{id}/status-history`. Statuses the workflow defines but this registration
 * hasn't reached yet simply won't show up as "upcoming" badges. This degrades gracefully
 * rather than failing; a small backend addition could remove this limitation later.
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
    return getStatusHistory(this)
      .then((history) => {
        this.busy = false;
        this.states = this.deriveStates(history || []);
        this.redraw();
      })
      .catch((err) => {
        this.busy = false;
        this.errorMessage = extractErrorMessage(err);
        this.redraw();
      });
  }

  /**
   * Reduces the raw history entries (oldest first, as returned by the endpoint) to the
   * distinct statuses reached, in order, with the still-open entry (no completedAt) flagged
   * as current.
   */
  deriveStates(history) {
    const seen = [];
    history.forEach((entry) => {
      if (!_.some(seen, { name: entry.status })) {
        seen.push({ name: entry.status, current: false });
      }
    });
    const currentEntry = _.find(history, (entry) => !entry.completedAt);
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
