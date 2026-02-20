import React, { useEffect, useState, useMemo } from 'react';
import { isVisibleFields } from './callbacks';
const apiFetch = window?.wp?.apiFetch;
const FORM_ID_ATTR = 'module.advanced.formId';

const buildFormOptions = (forms) => {
	if (forms && !Array.isArray(forms) && typeof forms === 'object') {
		return forms;
	}
	if (!Array.isArray(forms) || !forms.length) {
		return { 0: { label: 'Select a form...' } };
	}
	const options = {};
	forms.forEach((item) => {
		const value = String(item?.value ?? '');
		const label = item?.label ?? '';
		if (value !== '') {
			options[value] = { label: label || `Form ${value}` };
		}
	});
	if (!options['0']) {
		options['0'] = { label: 'Select a form...' };
	}
	return options;
};

const findFormIdField = (fields) => {
	if (!fields || typeof fields !== 'object') return null;
	for (const [key, field] of Object.entries(fields)) {
		const attr = field?.attrName ?? field?.item?.attrName;
		if (
			attr === FORM_ID_ATTR ||
			(typeof key === 'string' && /formid|formId/i.test(key))
		) {
			return key;
		}
	}
	return null;
};

export const SettingsContent = (props) => {
	const groupConfiguration = props?.groupConfiguration ?? props?.groups ?? {};
	const [formOptions, setFormOptions] = useState({
		0: { label: 'Loading forms…' },
	});

	const moduleApi = window?.divi?.module;
	const ModuleGroups = moduleApi?.ModuleGroups;

	useEffect(() => {
		const fetchForms = async () => {
			try {
				const endpoint = 'cf7-styler/v1/forms';
				if (apiFetch) {
					const response = await apiFetch({ path: endpoint });
					if (Array.isArray(response)) {
						setFormOptions(buildFormOptions(response));
						return;
					}
				}
				const baseUrl = (
					window.wpApiSettings?.root || '/wp-json/'
				).replace(/\/$/, '');
				const res = await fetch(`${baseUrl}/${endpoint}`, {
					credentials: 'same-origin',
					headers: {
						'X-WP-Nonce': window.wpApiSettings?.nonce || '',
					},
				});
				const data = await res.json();
				setFormOptions(
					Array.isArray(data)
						? buildFormOptions(data)
						: { 0: { label: 'No forms found' } },
				);
			} catch (err) {
				if (typeof console !== 'undefined' && console.error) {
					console.error('CF7 Styler: Error fetching forms', err);
				}
				setFormOptions({ 0: { label: 'Error loading forms' } });
			}
		};
		fetchForms();
	}, []);

	const groups = useMemo(() => {
		try {
			const generalGroup = groupConfiguration?.general;
			const generalProps = generalGroup?.component?.props;
			const fields = generalProps?.fields;

			if (!fields || typeof fields !== 'object') {
				return groupConfiguration;
			}

			const formIdKey =
				findFormIdField(fields) || (fields.formId && 'formId');

			const newFields = {};
			for (const [key, field] of Object.entries(fields)) {
				if (key === formIdKey && field) {
					newFields[key] = {
						...field,
						visible: isVisibleFields,
						component: {
							...field?.component,
							props: {
								...field?.component?.props,
								options: formOptions,
							},
						},
					};
				} else {
					newFields[key] = { ...field, visible: isVisibleFields };
				}
			}

			return {
				...groupConfiguration,
				general: {
					...generalGroup,
					component: {
						...generalGroup?.component,
						props: {
							...generalProps,
							fields: newFields,
						},
					},
				},
			};
		} catch (err) {
			if (typeof console !== 'undefined' && console.error) {
				console.error('CF7 Styler SettingsContent error:', err);
			}
			return groupConfiguration;
		}
	}, [groupConfiguration, formOptions]);

	if (!ModuleGroups) {
		return null;
	}
	return <ModuleGroups groups={groups} />;
};
