import metadata from './module.json';

import {cf7StylerEdit} from './edit';
import {SettingsContent} from './settings-content';
import {SettingsDesign} from './settings-design';
import {SettingsAdvanced} from './settings-advanced';


/**
 * CF7 Styler module definition.
 */
export const cf7StylerMetadata = metadata;

export const cf7StylerModule = {
    metadata,
    
    settings: {
        content: SettingsContent,
        design: SettingsDesign,
        advanced: SettingsAdvanced,
    },

    renderers: {
        edit: cf7StylerEdit,
    },

    placeholderContent: {
        content: 'Select a Contact Form 7 form to display',
    },
};
