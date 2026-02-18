import metadata from './module.json';
import { CF7StylerEdit } from './edit';
import { ModuleStyles } from './styles';
import { placeholderContent } from './placeholder-content';
import { SettingsContent } from './settings-content';
import { SettingsDesign } from './settings-design';

import './module.scss';

export const cf7StylerModuleMetadata = metadata;

export const cf7StylerModule = {
	metadata,
	placeholderContent,
	renderers: {
		edit: CF7StylerEdit,
		styles: ModuleStyles,
	},
	settings: {
		content: SettingsContent,
		design: SettingsDesign,
	},
};
