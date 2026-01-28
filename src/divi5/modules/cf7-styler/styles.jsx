/**
 * CF7 Styler Module - Style Components.
 *
 * Generates CSS for both Visual Builder and frontend rendering.
 * This must match the PHP render_callback CSS generation for VB/frontend parity.
 *
 * @since 3.0.0
 */

import React from 'react';
import { StyleContainer } from '@divi/module';

/**
 * Helper to get attribute value from nested structure.
 * @param {object} attrs - Attributes object
 * @param {string} path - Dot-separated path like 'cf7.advanced.formBg'
 * @param {string} breakpoint - Breakpoint (desktop, tablet, phone)
 * @returns {string} Value or empty string
 */
const getAttrValue = (attrs, path, breakpoint = 'desktop') => {
  const parts = path.split('.');
  let node = attrs;
  
  for (const part of parts) {
    if (!node || typeof node !== 'object' || !(part in node)) {
      return '';
    }
    node = node[part];
  }
  
  if (!node || typeof node !== 'object' || !node[breakpoint]) {
    return '';
  }
  
  const value = node[breakpoint].value;
  if (typeof value === 'boolean') {
    return value ? 'on' : 'off';
  }
  return value || '';
};

/**
 * Convert Divi padding format "t|r|b|l" to CSS "t r b l".
 * @param {string} value - Padding value in Divi format
 * @returns {string} CSS padding value
 */
const paddingToCss = (value) => {
  if (!value || typeof value !== 'string') return '';
  if (!value.includes('|')) return value;
  
  const parts = value.split('|').map(p => p.trim());
  while (parts.length < 4) parts.push('0');
  return parts.slice(0, 4).join(' ');
};

/**
 * Module's style components.
 */
const ModuleStyles = ({
  attrs,
  settings,
  orderClass,
  mode,
  state,
  noStyleTag,
  elements,
}) => {
  // Generate custom CSS for CF7 styling
  let customCss = '';
  
  // Base selector for scoped CSS
  const baseSelector = orderClass;
  
  // === FORM CONTAINER STYLES ===
  const formBg = getAttrValue(attrs, 'cf7.advanced.formBg');
  const formPadding = paddingToCss(getAttrValue(attrs, 'cf7.advanced.formPadding'));
  
  if (formBg) {
    customCss += `${baseSelector} .dcs-cf7-styler,${baseSelector} .dipe-cf7-styler{background-color:${formBg};}`;
  }
  if (formPadding && formPadding !== '0 0 0 0' && formPadding !== '0px 0px 0px 0px') {
    customCss += `${baseSelector} .dcs-cf7-styler,${baseSelector} .dipe-cf7-styler{padding:${formPadding};}`;
  }
  
  // === FORM HEADER STYLES ===
  const formHeaderBg = getAttrValue(attrs, 'cf7.advanced.formHeaderBg');
  const formHeaderPadding = paddingToCss(getAttrValue(attrs, 'cf7.advanced.formHeaderPadding'));
  const formHeaderBottom = getAttrValue(attrs, 'cf7.advanced.formHeaderBottom');
  const formHeaderImgBg = getAttrValue(attrs, 'cf7.advanced.formHeaderImgBg');
  const formHeaderIconColor = getAttrValue(attrs, 'cf7.advanced.formHeaderIconColor');
  
  if (formHeaderBg) {
    customCss += `${baseSelector} .dcs-form-header-container,${baseSelector} .dipe-form-header-container,${baseSelector} .dcs-cf7-header{background-color:${formHeaderBg};}`;
  }
  if (formHeaderPadding && formHeaderPadding !== '0 0 0 0' && formHeaderPadding !== '0px 0px 0px 0px') {
    customCss += `${baseSelector} .dcs-form-header-container,${baseSelector} .dipe-form-header-container,${baseSelector} .dcs-cf7-header{padding:${formHeaderPadding};}`;
  }
  if (formHeaderBottom && formHeaderBottom !== '0px' && formHeaderBottom !== '0') {
    customCss += `${baseSelector} .dcs-form-header-container,${baseSelector} .dipe-form-header-container,${baseSelector} .dcs-cf7-header{margin-bottom:${formHeaderBottom};}`;
  }
  if (formHeaderImgBg) {
    customCss += `${baseSelector} .dcs-form-header-icon,${baseSelector} .dipe-form-header-icon,${baseSelector} .dcs-form-header-image,${baseSelector} .dipe-form-header-image{background-color:${formHeaderImgBg};}`;
  }
  if (formHeaderIconColor) {
    customCss += `${baseSelector} .dcs-form-header-icon span,${baseSelector} .dipe-form-header-icon span{color:${formHeaderIconColor};}`;
  }
  
  // === FORM FIELD STYLES ===
  const fieldBg = getAttrValue(attrs, 'cf7.advanced.formBackgroundColor');
  const fieldPadding = paddingToCss(getAttrValue(attrs, 'cf7.advanced.formFieldPadding'));
  const fieldHeight = getAttrValue(attrs, 'cf7.advanced.formFieldHeight');
  const fieldSpacing = getAttrValue(attrs, 'cf7.advanced.formFieldSpacing');
  const fieldActiveColor = getAttrValue(attrs, 'cf7.advanced.formFieldActiveColor');
  const fieldBorderColor = getAttrValue(attrs, 'cf7.advanced.formFieldBorderColor');
  const fieldBorderWidth = getAttrValue(attrs, 'cf7.advanced.formFieldBorderWidth');
  const fieldBorderRadius = getAttrValue(attrs, 'cf7.advanced.formFieldBorderRadius');
  const fieldTextColor = getAttrValue(attrs, 'cf7.advanced.formFieldTextColor');
  
  // Field selectors for both VB preview and frontend
  const fieldSelectors = `${baseSelector} .dcs-cf7-styler input:not([type=submit]),${baseSelector} .dcs-cf7-styler select,${baseSelector} .dcs-cf7-styler textarea,${baseSelector} .dipe-cf7 input:not([type=submit]),${baseSelector} .dipe-cf7 select,${baseSelector} .dipe-cf7 textarea,${baseSelector} .dcs-cf7-form-preview input,${baseSelector} .dcs-cf7-form-preview textarea`;
  
  if (fieldBg) {
    customCss += `${fieldSelectors}{background-color:${fieldBg} !important;}`;
  }
  if (fieldPadding && fieldPadding !== '0 0 0 0') {
    customCss += `${fieldSelectors}{padding:${fieldPadding} !important;}`;
  }
  if (fieldHeight && fieldHeight !== '0px' && fieldHeight !== '0') {
    customCss += `${fieldSelectors}{height:${fieldHeight} !important;}`;
  }
  if (fieldBorderColor) {
    customCss += `${fieldSelectors}{border-color:${fieldBorderColor} !important;}`;
  }
  if (fieldBorderWidth && fieldBorderWidth !== '0px' && fieldBorderWidth !== '0') {
    customCss += `${fieldSelectors}{border-width:${fieldBorderWidth} !important;border-style:solid;}`;
  }
  if (fieldBorderRadius && fieldBorderRadius !== '0px' && fieldBorderRadius !== '0') {
    customCss += `${fieldSelectors}{border-radius:${fieldBorderRadius} !important;}`;
  }
  if (fieldTextColor) {
    customCss += `${fieldSelectors}{color:${fieldTextColor} !important;}`;
  }
  if (fieldActiveColor) {
    customCss += `${baseSelector} .dipe-cf7 input:not([type=submit]):focus,${baseSelector} .dipe-cf7 select:focus,${baseSelector} .dipe-cf7 textarea:focus,${baseSelector} .dcs-cf7-form-preview input:focus,${baseSelector} .dcs-cf7-form-preview textarea:focus{border-color:${fieldActiveColor} !important;}`;
  }
  if (fieldSpacing && fieldSpacing !== '0px' && fieldSpacing !== '0') {
    customCss += `${baseSelector} .dipe-cf7 .wpcf7 form>p,${baseSelector} .dipe-cf7 .wpcf7 form>div,${baseSelector} .dipe-cf7 .wpcf7 form>label,${baseSelector} .dcs-cf7-form-preview__field{margin-bottom:${fieldSpacing} !important;}`;
  }
  
  // === LABEL STYLES ===
  const labelSpacing = getAttrValue(attrs, 'cf7.advanced.formLabelSpacing');
  const labelColor = getAttrValue(attrs, 'cf7.advanced.formLabelColor');
  
  if (labelSpacing && labelSpacing !== '0px' && labelSpacing !== '0') {
    customCss += `${baseSelector} .dipe-cf7-container .wpcf7-form-control:not(.wpcf7-submit),${baseSelector} .dcs-cf7-form-preview input,${baseSelector} .dcs-cf7-form-preview textarea{margin-top:${labelSpacing} !important;}`;
  }
  if (labelColor) {
    customCss += `${baseSelector} .dipe-cf7 label,${baseSelector} .dcs-cf7-styler label,${baseSelector} .dcs-cf7-form-preview label{color:${labelColor} !important;}`;
  }
  
  // === BUTTON STYLES ===
  const buttonBg = getAttrValue(attrs, 'cf7.advanced.buttonBg');
  const buttonColor = getAttrValue(attrs, 'cf7.advanced.buttonColor');
  const buttonPadding = paddingToCss(getAttrValue(attrs, 'cf7.advanced.buttonPadding'));
  const buttonBorderColor = getAttrValue(attrs, 'cf7.advanced.buttonBorderColor');
  const buttonBorderWidth = getAttrValue(attrs, 'cf7.advanced.buttonBorderWidth');
  const buttonBorderRadius = getAttrValue(attrs, 'cf7.advanced.buttonBorderRadius');
  const buttonAlignment = getAttrValue(attrs, 'cf7.advanced.buttonAlignment');
  const buttonFullwidth = getAttrValue(attrs, 'cf7.advanced.useFormButtonFullwidth');
  
  const buttonSelectors = `${baseSelector} .dipe-cf7 input[type=submit],${baseSelector} .dcs-cf7-styler input[type=submit],${baseSelector} .dcs-cf7-form-preview__submit,${baseSelector} .dcs-cf7-form-preview button`;
  
  if (buttonBg) {
    customCss += `${buttonSelectors}{background-color:${buttonBg} !important;}`;
  }
  if (buttonColor) {
    customCss += `${buttonSelectors}{color:${buttonColor} !important;}`;
  }
  if (buttonPadding && buttonPadding !== '0 0 0 0') {
    customCss += `${buttonSelectors}{padding:${buttonPadding} !important;}`;
  }
  if (buttonBorderColor) {
    customCss += `${buttonSelectors}{border-color:${buttonBorderColor} !important;}`;
  }
  if (buttonBorderWidth && buttonBorderWidth !== '0px' && buttonBorderWidth !== '0') {
    customCss += `${buttonSelectors}{border-width:${buttonBorderWidth} !important;border-style:solid;}`;
  }
  if (buttonBorderRadius && buttonBorderRadius !== '0px' && buttonBorderRadius !== '0') {
    customCss += `${buttonSelectors}{border-radius:${buttonBorderRadius} !important;}`;
  }
  if (buttonFullwidth === 'on') {
    customCss += `${buttonSelectors}{width:100% !important;}`;
  }
  if (buttonAlignment && buttonAlignment !== 'left') {
    const flexAlign = buttonAlignment === 'center' ? 'center' : 'flex-end';
    customCss += `${baseSelector} .dcs-cf7-form-preview__fields,${baseSelector} .dipe-cf7 p:has(input[type=submit]){display:flex;flex-direction:column;align-items:${flexAlign};}`;
  }
  
  // === RADIO/CHECKBOX STYLES ===
  const crCustomStyles = getAttrValue(attrs, 'cf7.advanced.crCustomStyles');
  
  if (crCustomStyles === 'on') {
    const crSize = getAttrValue(attrs, 'cf7.advanced.crSize');
    const crBorderSize = getAttrValue(attrs, 'cf7.advanced.crBorderSize');
    const crBg = getAttrValue(attrs, 'cf7.advanced.crBackgroundColor');
    const crSelected = getAttrValue(attrs, 'cf7.advanced.crSelectedColor');
    const crBorder = getAttrValue(attrs, 'cf7.advanced.crBorderColor');
    const crLabel = getAttrValue(attrs, 'cf7.advanced.crLabelColor');
    
    const crSelector = `${baseSelector} .dipe-cf7.dipe-cf7-cr .wpcf7-checkbox input[type="checkbox"] + span:before,${baseSelector} .dipe-cf7.dipe-cf7-cr .wpcf7-acceptance input[type="checkbox"] + span:before,${baseSelector} .dipe-cf7.dipe-cf7-cr .wpcf7-radio input[type="radio"] + span:before`;
    
    if (crSize || crBorderSize) {
      const w = crSize || '14px';
      const b = crBorderSize || '1px';
      customCss += `${crSelector}{width:${w} !important;height:${w} !important;border-width:${b} !important;}`;
    }
    if (crBg) {
      customCss += `${crSelector}{background-color:${crBg} !important;}`;
      customCss += `${baseSelector} .dipe-cf7.dipe-cf7-cr .wpcf7-radio input[type="radio"]:checked + span:before{box-shadow:inset 0 0 0 4px ${crBg} !important;}`;
    }
    if (crSelected) {
      customCss += `${baseSelector} .dipe-cf7.dipe-cf7-cr .wpcf7-checkbox input[type="checkbox"]:checked + span:before,${baseSelector} .dipe-cf7.dipe-cf7-cr .wpcf7-acceptance input[type="checkbox"]:checked + span:before{color:${crSelected} !important;}`;
      customCss += `${baseSelector} .dipe-cf7.dipe-cf7-cr .wpcf7-radio input[type="radio"]:checked + span:before{background-color:${crSelected} !important;}`;
    }
    if (crBorder) {
      customCss += `${crSelector}{border-color:${crBorder} !important;}`;
    }
    if (crLabel) {
      customCss += `${baseSelector} .dipe-cf7.dipe-cf7-cr .wpcf7-checkbox label,${baseSelector} .dipe-cf7.dipe-cf7-cr .wpcf7-radio label{color:${crLabel} !important;}`;
    }
  }
  
  // === MESSAGE STYLES ===
  const msgPadding = getAttrValue(attrs, 'cf7.advanced.cf7MessagePadding');
  const msgMarginTop = getAttrValue(attrs, 'cf7.advanced.cf7MessageMarginTop');
  const msgAlign = getAttrValue(attrs, 'cf7.advanced.cf7MessageAlignment');
  const msgColor = getAttrValue(attrs, 'cf7.advanced.cf7MessageColor');
  const msgBg = getAttrValue(attrs, 'cf7.advanced.cf7MessageBgColor');
  const msgBorderHl = getAttrValue(attrs, 'cf7.advanced.cf7BorderHighlightColor');
  const successColor = getAttrValue(attrs, 'cf7.advanced.cf7SuccessMessageColor');
  const successBg = getAttrValue(attrs, 'cf7.advanced.cf7SuccessMessageBgColor');
  const successBorder = getAttrValue(attrs, 'cf7.advanced.cf7SuccessBorderColor');
  const errorColor = getAttrValue(attrs, 'cf7.advanced.cf7ErrorMessageColor');
  const errorBg = getAttrValue(attrs, 'cf7.advanced.cf7ErrorMessageBgColor');
  const errorBorder = getAttrValue(attrs, 'cf7.advanced.cf7ErrorBorderColor');
  
  if (msgAlign) {
    customCss += `${baseSelector} .wpcf7 form .wpcf7-response-output,${baseSelector} .wpcf7 form span.wpcf7-not-valid-tip{text-align:${msgAlign};}`;
  }
  if (msgColor) {
    customCss += `${baseSelector} .dipe-cf7 span.wpcf7-not-valid-tip{color:${msgColor} !important;}`;
  }
  if (msgBg) {
    customCss += `${baseSelector} .dipe-cf7 span.wpcf7-not-valid-tip{background-color:${msgBg} !important;}`;
  }
  if (msgBorderHl) {
    customCss += `${baseSelector} .dipe-cf7 span.wpcf7-not-valid-tip{border:2px solid ${msgBorderHl} !important;}`;
  }
  if (msgPadding && msgPadding !== '0px' && msgPadding !== '0') {
    customCss += `${baseSelector} span.wpcf7-not-valid-tip{padding:${msgPadding} !important;}`;
  }
  if (msgMarginTop && msgMarginTop !== '0px' && msgMarginTop !== '0') {
    customCss += `${baseSelector} span.wpcf7-not-valid-tip{margin-top:${msgMarginTop} !important;}`;
  }
  if (successColor) {
    customCss += `${baseSelector} .dipe-cf7 .wpcf7-mail-sent-ok{color:${successColor} !important;}`;
  }
  if (successBg) {
    customCss += `${baseSelector} .wpcf7 form.sent .wpcf7-response-output{background-color:${successBg} !important;}`;
  }
  if (successBorder) {
    customCss += `${baseSelector} .wpcf7 form.sent .wpcf7-response-output{border-color:${successBorder} !important;}`;
  }
  if (errorColor) {
    customCss += `${baseSelector} .wpcf7 form .wpcf7-response-output{color:${errorColor} !important;}`;
  }
  if (errorBg) {
    customCss += `${baseSelector} .wpcf7 form .wpcf7-response-output{background-color:${errorBg} !important;}`;
  }
  if (errorBorder) {
    customCss += `${baseSelector} .wpcf7 form .wpcf7-response-output{border-color:${errorBorder} !important;}`;
  }

  return (
    <StyleContainer mode={mode} state={state} noStyleTag={noStyleTag}>
      {/* Module container styles (Divi built-in decoration) */}
      {elements.style({
        attrName: 'module',
        styleProps: {
          disabledOn: {
            disabledModuleVisibility: settings?.disabledModuleVisibility,
          },
        },
      })}

      {/* CF7 container styles (Divi built-in decoration) */}
      {elements.style({
        attrName: 'cf7',
        styleProps: {
          disabledOn: {
            disabledModuleVisibility: settings?.disabledModuleVisibility,
          },
        },
      })}

      {/* Custom CF7 styling CSS */}
      {customCss && (
        <style>{customCss}</style>
      )}
    </StyleContainer>
  );
};

export { ModuleStyles };
