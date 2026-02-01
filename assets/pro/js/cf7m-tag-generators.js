/**
 * CF7 Mate - Tag Generator Scripts
 *
 * Handles dynamic tag generation for all CF7 Mate fields in CF7 editor.
 *
 * @package CF7_Mate
 * @since   3.0.0
 */

(function () {
	'use strict';

	/**
	 * Initialize all tag generators.
	 */
	function initTagGenerators() {
		initNumberGenerator();
		initCalcGenerator();
		initTotalGenerator();
		initSeparatorGenerator();
		initHeadingGenerator();
		initRangeGenerator();
		initStarRatingGenerator();
		initColumnGenerator();
		initConditionalGenerator();
	}

	/**
	 * Number field tag generator.
	 */
	function initNumberGenerator() {
		var pane = document.querySelector('.wpcf7-tg-pane-cf7m-number');
		if (!pane || pane.dataset.cf7mInit) return;
		pane.dataset.cf7mInit = '1';

		var fields = {
			name: pane.querySelector('#cf7m-number-name'),
			label: pane.querySelector('#cf7m-number-label'),
			value: pane.querySelector('#cf7m-number-value'),
			min: pane.querySelector('#cf7m-number-min'),
			max: pane.querySelector('#cf7m-number-max'),
			step: pane.querySelector('#cf7m-number-step'),
			prefix: pane.querySelector('#cf7m-number-prefix'),
			suffix: pane.querySelector('#cf7m-number-suffix'),
			required: pane.querySelector('#cf7m-number-required'),
			tag: pane.querySelector('input.tag')
		};

		function updateTag() {
			var tag = fields.required && fields.required.checked ? '[cf7m-number* ' : '[cf7m-number ';
			tag += (fields.name && fields.name.value) || 'qty';

			if (fields.label && fields.label.value) {
				tag += ' label:"' + fields.label.value + '"';
			}

			tag += ' value:' + ((fields.value && fields.value.value) || '1');
			tag += ' min:' + ((fields.min && fields.min.value) || '0');
			tag += ' max:' + ((fields.max && fields.max.value) || '100');

			if (fields.step && fields.step.value && fields.step.value !== '1') {
				tag += ' step:' + fields.step.value;
			}
			if (fields.prefix && fields.prefix.value) {
				tag += ' prefix:"' + fields.prefix.value + '"';
			}
			if (fields.suffix && fields.suffix.value) {
				tag += ' suffix:"' + fields.suffix.value + '"';
			}

			tag += ']';

			if (fields.tag) {
				fields.tag.value = tag;
			}
		}

		bindEvents(fields, updateTag);
	}

	/**
	 * Calculator formula tag generator.
	 */
	function initCalcGenerator() {
		var pane = document.querySelector('.wpcf7-tg-pane-cf7m-calc');
		if (!pane || pane.dataset.cf7mInit) return;
		pane.dataset.cf7mInit = '1';

		var idEl = pane.querySelector('#cf7m-calc-id');
		var formulaEl = pane.querySelector('#cf7m-calc-formula');
		var tagEl = pane.querySelector('input.tag');

		function updateTag() {
			if (!tagEl) return;
			var id = (idEl && idEl.value) || 'total';
			var formula = (formulaEl && formulaEl.value) || 'qty * price';
			tagEl.value = '[cf7m-calc id:' + id + ' formula:"' + formula + '"]';
		}

		if (idEl) {
			idEl.addEventListener('input', updateTag);
		}
		if (formulaEl) {
			formulaEl.addEventListener('input', updateTag);
		}
	}

	/**
	 * Total display tag generator.
	 */
	function initTotalGenerator() {
		var pane = document.querySelector('.wpcf7-tg-pane-cf7m-total');
		if (!pane || pane.dataset.cf7mInit) return;
		pane.dataset.cf7mInit = '1';

		var fields = {
			id: pane.querySelector('#cf7m-total-id'),
			label: pane.querySelector('#cf7m-total-label'),
			format: pane.querySelector('#cf7m-total-format'),
			prefix: pane.querySelector('#cf7m-total-prefix'),
			suffix: pane.querySelector('#cf7m-total-suffix'),
			decimals: pane.querySelector('#cf7m-total-decimals'),
			tag: pane.querySelector('input.tag')
		};

		function updateTag() {
			var tag = '[cf7m-total id:' + ((fields.id && fields.id.value) || 'total');

			if (fields.label && fields.label.value) {
				tag += ' label:"' + fields.label.value + '"';
			}

			tag += ' format:' + ((fields.format && fields.format.value) || 'number');

			if (fields.prefix && fields.prefix.value) {
				tag += ' prefix:"' + fields.prefix.value + '"';
			}
			if (fields.suffix && fields.suffix.value) {
				tag += ' suffix:"' + fields.suffix.value + '"';
			}

			tag += ' decimals:' + ((fields.decimals && fields.decimals.value) || '2');
			tag += ']';

			if (fields.tag) {
				fields.tag.value = tag;
			}
		}

		bindEvents(fields, updateTag);
	}

	/**
	 * Separator tag generator.
	 */
	function initSeparatorGenerator() {
		var pane = document.querySelector('.wpcf7-tg-pane-cf7m-separator');
		if (!pane || pane.dataset.cf7mInit) return;
		pane.dataset.cf7mInit = '1';

		var styleSelect = pane.querySelector('#cf7m-sep-style');
		var colorInput = pane.querySelector('#cf7m-sep-color');
		var marginInput = pane.querySelector('#cf7m-sep-margin');
		var tagOutput = pane.querySelector('input.tag');

		function updateTag() {
			var parts = ['[cf7m-separator'];
			var style = styleSelect && styleSelect.value;
			var color = colorInput && colorInput.value;
			var margin = marginInput && marginInput.value;
			if (style && style !== 'solid') parts.push('style:' + style);
			if (color && color !== '#e5e7eb') parts.push('color:' + color);
			if (margin && margin !== '20') parts.push('margin:' + margin);
			if (tagOutput) tagOutput.value = parts.join(' ') + ']';
		}

		[styleSelect, colorInput, marginInput].forEach(function (el) {
			if (el) {
				el.addEventListener('input', updateTag);
				el.addEventListener('change', updateTag);
			}
		});
	}

	/**
	 * Heading tag generator.
	 */
	function initHeadingGenerator() {
		var pane = document.querySelector('.wpcf7-tg-pane-cf7m-heading');
		if (!pane || pane.dataset.cf7mInit) return;
		pane.dataset.cf7mInit = '1';

		var textInput = pane.querySelector('#cf7m-heading-text');
		var tagSelect = pane.querySelector('#cf7m-heading-tag');
		var colorInput = pane.querySelector('#cf7m-heading-color');
		var tagOutput = pane.querySelector('input.tag');

		function updateTag() {
			var text = (textInput && textInput.value) || 'Your Heading';
			var tag = (tagSelect && tagSelect.value) || 'h3';
			var color = colorInput && colorInput.value;
			var out = '[cf7m-heading text:"' + text + '" tag:' + tag;
			if (color) out += ' color:' + color;
			out += ']';
			if (tagOutput) tagOutput.value = out;
		}

		[textInput, tagSelect, colorInput].forEach(function (el) {
			if (el) {
				el.addEventListener('input', updateTag);
				el.addEventListener('change', updateTag);
			}
		});
	}

	/**
	 * Range slider tag generator.
	 */
	function initRangeGenerator() {
		var pane = document.querySelector('.wpcf7-tg-pane-cf7m-range');
		if (!pane || pane.dataset.cf7mInit) return;
		pane.dataset.cf7mInit = '1';

		var nameInput = pane.querySelector('#cf7m-range-name');
		var minInput = pane.querySelector('#cf7m-range-min');
		var maxInput = pane.querySelector('#cf7m-range-max');
		var stepInput = pane.querySelector('#cf7m-range-step');
		var defaultInput = pane.querySelector('#cf7m-range-default');
		var prefixInput = pane.querySelector('#cf7m-range-prefix');
		var suffixInput = pane.querySelector('#cf7m-range-suffix');
		var requiredInput = pane.querySelector('#cf7m-range-required');
		var tagOutput = pane.querySelector('input.tag');

		function updateTag() {
			var isRequired = requiredInput && requiredInput.checked;
			var name = (nameInput && nameInput.value) || 'amount';
			var min = (minInput && minInput.value) || '0';
			var max = (maxInput && maxInput.value) || '100';
			var step = (stepInput && stepInput.value) || '1';
			var defaultVal = (defaultInput && defaultInput.value) || '50';
			var prefix = prefixInput && prefixInput.value;
			var suffix = suffixInput && suffixInput.value;

			var tag = isRequired ? '[cf7m-range* ' : '[cf7m-range ';
			tag += name;
			tag += ' min:' + min;
			tag += ' max:' + max;
			tag += ' step:' + step;
			tag += ' default:' + defaultVal;
			if (prefix) tag += ' prefix:"' + prefix + '"';
			if (suffix) tag += ' suffix:"' + suffix + '"';
			tag += ']';

			if (tagOutput) tagOutput.value = tag;
		}

		[nameInput, minInput, maxInput, stepInput, defaultInput, prefixInput, suffixInput, requiredInput].forEach(function (el) {
			if (el) {
				el.addEventListener('input', updateTag);
				el.addEventListener('change', updateTag);
			}
		});
	}

	/**
	 * Star rating tag generator.
	 */
	function initStarRatingGenerator() {
		var pane = document.querySelector('.wpcf7-tg-pane-cf7m-star');
		if (!pane || pane.dataset.cf7mInit) return;
		pane.dataset.cf7mInit = '1';

		var nameInput = pane.querySelector('#cf7m-star-name');
		var maxInput = pane.querySelector('#cf7m-star-max');
		var defaultInput = pane.querySelector('#cf7m-star-default');
		var colorInput = pane.querySelector('#cf7m-star-color');
		var requiredInput = pane.querySelector('#cf7m-star-required');
		var tagOutput = pane.querySelector('input.tag');

		function updateTag() {
			var isRequired = requiredInput && requiredInput.checked;
			var name = (nameInput && nameInput.value) || 'rating';
			var max = (maxInput && maxInput.value) || '5';
			var defaultVal = (defaultInput && defaultInput.value) || '0';
			var color = colorInput && colorInput.value;

			var tag = isRequired ? '[cf7m-star* ' : '[cf7m-star ';
			tag += name;
			tag += ' max:' + max;
			tag += ' default:' + defaultVal;
			if (color) tag += ' color:' + color;
			tag += ']';

			if (tagOutput) tagOutput.value = tag;
		}

		[nameInput, maxInput, defaultInput, colorInput, requiredInput].forEach(function (el) {
			if (el) {
				el.addEventListener('input', updateTag);
				el.addEventListener('change', updateTag);
			}
		});
	}

	/**
	 * Column tag generator.
	 */
	function initColumnGenerator() {
		var pane = document.querySelector('.wpcf7-tg-pane-cf7m-col');
		if (!pane || pane.dataset.cf7mInit) return;
		pane.dataset.cf7mInit = '1';

		var widthSelect = pane.querySelector('#cf7m-col-width');
		var tagOutput = pane.querySelector('input.tag');

		function updateTag() {
			var width = (widthSelect && widthSelect.value) || '50';
			if (tagOutput) tagOutput.value = '[cf7m-col width:' + width + ']\n\n[/cf7m-col]';
		}

		if (widthSelect) {
			widthSelect.addEventListener('change', updateTag);
		}
	}

	/**
	 * Conditional logic tag generator.
	 */
	function initConditionalGenerator() {
		var pane = document.querySelector('.wpcf7-tg-pane-cf7m-if');
		if (!pane || pane.dataset.cf7mInit) return;
		pane.dataset.cf7mInit = '1';

		var fieldInput = pane.querySelector('#cf7m-if-field');
		var operatorSelect = pane.querySelector('#cf7m-if-operator');
		var valueInput = pane.querySelector('#cf7m-if-value');
		var tagOutput = pane.querySelector('input.tag');

		function updateTag() {
			var field = (fieldInput && fieldInput.value) || 'fieldname';
			var op = (operatorSelect && operatorSelect.value) || 'is';
			var val = (valueInput && valueInput.value) || 'value';
			if (tagOutput) tagOutput.value = '[cf7m-if field:"' + field + '" ' + op + ':"' + val + '"]...[/cf7m-if]';
		}

		[fieldInput, operatorSelect, valueInput].forEach(function (el) {
			if (el) {
				el.addEventListener('input', updateTag);
				el.addEventListener('change', updateTag);
			}
		});
	}

	/**
	 * Helper to bind events to fields.
	 */
	function bindEvents(fields, callback) {
		Object.keys(fields).forEach(function (key) {
			var el = fields[key];
			if (el && key !== 'tag') {
				el.addEventListener('input', callback);
				el.addEventListener('change', callback);
			}
		});
	}

	// Initialize when DOM is ready.
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initTagGenerators);
	} else {
		initTagGenerators();
	}

	// Re-initialize when ThickBox content loads (for CF7 tag generator modals).
	var observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			if (mutation.addedNodes.length) {
				mutation.addedNodes.forEach(function (node) {
					if (node.nodeType === 1 && node.querySelector) {
						var selectors = [
							'.wpcf7-tg-pane-cf7m-number',
							'.wpcf7-tg-pane-cf7m-calc',
							'.wpcf7-tg-pane-cf7m-total',
							'.wpcf7-tg-pane-cf7m-separator',
							'.wpcf7-tg-pane-cf7m-heading',
							'.wpcf7-tg-pane-cf7m-range',
							'.wpcf7-tg-pane-cf7m-star',
							'.wpcf7-tg-pane-cf7m-col',
							'.wpcf7-tg-pane-cf7m-if'
						];
						for (var i = 0; i < selectors.length; i++) {
							if (node.querySelector(selectors[i]) || node.matches && node.matches(selectors[i])) {
								initTagGenerators();
								break;
							}
						}
					}
				});
			}
		});
	});

	observer.observe(document.body, { childList: true, subtree: true });

})();
