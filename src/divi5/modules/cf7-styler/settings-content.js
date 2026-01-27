/**
 * CF7 Styler Module - Content Settings.
 *
 * Loads Contact Form 7 forms via REST/apiFetch and wires up
 * conditional field visibility (show/hide) similar to
 * the Google Reviews Divi 5 module.
 *
 * @since 3.0.0
 */

import React, { useEffect, useState } from 'react';
import { set } from 'lodash';

import { isVisibleFields } from './callbacks';

const apiFetch = window?.wp?.apiFetch;

const FORM_ID_ATTR = 'cf7.advanced.formId';

/**
 * Normalize REST response (array of { value, label }) into
 * the options object shape expected by divi/select:
 * {
 *   [value]: { label }
 * }
 */
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

/**
 * Find the formId field in a fields object by attrName or key.
 * Divi may key fields as "formId", "cf7AdvancedFormid", etc.
 */
const findFormIdField = (fields) => {
  if (!fields || typeof fields !== 'object') return null;
  for (const [key, field] of Object.entries(fields)) {
    const attr = field?.attrName ?? field?.item?.attrName;
    if (attr === FORM_ID_ATTR || (typeof key === 'string' && /formid|formId/i.test(key))) {
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
        const baseUrl = (window.wpApiSettings?.root || '/wp-json/').replace(/\/$/, '');
        const res = await fetch(`${baseUrl}/${endpoint}`, {
          credentials: 'same-origin',
          headers: { 'X-WP-Nonce': window.wpApiSettings?.nonce || '' },
        });
        const data = await res.json();
        setFormOptions(Array.isArray(data) ? buildFormOptions(data) : { 0: { label: 'No forms found' } });
      } catch (err) {
        if (typeof console !== 'undefined' && console.error) {
          console.error('CF7 Styler: Error fetching forms', err);
        }
        setFormOptions({ 0: { label: 'Error loading forms' } });
      }
    };
    fetchForms();
  }, []);

  try {
    const fields = groupConfiguration?.general?.component?.props?.fields;
    if (fields && typeof fields === 'object') {
      const formIdKey =
        findFormIdField(fields) ||
        (fields.formId && 'formId') ||
        (fields.cf7AdvancedFormId && 'cf7AdvancedFormId') ||
        (fields.cf7AdvancedFormid && 'cf7AdvancedFormid');
      if (formIdKey && fields[formIdKey]) {
        set(fields, [formIdKey, 'component', 'props', 'options'], formOptions);
      }
      Object.keys(fields).forEach((fieldName) => {
        set(fields, [fieldName, 'visible'], isVisibleFields);
      });
    }
  } catch (err) {
    if (typeof console !== 'undefined' && console.error) {
      console.error('CF7 Styler SettingsContent error:', err);
    }
  }

  if (!ModuleGroups) {
    return null;
  }
  return <ModuleGroups groups={groupConfiguration} />;
};

