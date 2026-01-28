/**
 * CF7 Styler Module - Edit Component.
 *
 * Renders the Visual Builder preview with proper class names
 * for CSS targeting to match frontend rendering.
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

  // Get CF7 settings from advanced attributes
  const formId = attrs?.cf7?.advanced?.formId?.desktop?.value || '0';
  const useFormHeader = attrs?.cf7?.advanced?.useFormHeader?.desktop?.value === 'on';
  const formHeaderTitle = attrs?.cf7?.advanced?.formHeaderTitle?.desktop?.value || '';
  const formHeaderText = attrs?.cf7?.advanced?.formHeaderText?.desktop?.value || '';
  const useIcon = attrs?.cf7?.advanced?.useIcon?.desktop?.value === 'on';
  const headerIcon = attrs?.cf7?.advanced?.headerIcon?.desktop?.value || '';
  const headerImage = attrs?.cf7?.advanced?.headerImage?.desktop?.value || '';
  
  // Button settings
  const buttonFullwidth = attrs?.cf7?.advanced?.useFormButtonFullwidth?.desktop?.value === 'on';
  const buttonAlignment = attrs?.cf7?.advanced?.buttonAlignment?.desktop?.value || 'left';
  
  // Radio/checkbox custom styles
  const crCustomStyles = attrs?.cf7?.advanced?.crCustomStyles?.desktop?.value === 'on';

  if (!ModuleContainer) {
    return null;
  }

  // Build container classes to match PHP output
  const buttonClass = buttonFullwidth ? 'fullwidth' : buttonAlignment;
  const containerClasses = `dipe-cf7-container dipe-cf7-button-${buttonClass} dcs-cf7-container dcs-cf7-button-${buttonClass}`;
  const wrapperClasses = `dipe-cf7 dipe-cf7-styler dcs-cf7 dcs-cf7-styler${crCustomStyles ? ' dipe-cf7-cr dcs-cf7-cr' : ''}`;

  return (
    <ModuleContainer
      attrs={attrs}
      id={id}
      name={name}
      elements={elements}
      stylesComponent={ModuleStyles}
      classnamesFunction={moduleClassnames}
    >
      <div className={containerClasses}>
        {/* Form Header */}
        {useFormHeader && (formHeaderTitle || formHeaderText || headerIcon || headerImage) && (
          <div className="dipe-form-header-container dcs-form-header-container dcs-cf7-header">
            <div className="dipe-form-header dcs-form-header">
              {/* Icon or Image */}
              {useIcon && headerIcon && (
                <div className="dipe-form-header-icon dcs-form-header-icon">
                  <span className="et-pb-icon">{headerIcon}</span>
                </div>
              )}
              {!useIcon && headerImage && (
                <div className="dipe-form-header-image dcs-form-header-image">
                  <img src={headerImage} alt="" />
                </div>
              )}
              {/* Title and Text */}
              {(formHeaderTitle || formHeaderText) && (
                <div className="dipe-form-header-info dcs-form-header-info">
                  {formHeaderTitle && (
                    <h2 className="dipe-form-header-title dcs-form-header-title dcs-cf7-header__title">
                      {formHeaderTitle}
                    </h2>
                  )}
                  {formHeaderText && (
                    <div className="dipe-form-header-text dcs-form-header-text dcs-cf7-header__text">
                      {formHeaderText}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className={wrapperClasses}>
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
            <div className="dcs-cf7-form-preview wpcf7">
              <div className="dcs-cf7-form-preview__fields wpcf7-form">
                <div className="dcs-cf7-form-preview__field">
                  <label>{__('Your Name', 'cf7-styler-for-divi')}</label>
                  <span className="wpcf7-form-control-wrap">
                    <input 
                      type="text" 
                      className="wpcf7-form-control wpcf7-text" 
                      placeholder={__('Enter your name', 'cf7-styler-for-divi')} 
                      readOnly 
                    />
                  </span>
                </div>
                <div className="dcs-cf7-form-preview__field">
                  <label>{__('Your Email', 'cf7-styler-for-divi')}</label>
                  <span className="wpcf7-form-control-wrap">
                    <input 
                      type="email" 
                      className="wpcf7-form-control wpcf7-email" 
                      placeholder={__('Enter your email', 'cf7-styler-for-divi')} 
                      readOnly 
                    />
                  </span>
                </div>
                <div className="dcs-cf7-form-preview__field">
                  <label>{__('Your Message', 'cf7-styler-for-divi')}</label>
                  <span className="wpcf7-form-control-wrap">
                    <textarea 
                      className="wpcf7-form-control wpcf7-textarea" 
                      placeholder={__('Enter your message', 'cf7-styler-for-divi')} 
                      readOnly 
                      rows="4" 
                    />
                  </span>
                </div>
                <p className="dcs-cf7-form-preview__submit-wrap">
                  <input 
                    type="submit" 
                    value={__('Submit', 'cf7-styler-for-divi')} 
                    className="wpcf7-form-control wpcf7-submit dcs-cf7-form-preview__submit"
                  />
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModuleContainer>
  );
};

export { CF7StylerEdit };
