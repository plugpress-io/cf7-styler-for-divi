/**
 * CF7 Mate – Conditional Logic
 *
 * Show/hide fields based on other field values.
 *
 * @package CF7_Mate
 * @since   3.0.0
 */
(function() {
  'use strict';

  /**
   * Conditional Logic handler.
   */
  class CF7MConditional {
    /**
     * Initialize on a form.
     *
     * @param {HTMLElement} form Form element.
     */
    constructor(form) {
      this.form = form;
      this.conditions = [];
      this.fields = new Map();

      this.init();
    }

    /**
     * Setup conditions and listeners.
     */
    init() {
      // Find all conditional blocks.
      this.form.querySelectorAll('.cf7m-condition').forEach(el => {
        const condition = {
          element: el,
          field: el.dataset.cf7mIf,
          operator: el.dataset.cf7mOperator || 'is',
          value: el.dataset.cf7mValue || '',
          and: el.dataset.cf7mAnd || null,
          or: el.dataset.cf7mOr || null
        };

        this.conditions.push(condition);

        // Track which fields affect conditions.
        this.trackField(condition.field);
      });

      // Bind listeners to all tracked fields.
      this.fields.forEach((_, name) => {
        this.bindField(name);
      });

      // Initial evaluation.
      this.evaluateAll();
    }

    /**
     * Track a field for changes.
     *
     * @param {string} name Field name.
     */
    trackField(name) {
      if (!name || this.fields.has(name)) return;
      this.fields.set(name, true);
    }

    /**
     * Bind change listeners to a field.
     *
     * @param {string} name Field name.
     */
    bindField(name) {
      const selectors = [
        `[name="${name}"]`,
        `[name="${name}[]"]`,
        `[data-name="${name}"]`
      ];

      selectors.forEach(sel => {
        this.form.querySelectorAll(sel).forEach(input => {
          const events = ['change', 'input'];
          events.forEach(evt => {
            input.addEventListener(evt, () => this.evaluateAll());
          });
        });
      });
    }

    /**
     * Get field value by name.
     *
     * @param {string} name Field name.
     * @return {string|number|boolean} Field value.
     */
    getFieldValue(name) {
      // Check for checkboxes/radios first.
      const checkboxes = this.form.querySelectorAll(
        `[name="${name}"]:checked, [name="${name}[]"]:checked`
      );

      if (checkboxes.length > 0) {
        // Return array of checked values or single value.
        const values = Array.from(checkboxes).map(el => el.value);
        return values.length === 1 ? values[0] : values;
      }

      // Check for checkbox that's unchecked.
      const checkbox = this.form.querySelector(`[name="${name}"][type="checkbox"]`);
      if (checkbox) {
        return checkbox.checked;
      }

      // Standard inputs.
      const input = this.form.querySelector(`[name="${name}"], [name="${name}[]"]`);
      if (input) {
        return input.value;
      }

      // Hidden inputs from custom fields (star rating, range, etc.).
      const hidden = this.form.querySelector(`input[name="${name}"]`);
      if (hidden) {
        return hidden.value;
      }

      return '';
    }

    /**
     * Evaluate a single condition.
     *
     * @param {Object} condition Condition object.
     * @return {boolean} Whether condition is met.
     */
    evaluate(condition) {
      const fieldValue = this.getFieldValue(condition.field);
      const targetValue = condition.value;
      const operator = condition.operator;

      return this.compare(fieldValue, operator, targetValue);
    }

    /**
     * Compare values with operator.
     *
     * @param {*} fieldValue  Actual field value.
     * @param {string} operator Comparison operator.
     * @param {string} target   Target value to compare.
     * @return {boolean} Comparison result.
     */
    compare(fieldValue, operator, target) {
      // Handle array values (multiple checkboxes).
      if (Array.isArray(fieldValue)) {
        switch (operator) {
          case 'is':
            return fieldValue.includes(target);
          case 'not':
            return !fieldValue.includes(target);
          case 'any':
            const anyValues = target.split(',').map(v => v.trim());
            return fieldValue.some(v => anyValues.includes(v));
          case 'empty':
            return target === 'true' ? fieldValue.length === 0 : fieldValue.length > 0;
          default:
            return fieldValue.includes(target);
        }
      }

      // Convert to string for comparison.
      const strValue = String(fieldValue).trim();
      const strTarget = String(target).trim();

      // Numeric values for comparison operators.
      const numValue = parseFloat(strValue) || 0;
      const numTarget = parseFloat(strTarget) || 0;

      switch (operator) {
        case 'is':
          return strValue === strTarget;

        case 'not':
          return strValue !== strTarget;

        case 'gt':
          return numValue > numTarget;

        case 'lt':
          return numValue < numTarget;

        case 'gte':
          return numValue >= numTarget;

        case 'lte':
          return numValue <= numTarget;

        case 'contains':
          return strValue.toLowerCase().includes(strTarget.toLowerCase());

        case 'empty':
          const isEmpty = strValue === '';
          return strTarget === 'true' ? isEmpty : !isEmpty;

        case 'checked':
          const isChecked = fieldValue === true || strValue === 'true' || strValue !== '';
          return strTarget === 'true' ? isChecked : !isChecked;

        case 'any':
          const anyValues = strTarget.split(',').map(v => v.trim());
          return anyValues.includes(strValue);

        default:
          return strValue === strTarget;
      }
    }

    /**
     * Evaluate all conditions and update visibility.
     */
    evaluateAll() {
      this.conditions.forEach(condition => {
        const result = this.evaluate(condition);
        this.toggle(condition.element, result);
      });
    }

    /**
     * Toggle element visibility.
     *
     * @param {HTMLElement} element Element to toggle.
     * @param {boolean} show Whether to show.
     */
    toggle(element, show) {
      if (show) {
        element.style.display = '';
        element.classList.add('cf7m-condition--visible');

        // Enable inputs inside.
        element.querySelectorAll('input, select, textarea').forEach(input => {
          input.disabled = false;
        });
      } else {
        element.style.display = 'none';
        element.classList.remove('cf7m-condition--visible');

        // Disable inputs to exclude from submission.
        element.querySelectorAll('input, select, textarea').forEach(input => {
          input.disabled = true;
        });
      }
    }
  }

  /**
   * Initialize on all forms.
   */
  function init() {
    document.querySelectorAll('.wpcf7-form').forEach(form => {
      if (form.querySelector('.cf7m-condition') && !form._cf7mConditional) {
        form._cf7mConditional = new CF7MConditional(form);
      }
    });
  }

  // Init on ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-init after AJAX.
  document.addEventListener('wpcf7mailsent', init);

  // Expose class.
  window.CF7MConditional = CF7MConditional;
})();
