/**
 * CF7 Styler for Divi - Divi 5 definition.
 *
 * @since 3.0.0
 */

import metadata from './module.json';
import { CF7StylerEdit } from './edit';
import { ModuleStyles } from './styles';
import { placeholderContent } from './placeholder-content';
import { conversionOutline } from './conversion-outline';
import { SettingsContent } from './settings-content';
import { SettingsDesign } from './settings-design';

import './module.scss';

export const cf7StylerModuleMetadata = metadata;

export const cf7StylerModule = {
	metadata,
	placeholderContent,
	conversionOutline,
	renderers: {
		edit: CF7StylerEdit,
		styles: ModuleStyles,
	},
	settings: {
		content: SettingsContent,
		design: SettingsDesign,
	},
};
