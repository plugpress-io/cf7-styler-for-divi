import React from 'react';
import { StyleContainer } from '@divi/module';

import designPresetsData from './design-presets.json';

const presets = designPresetsData?.presets ?? [];

const getAttrValue = (attrs, path, breakpoint = 'desktop') => {
  const parts = path.split('.');
  let node = attrs;
  for (const part of parts) {
    if (!node || typeof node !== 'object' || !(part in node)) {
      return '';
    }
    node = node[part];
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return node;
  }
  if (!node || typeof node !== 'object') {
    return '';
  }
  if (node[breakpoint]) {
    const bpValue = node[breakpoint];
    if (typeof bpValue === 'object' && 'value' in bpValue) {
      const value = bpValue.value;
      if (typeof value === 'boolean') {
        return value ? 'on' : 'off';
      }
      return value ?? '';
    }
    return bpValue ?? '';
  }
  if ('top' in node || 'right' in node || 'bottom' in node || 'left' in node) {
    return node;
  }
  if ('value' in node) {
    const value = node.value;
    if (typeof value === 'boolean') {
      return value ? 'on' : 'off';
    }
    return value ?? '';
  }
  return '';
};

const paddingToCss = (value) => {
  if (!value) return '';
  if (typeof value === 'object' && value !== null) {
    const t = value.top || '0px';
    const r = value.right || '0px';
    const b = value.bottom || '0px';
    const l = value.left || '0px';
    return `${t} ${r} ${b} ${l}`;
  }
  if (typeof value !== 'string') return '';
  if (value.includes('|')) {
    const parts = value.split('|').map(p => p.trim() || '0px');
    while (parts.length < 4) parts.push('0px');
    return parts.slice(0, 4).join(' ');
  }
  return value;
};

const ModuleStyles = ({
  attrs,
  settings,
  orderClass,
  mode,
  state,
  noStyleTag,
  elements,
}) => {
  let customCss = '';
  const baseSelector = orderClass;

  const designPresetSlug = getAttrValue(attrs, 'cf7.advanced.designPreset');
  const preset = designPresetSlug ? (presets.find((p) => p.slug === designPresetSlug) ?? null) : null;
  const getEffective = (attrKey) => {
    const fromAttr = getAttrValue(attrs, 'cf7.advanced.' + attrKey);
    if (fromAttr !== '' && fromAttr !== undefined) return fromAttr;
    return preset?.styles?.[attrKey] ?? '';
  };

  const formBg = getEffective('formBg');
  const formPaddingVal = getEffective('formPadding') || getAttrValue(attrs, 'cf7.advanced.formPadding');
  const formPadding = paddingToCss(formPaddingVal);
  
  if (formBg) {
    customCss += `${baseSelector} .dcs-cf7-styler,${baseSelector} .dipe-cf7-styler{background-color:${formBg};}`;
  }
  if (formPadding && formPadding !== '0 0 0 0' && formPadding !== '0px 0px 0px 0px') {
    customCss += `${baseSelector} .dcs-cf7-styler,${baseSelector} .dipe-cf7-styler{padding:${formPadding};}`;
  }

  const formHeaderBg = getEffective('formHeaderBg');
  const formHeaderPaddingVal = getEffective('formHeaderPadding') || getAttrValue(attrs, 'cf7.advanced.formHeaderPadding');
  const formHeaderPadding = paddingToCss(formHeaderPaddingVal);
  const formHeaderBottom = getEffective('formHeaderBottom');
  const formHeaderImgBg = getEffective('formHeaderImgBg');
  const formHeaderIconColor = getEffective('formHeaderIconColor');
  
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

  const fieldBg = getEffective('formBackgroundColor');
  const fieldPaddingVal = getEffective('formFieldPadding') || getAttrValue(attrs, 'cf7.advanced.formFieldPadding');
  const fieldPadding = paddingToCss(fieldPaddingVal);
  const fieldHeight = getEffective('formFieldHeight');
  const fieldSpacing = getEffective('formFieldSpacing');
  const fieldActiveColor = getEffective('formFieldActiveColor');
  const fieldBorderColor = getEffective('formFieldBorderColor');
  const fieldBorderWidth = getEffective('formFieldBorderWidth');
  const fieldBorderRadius = getEffective('formFieldBorderRadius');
  const fieldTextColor = getEffective('formFieldTextColor');
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

  const labelSpacing = getEffective('formLabelSpacing');
  const labelColor = getEffective('formLabelColor');
  
  if (labelSpacing && labelSpacing !== '0px' && labelSpacing !== '0') {
    customCss += `${baseSelector} .dipe-cf7-container .wpcf7-form-control:not(.wpcf7-submit),${baseSelector} .dcs-cf7-form-preview input,${baseSelector} .dcs-cf7-form-preview textarea{margin-top:${labelSpacing} !important;}`;
  }
  if (labelColor) {
    customCss += `${baseSelector} .dipe-cf7 label,${baseSelector} .dcs-cf7-styler label,${baseSelector} .dcs-cf7-form-preview label{color:${labelColor} !important;}`;
  }

  const buttonBg = getEffective('buttonBg');
  const buttonColor = getEffective('buttonColor');
  const buttonPaddingVal = getEffective('buttonPadding') || getAttrValue(attrs, 'cf7.advanced.buttonPadding');
  const buttonPadding = paddingToCss(buttonPaddingVal);
  const buttonBorderColor = getEffective('buttonBorderColor');
  const buttonBorderWidth = getEffective('buttonBorderWidth');
  const buttonBorderRadius = getEffective('buttonBorderRadius');
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

  const crCustomStyles = getEffective('crCustomStyles') || getAttrValue(attrs, 'cf7.advanced.crCustomStyles');
  
  if (crCustomStyles === 'on') {
    const crSize = getEffective('crSize') || getAttrValue(attrs, 'cf7.advanced.crSize');
    const crBorderSize = getEffective('crBorderSize') || getAttrValue(attrs, 'cf7.advanced.crBorderSize');
    const crBg = getEffective('crBackgroundColor');
    const crSelected = getEffective('crSelectedColor');
    const crBorder = getEffective('crBorderColor');
    const crLabel = getEffective('crLabelColor');
    
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

  const msgPadding = getEffective('cf7MessagePadding');
  const msgMarginTop = getEffective('cf7MessageMarginTop');
  const msgAlign = getAttrValue(attrs, 'cf7.advanced.cf7MessageAlignment');
  const msgColor = getEffective('cf7MessageColor');
  const msgBg = getEffective('cf7MessageBgColor');
  const msgBorderHl = getEffective('cf7BorderHighlightColor');
  const successColor = getEffective('cf7SuccessMessageColor');
  const successBg = getEffective('cf7SuccessMessageBgColor');
  const successBorder = getEffective('cf7SuccessBorderColor');
  const errorColor = getEffective('cf7ErrorMessageColor');
  const errorBg = getEffective('cf7ErrorMessageBgColor');
  const errorBorder = getEffective('cf7ErrorBorderColor');
  
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

  const proHeadingFontSize = getAttrValue(attrs, 'cf7.advanced.proHeadingFontSize');
  const proHeadingFontWeight = getAttrValue(attrs, 'cf7.advanced.proHeadingFontWeight');
  const proHeadingTextColor = getAttrValue(attrs, 'cf7.advanced.proHeadingTextColor');
  const proHeadingMargin = paddingToCss(getAttrValue(attrs, 'cf7.advanced.proHeadingMargin'));
  
  if (proHeadingFontSize || proHeadingFontWeight || proHeadingTextColor || (proHeadingMargin && proHeadingMargin !== '0px 0px 0px 0px')) {
    const headingSelector = `${baseSelector} .cf7m-heading`;
    if (proHeadingFontSize) customCss += `${headingSelector}{font-size:${proHeadingFontSize} !important;}`;
    if (proHeadingFontWeight) customCss += `${headingSelector}{font-weight:${proHeadingFontWeight} !important;}`;
    if (proHeadingTextColor) customCss += `${headingSelector}{color:${proHeadingTextColor} !important;}`;
    if (proHeadingMargin && proHeadingMargin !== '0px 0px 0px 0px') customCss += `${headingSelector}{margin:${proHeadingMargin} !important;}`;
  }

  const proIconSize = getAttrValue(attrs, 'cf7.advanced.proIconSize');
  const proIconColor = getAttrValue(attrs, 'cf7.advanced.proIconColor');
  const proIconMargin = paddingToCss(getAttrValue(attrs, 'cf7.advanced.proIconMargin'));
  
  if (proIconSize || proIconColor || (proIconMargin && proIconMargin !== '0px 0px 0px 0px')) {
    const iconSelector = `${baseSelector} .cf7m-icon`;
    if (proIconSize) customCss += `${iconSelector}{font-size:${proIconSize} !important;}`;
    if (proIconColor) customCss += `${iconSelector}{color:${proIconColor} !important;}`;
    if (proIconMargin && proIconMargin !== '0px 0px 0px 0px') customCss += `${iconSelector}{margin:${proIconMargin} !important;}`;
  }

  const proImageWidth = getAttrValue(attrs, 'cf7.advanced.proImageWidth');
  const proImageHeight = getAttrValue(attrs, 'cf7.advanced.proImageHeight');
  const proImageBorderColor = getAttrValue(attrs, 'cf7.advanced.proImageBorderColor');
  const proImageBorderWidth = getAttrValue(attrs, 'cf7.advanced.proImageBorderWidth');
  const proImageBorderRadius = getAttrValue(attrs, 'cf7.advanced.proImageBorderRadius');
  const proImagePadding = paddingToCss(getAttrValue(attrs, 'cf7.advanced.proImagePadding'));
  const proImageMargin = paddingToCss(getAttrValue(attrs, 'cf7.advanced.proImageMargin'));
  
  if (proImageWidth || proImageHeight || proImageBorderColor || proImageBorderWidth || proImageBorderRadius || proImagePadding || proImageMargin) {
    const imageSelector = `${baseSelector} .cf7m-image`;
    if (proImageWidth) customCss += `${imageSelector}{width:${proImageWidth} !important;}`;
    if (proImageHeight) customCss += `${imageSelector}{height:${proImageHeight} !important;object-fit:cover;}`;
    if (proImageBorderColor) customCss += `${imageSelector}{border-color:${proImageBorderColor} !important;}`;
    if (proImageBorderWidth && proImageBorderWidth !== '0px') customCss += `${imageSelector}{border-width:${proImageBorderWidth} !important;border-style:solid;}`;
    if (proImageBorderRadius && proImageBorderRadius !== '0px') customCss += `${imageSelector}{border-radius:${proImageBorderRadius} !important;}`;
    if (proImagePadding && proImagePadding !== '0px 0px 0px 0px') customCss += `${imageSelector}{padding:${proImagePadding} !important;}`;
    if (proImageMargin && proImageMargin !== '0px 0px 0px 0px') customCss += `${imageSelector}{margin:${proImageMargin} !important;}`;
  }

  const proRangeTrackColor = getAttrValue(attrs, 'cf7.advanced.proRangeTrackColor');
  const proRangeThumbColor = getAttrValue(attrs, 'cf7.advanced.proRangeThumbColor');
  const proRangeHeight = getAttrValue(attrs, 'cf7.advanced.proRangeHeight');
  const proRangeMargin = paddingToCss(getAttrValue(attrs, 'cf7.advanced.proRangeMargin'));
  
  if (proRangeTrackColor || proRangeThumbColor || proRangeHeight || (proRangeMargin && proRangeMargin !== '0px 0px 0px 0px')) {
    const rangeInput = `${baseSelector} .cf7m-range-input`;
    if (proRangeTrackColor) customCss += `${rangeInput}{background:${proRangeTrackColor} !important;--cf7m-range-track:${proRangeTrackColor};}`;
    if (proRangeHeight) customCss += `${rangeInput}{height:${proRangeHeight} !important;}`;
    if (proRangeThumbColor) {
      customCss += `${rangeInput}::-webkit-slider-thumb{background:${proRangeThumbColor} !important;}`;
      customCss += `${rangeInput}::-moz-range-thumb{background:${proRangeThumbColor} !important;}`;
      customCss += `${baseSelector} .cf7m-range-slider, ${baseSelector} .dcs-range-slider{--cf7m-range-thumb:${proRangeThumbColor};}`;
    }
    if (proRangeMargin && proRangeMargin !== '0px 0px 0px 0px') {
      customCss += `${baseSelector} .cf7m-range-slider, ${baseSelector} .dcs-range-slider{margin:${proRangeMargin} !important;}`;
    }
  }

  const proStarColor = getAttrValue(attrs, 'cf7.advanced.proStarColor');
  const proStarActiveColor = getAttrValue(attrs, 'cf7.advanced.proStarActiveColor');
  const proStarSize = getAttrValue(attrs, 'cf7.advanced.proStarSize');
  const proStarMargin = paddingToCss(getAttrValue(attrs, 'cf7.advanced.proStarMargin'));
  
  if (proStarColor || proStarActiveColor || proStarSize || (proStarMargin && proStarMargin !== '0px 0px 0px 0px')) {
    const starSel = `${baseSelector} .cf7m-star-rating .cf7m-star, ${baseSelector} .dcs-star-rating .dcs-star`;
    const activeSel = `${baseSelector} .cf7m-star-rating .cf7m-star.cf7m-star--on, ${baseSelector} .dcs-star-rating .dcs-star.filled, ${baseSelector} .dcs-star-rating .dcs-star.hover`;
    if (proStarColor) customCss += `${starSel}{color:${proStarColor} !important;}`;
    if (proStarActiveColor) customCss += `${activeSel}{color:${proStarActiveColor} !important;}`;
    if (proStarSize) customCss += `${starSel}{font-size:${proStarSize} !important;} ${baseSelector} .cf7m-star-rating .cf7m-star-svg{width:1em;height:1em;} ${baseSelector} .cf7m-star-rating{--cf7m-star-size:1em;}`;
    if (proStarMargin && proStarMargin !== '0px 0px 0px 0px') {
      customCss += `${baseSelector} .cf7m-star-rating, ${baseSelector} .dcs-star-rating{margin:${proStarMargin} !important;}`;
    }
  }

  return (
    <StyleContainer mode={mode} state={state} noStyleTag={noStyleTag}>
      {elements.style({
        attrName: 'module',
        styleProps: {
          disabledOn: {
            disabledModuleVisibility: settings?.disabledModuleVisibility,
          },
        },
      })}
      {elements.style({
        attrName: 'cf7',
        styleProps: {
          disabledOn: {
            disabledModuleVisibility: settings?.disabledModuleVisibility,
          },
        },
      })}
      {customCss && <style>{customCss}</style>}
    </StyleContainer>
  );
};

export { ModuleStyles };
