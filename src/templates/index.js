import bootstrap from '@formio/bootstrap/bootstrap5';
import title from './bootstrap5/title';
import image from './bootstrap5/image';
import location from './bootstrap5/location';

export default {
  bootstrap: {
    ...bootstrap.templates.bootstrap5,
    title,
    image,
    location,
  }
};
