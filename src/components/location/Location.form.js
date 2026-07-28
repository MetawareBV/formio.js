import Components from '../Components';
import LocationEditDisplay from './editForm/Location.edit.display';

export default function(...extend) {
  return Components.baseEditForm([
    {
      key: 'display',
      components: LocationEditDisplay
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
