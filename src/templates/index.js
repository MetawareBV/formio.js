import bootstrap from '@formio/bootstrap/bootstrap5';
import title from './bootstrap5/title';
import image from './bootstrap5/image';
import location from './bootstrap5/location';
import workflow from './bootstrap5/workflow';
import workflowHistory from './bootstrap5/workflowHistory';
import workflowStates from './bootstrap5/workflowStates';

export default {
  bootstrap: {
    ...bootstrap.templates.bootstrap5,
    title,
    image,
    location,
    workflow,
    workflowHistory,
    workflowStates,
  }
};
