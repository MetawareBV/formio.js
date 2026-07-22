import Components from '../Components';
import TitleEditDisplay from './editForm/Image.edit.display';
import TitleEditLogic from './editForm/Image.edit.logic';

export default function(...extend) {
  return Components.baseEditForm([
    {
      key: 'display',
      components: TitleEditDisplay,
    },
    {
      key: 'data',
      ignore: true,
    },
    {
      key: 'validation',
      ignore: true,
    },
    {
      key: 'logic',
      components: TitleEditLogic,
    },
  ], ...extend);
}
