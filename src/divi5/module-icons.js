/**
 * Module icon registration for Divi 5.
 *
 * @since 3.0.0
 */

import { addFilter } from '@wordpress/hooks';
import { cf7StylerIcon } from './icons';

// Add module icons to the icon library.
addFilter('divi.iconLibrary.icon.map', 'cf7StylerForDivi', (icons) => {
  return {
    ...icons,
    [cf7StylerIcon.name]: cf7StylerIcon,
  };
});
