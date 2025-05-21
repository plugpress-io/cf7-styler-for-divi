const {addAction} = window?.vendor?.wp?.hooks;

const {registerModule} = window?.divi?.moduleLibrary;

import {cf7StylerMetadata, cf7StylerModule} from './cf7-styler';

import './module-icons';

addAction('divi.moduleLibrary.registerModuleLibraryStore.after', 'divi-cf7-styler', () => {
    registerModule(cf7StylerMetadata, cf7StylerModule);
});
