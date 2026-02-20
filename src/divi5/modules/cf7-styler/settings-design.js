/**
 * CF7 Styler for Divi - Design Settings.
 *
 * Renders design groups (Common, Form Header, Form Text, Fields,
 * Radio & Checkbox, Button, Message) and attaches visibility
 * callbacks so conditional fields match Divi 4 behavior.
 *
 * NOTE: Do NOT mutate groupConfiguration directly (e.g. via lodash set) –
 * it is a shared reference from Divi's internal state and mutating it
 * corrupts Immutable.js structures, causing "d.setIn is not a function".
 *
 * @since 3.0.0
 */

import React, { useMemo } from 'react';

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

	const groups = useMemo(() => {
		try {
			const result = { ...groupConfiguration };

			DESIGN_GROUPS.forEach((groupSlug) => {
				const group = result[groupSlug];
				const fields = group?.component?.props?.fields;
				if (!fields || typeof fields !== 'object') {
					return;
				}

				const newFields = {};
				for (const [fieldName, field] of Object.entries(fields)) {
					newFields[fieldName] = { ...field, visible: isVisibleFields };
				}

				result[groupSlug] = {
					...group,
					component: {
						...group?.component,
						props: {
							...group?.component?.props,
							fields: newFields,
						},
					},
				};
			});

			return result;
		} catch (err) {
			if (typeof console !== 'undefined' && console.error) {
				console.error('CF7 Styler SettingsDesign error:', err);
			}
			return groupConfiguration;
		}
	}, [groupConfiguration]);

	if (!ModuleGroups) {
		return null;
	}

	return <ModuleGroups groups={groups} />;
};
