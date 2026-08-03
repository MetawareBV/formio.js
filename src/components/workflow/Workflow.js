import _ from 'lodash';
import Component from '../_classes/component/Component';
import {
  getAvailableActions,
  executeAction,
  getParties,
  getRegistrationId,
  extractErrorMessage,
} from './utils/workflowClient';

/**
 * Renders the workflow action buttons for the registration this form is embedded in, and
 * executes the chosen transition against the Spring Boot workflow engine (via the
 * `registrations/{id}/actions` endpoints -- see utils/workflowClient.js). Has no submission
 * value of its own: the registration's status is the server's, not this component's, so it
 * never participates in form data (input: false), unlike the old Domino-era version which
 * stored the whole workflow state as a JSON blob in its own field.
 *
 * `component.workflowId` (set via the builder property, see Workflow.edit.display.js) is
 * design-time only -- this class never reads it. The backend resolves which workflow a
 * registration runs against from `Form.workflowId`, not from anything sent by the browser, so
 * the host app syncs the two by calling `PUT .../forms/{formId}/workflow/{workflowId}` whenever
 * a design containing this component is published.
 */
export default class WorkflowComponent extends Component {
  static schema(...extend) {
    return Component.schema({
      type: 'workflow',
      label: 'Workflow',
      key: 'workflow',
      input: false,
      persistent: false,
      tableView: false,
      workflowId: '',
      alignment: 'right',
      showSaveButton: false,
      showValidations: false,
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Workflow',
      group: 'basic',
      icon: 'random',
      weight: 1000,
      documentation: '/userguide/#workflow',
      schema: WorkflowComponent.schema(),
    };
  }

  get defaultSchema() {
    return WorkflowComponent.schema();
  }

  init() {
    super.init();
    this.actions = [];
    this.parties = [];
    this.pendingAction = null;
    this.selectedActorId = '';
    this.comment = '';
    this.busy = false;
    this.errorMessage = null;
    if (!this.builderMode) {
      this.loadActions();
    }
  }

  loadActions() {
    if (!getRegistrationId(this)) {
      return Promise.resolve();
    }
    this.busy = true;
    return getAvailableActions(this)
      .then((actions) => {
        this.busy = false;
        this.actions = actions || [];
        this.redraw();
      })
      .catch((err) => {
        this.busy = false;
        this.errorMessage = extractErrorMessage(err);
        this.redraw();
      });
  }

  selectAction(actionId) {
    const action = _.find(this.actions, (candidate) => String(candidate.id) === String(actionId));
    if (!action) {
      return;
    }
    this.errorMessage = null;
    if (action.requireComment || action.eligibleParty) {
      this.pendingAction = action;
      this.selectedActorId = '';
      this.comment = '';
      if (action.eligibleParty && !this.parties.length) {
        getParties(this)
          .then((parties) => {
            this.parties = parties || [];
            this.redraw();
          })
          .catch((err) => {
            this.errorMessage = extractErrorMessage(err);
            this.redraw();
          });
      }
      this.redraw();
    }
    else {
      this.runAction(action, {});
    }
  }

  confirmPendingAction() {
    if (!this.pendingAction) {
      return;
    }
    if (this.pendingAction.requireComment && !this.comment) {
      this.errorMessage = 'A comment is required for this action.';
      this.redraw();
      return;
    }
    this.runAction(this.pendingAction, {
      actorPartyId: this.selectedActorId || undefined,
      comment: this.comment || undefined,
    });
  }

  cancelPendingAction() {
    this.pendingAction = null;
    this.selectedActorId = '';
    this.comment = '';
    this.errorMessage = null;
    this.redraw();
  }

  runAction(action, payload) {
    if (this.component.showValidations && this.root && !this.rootIsValid()) {
      this.errorMessage = 'Please resolve the validation errors on this form before continuing.';
      this.redraw();
      return;
    }
    this.busy = true;
    this.redraw();
    executeAction(this, action.id, payload)
      .then(() => {
        this.busy = false;
        this.pendingAction = null;
        this.selectedActorId = '';
        this.comment = '';
        this.errorMessage = null;
        this.loadActions();
        this.refreshSiblings();
        if (this.component.showSaveButton && this.root && typeof this.root.submit === 'function') {
          this.root.submit();
        }
      })
      .catch((err) => {
        this.busy = false;
        this.errorMessage = extractErrorMessage(err);
        this.redraw();
      });
  }

  rootIsValid() {
    try {
      return this.root.validate(this.root.data, { dirty: false, silentCheck: true }).length === 0;
    }
    catch (e) {
      return true;
    }
  }

  refreshSiblings() {
    ['workflowHistory', 'workflowStates'].forEach((key) => {
      const sibling = this.root && typeof this.root.getComponent === 'function' ? this.root.getComponent(key) : null;
      if (sibling && typeof sibling.refresh === 'function') {
        sibling.refresh();
      }
      else if (sibling && typeof sibling.redraw === 'function') {
        sibling.redraw();
      }
    });
  }

  render() {
    return super.render(this.renderTemplate('workflow', {
      component: this.component,
      actions: this.actions,
      pendingAction: this.pendingAction,
      parties: this.parties,
      busy: this.busy,
      errorMessage: this.errorMessage,
      selectedActorId: this.selectedActorId,
      comment: this.comment,
    }));
  }

  attach(element) {
    this.loadRefs(element, {
      actionButton: 'multiple',
      confirmAction: 'single',
      cancelAction: 'single',
      actorSelect: 'single',
      commentInput: 'single',
    });
    const superAttach = super.attach(element);
    this.addEventListener(this.refs.actionButton, 'click', (event) => {
      this.selectAction(event.currentTarget.getAttribute('data-action-id'));
    });
    if (this.refs.confirmAction) {
      this.addEventListener(this.refs.confirmAction, 'click', () => this.confirmPendingAction());
    }
    if (this.refs.cancelAction) {
      this.addEventListener(this.refs.cancelAction, 'click', () => this.cancelPendingAction());
    }
    if (this.refs.actorSelect) {
      this.addEventListener(this.refs.actorSelect, 'change', (event) => {
        this.selectedActorId = event.target.value;
      });
    }
    if (this.refs.commentInput) {
      this.addEventListener(this.refs.commentInput, 'input', (event) => {
        this.comment = event.target.value;
      });
    }
    return superAttach;
  }
}
