import Components from '../Components';
import WorkflowHistoryEditDisplay from './editForm/WorkflowHistory.edit.display';

export default function(...extend) {
  return Components.baseEditForm([
    {
      key: 'display',
      components: WorkflowHistoryEditDisplay,
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
