/**
 * CF7 Mate Pro – Range slider field (cf7m-range) behaviour.
 * Premium-only. Enqueued on frontend when a CF7 form uses range slider.
 *
 * @package CF7_Mate
 * @since 3.0.0
 */

(function () {
  'use strict';

  function init() {
    document.querySelectorAll('.dcs-range-slider').forEach(function (c) {
      if (c.dataset.init) return;
      c.dataset.init = '1';

      var input = c.querySelector('.cf7m-range-input');
      var display = c.querySelector('.dcs-range-value');
      var prefix = c.dataset.prefix || '';
      var suffix = c.dataset.suffix || '';

      if (!input || !display) return;

      function update() {
        display.textContent = prefix + input.value + suffix;
      }

      input.oninput = update;
      update();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
