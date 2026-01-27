/**
 * CF7 Styler for Divi - Divi 5 Entry Point.
 *
 * @since 3.0.0
 */

import { omit } from 'lodash';
import { addAction } from '@wordpress/hooks';
import { registerModule } from '@divi/module-library';

// Module imports.
import { cf7StylerModule } from './modules/cf7-styler';

// Icon registration.
import './module-icons';

// Register modules once Divi's module library store is ready.
addAction(
  'divi.moduleLibrary.registerModuleLibraryStore.after',
  'cf7StylerForDivi',
  () => {
    registerModule(cf7StylerModule.metadata, omit(cf7StylerModule, 'metadata'));
  }
);
