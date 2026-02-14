/**
 * CF7 Styler for Divi - Design Settings.
 *
 * Renders design groups (Common, Form Header, Form Text, Fields,
 * Radio & Checkbox, Button, Message) and attaches visibility
 * callbacks so conditional fields match Divi 4 behavior.
 *
 * @since 3.0.0
 */

import React from 'react';
import { set } from 'lodash';

import { isVisibleFields } from './callbacks';

const { ModuleGroups } = window?.divi?.module ?? {};

const DESIGN_GROUPS = [
	'common',
	'form_header',
	'form_text',
	'form_field',
	'radio_checkbox',
	'submit_button',
	'suc_err_msg',
];

export const SettingsDesign = (props) => {
	const groupConfiguration = props?.groupConfiguration ?? props?.groups ?? {};

	if (!ModuleGroups) {
		return null;
	}

	try {
		DESIGN_GROUPS.forEach((groupSlug) => {
			const fields =
				groupConfiguration?.[groupSlug]?.component?.props?.fields;
			if (fields && typeof fields === 'object') {
				Object.keys(fields).forEach((fieldName) => {
					set(fields, [fieldName, 'visible'], isVisibleFields);
				});
			}
		});
	} catch (err) {
		if (typeof console !== 'undefined' && console.error) {
			console.error('CF7 Styler SettingsDesign error:', err);
		}
	}

	return <ModuleGroups groups={groupConfiguration} />;
};
