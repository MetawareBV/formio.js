import Components from '../Components';
import WorkflowStatesEditDisplay from './editForm/WorkflowStates.edit.display';

export default function(...extend) {
  return Components.baseEditForm([
    {
      key: 'display',
      components: WorkflowStatesEditDisplay,
    },
    {
      key: 'data',
      ignore: true,
    },
    {
      key: 'validation',
      ignore: true,
    },
  ], ...extend);
}
