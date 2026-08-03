import Components from '../Components';
import WorkflowEditDisplay from './editForm/Workflow.edit.display';

export default function(...extend) {
  return Components.baseEditForm([
    {
      key: 'display',
      components: WorkflowEditDisplay,
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
