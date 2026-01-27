/*	@license
	This file is from the submodule-builder repository.
	See the license.txt file for licensing information for third-party code that may be used in this file.
	Relative to the scripts/ directory, the license.txt file is located at ../license.txt.
	This file (or the corresponding source JS file) has been modified by Jonathan Hall and/or others.
	This file (or the corresponding source JS file) was last modified 2020-11-25
*/

// External dependenciess
import {forEach, get, isArray, isEmpty, isObject, map, mapValues} from 'lodash';
import Utils from './utils';
import Hover from './hover-options';
// import Sticky from './sticky-options';
import Responsive from './responsive-options';

/**
 * Format values by type.
 *
 * @since 4.6.0
 *
 * @param {object | Array | string} values
 * @param {string} type
 */
const formatValues = (values, type) => {
    const formatValue = (value) => {
        let val = '';
        switch (type) {
            case 'range':
                val = Utils.processRangeValue(value);
                break;
            case 'margin':
            case 'padding':
                if (value) {
                    value = value.split('|');
                    val =
                        (value[0] ? value[0] : 0) +
                        ' ' +
                        (value[1] ? value[1] : 0) +
                        ' ' +
                        (value[2] ? value[2] : 0) +
                        ' ' +
                        (value[3] ? value[3] : 0);
                }
                break;
            default:
                val = value;
                break;
        }

        return val;
    };

    if (isObject(values)) {
        return mapValues(values, formatValue);
    }
    if (isArray(values)) {
        return map(values, formatValue);
    }
    return formatValue(values);
};

/**
 * Generate responsive + sticky state styles
 * Use the `Responsive.generateResponsiveCSS`
 * with addition to generating sticky state styles if module enable it.
 *
 * @since 4.6.0
 * @param moduleArgs
 * @param {object} {moduleArgs}
 */
export const generateStyles = (moduleArgs) => {
    const defaultArgs = {
        address: '',
        attrs: {},
        name: '',
        defaultValue: '',
        type: '',
        forceReturn: false,
        selector: '%%order_class%%',
        cssProperty: '',
        important: false,
        hover: true,
        sticky: true,
        responsive: true,
        isStickyModule: null,
        stickyPseudoSelectorLocation: 'order_class',
    };

    const args = {
        ...defaultArgs,
        ...moduleArgs,
    };

    const {
        address,
        attrs,
        name,
        defaultValue,
        type,
        forceReturn,
        selector,
        cssProperty,
        important,
        hover,
        sticky,
        responsive,
        isStickyModule,
        stickyPseudoSelectorLocation,
    } = args;

    let cssDeclarations = [];
    let additionalCSS = important ? ' !important' : '';

    // Common styles
    if (responsive) {
        // Need to close the additionalCSS with the semicolon to prevent responsive css generation from generating invalid css
        // when the cssProperty is an array
        additionalCSS = '' === additionalCSS ? additionalCSS : `${additionalCSS};`;
        const reponsiveValues = formatValues(
            Responsive.getPropertyValues(attrs, name, defaultValue, hover, forceReturn),
            type
        );
        const reponsiveCss = Responsive.generateResponsiveCSS(reponsiveValues, selector, cssProperty, additionalCSS);
        cssDeclarations = isEmpty(reponsiveCss) ? cssDeclarations : reponsiveCss;
    } else {
        let cssValue = formatValues(get(attrs, name, defaultValue), type);
        if (hover) {
            const hoverValue = Hover.getHoverOrNormalOnHover(name, attrs);
            cssValue = Utils.hasValue(hoverValue) ? formatValues(hoverValue, type) : formatValues(defaultValue, type);
        }

        if (Utils.hasValue(cssValue)) {
            let declaration = '';

            // Allow to use multiple properties in array for the same value.
            if (isArray(cssProperty)) {
                forEach(cssProperty, (cssProp) => (declaration += `${cssProp}: ${cssValue}${additionalCSS}; `));
            } else {
                declaration = `${cssProperty}: ${cssValue}${additionalCSS};`;
            }

            cssDeclarations.push({
                selector,
                declaration: declaration.trim(),
                device: 'desktop',
            });
        }
    }

    // Sticky styles
    /*
  const hasStickyStyles = Sticky.canHaveStickyStyle(address, attrs) && Sticky.isEnabled(name, attrs);
  if (sticky && hasStickyStyles) {
    const stickyValue    = formatValues(Sticky.getValue(name, attrs, defaultValue));
    const isSticky       = null !== isStickyModule ? isStickyModule : Sticky.isStickyModule(address, attrs);
    const stickySelector = 'order_class' === stickyPseudoSelectorLocation ? Sticky.addStickyToOrderClass(selector, isSticky) : Sticky.addStickyToSelectors(selector, isSticky);

    if (Utils.hasValue(stickyValue)) {
      let declaration = '';

      // Allow to use multiple properties in array for the same value.
      if (isArray(cssProperty)) {
        forEach(cssProperty, cssProp => declaration += `${cssProp}: ${stickyValue}${additionalCSS}; `);
      } else {
        declaration = `${cssProperty}: ${stickyValue}${additionalCSS};`;
      }

      cssDeclarations.push({
        selector: stickySelector,
        declaration: declaration.trim(),
        device: 'desktop',
      });
    }
  }
  */

    return cssDeclarations;
};

export default {
    generateStyles,
};
