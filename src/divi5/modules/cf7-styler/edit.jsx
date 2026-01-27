/**
 * CF7 Styler Module - Edit Component.
 *
 * @since 3.0.0
 */

import React from 'react';
import { __ } from '@wordpress/i18n';

import { ModuleStyles } from './styles';
import { moduleClassnames } from './module-classnames';

const { ModuleContainer } = window?.divi?.module ?? {};

/**
 * CF7 Styler Edit Component
 */
const CF7StylerEdit = (props) => {
  const {
    attrs,
    id,
    name,
    elements,
  } = props;

  // Get CF7 settings from advanced attributes (matching new module.json structure)
  const formId = attrs?.cf7?.advanced?.formId?.desktop?.value || '0';
  const useFormHeader = attrs?.cf7?.advanced?.useFormHeader?.desktop?.value === 'on';
  const formHeaderTitle = attrs?.cf7?.advanced?.formHeaderTitle?.desktop?.value || '';
  const formHeaderText = attrs?.cf7?.advanced?.formHeaderText?.desktop?.value || '';

  if (!ModuleContainer) {
    return null;
  }

  return (
    <ModuleContainer
      attrs={attrs}
      id={id}
      name={name}
      elements={elements}
      stylesComponent={ModuleStyles}
      classnamesFunction={moduleClassnames}
    >
      <div className="dcs-cf7-styler">
        {useFormHeader && (formHeaderTitle || formHeaderText) && (
          <div className="dcs-cf7-header">
            {formHeaderTitle && (
              <h3 className="dcs-cf7-header__title">{formHeaderTitle}</h3>
            )}
            {formHeaderText && (
              <p className="dcs-cf7-header__text">{formHeaderText}</p>
            )}
          </div>
        )}
        {formId === '0' || !formId ? (
          <div className="dcs-cf7-placeholder">
            <div className="dcs-cf7-placeholder__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="2"/>
                <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="7" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="dcs-cf7-placeholder__title">
              {__('CF7 Styler', 'cf7-styler-for-divi')}
            </h3>
            <p className="dcs-cf7-placeholder__text">
              {__('Select a Contact Form 7 form to display.', 'cf7-styler-for-divi')}
            </p>
          </div>
        ) : (
          <div className="dcs-cf7-form-preview">
            <div className="dcs-cf7-form-preview__fields">
              <div className="dcs-cf7-form-preview__field">
                <label>{__('Your Name', 'cf7-styler-for-divi')}</label>
                <input type="text" placeholder={__('Enter your name', 'cf7-styler-for-divi')} readOnly />
              </div>
              <div className="dcs-cf7-form-preview__field">
                <label>{__('Your Email', 'cf7-styler-for-divi')}</label>
                <input type="email" placeholder={__('Enter your email', 'cf7-styler-for-divi')} readOnly />
              </div>
              <div className="dcs-cf7-form-preview__field">
                <label>{__('Your Message', 'cf7-styler-for-divi')}</label>
                <textarea placeholder={__('Enter your message', 'cf7-styler-for-divi')} readOnly rows="4" />
              </div>
              <button type="button" className="dcs-cf7-form-preview__submit">
                {__('Submit', 'cf7-styler-for-divi')}
              </button>
            </div>
          </div>
        )}
      </div>
    </ModuleContainer>
  );
};

export { CF7StylerEdit };
