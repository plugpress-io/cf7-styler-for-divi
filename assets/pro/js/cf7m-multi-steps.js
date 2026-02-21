/**
 * CF7 Mate Pro – Multi-step form (cf7m-step) behaviour.
 * Premium-only. Enqueued on frontend when a CF7 form uses multi-step.
 *
 * Supports progress styles: circles (default), progress-bar, connected.
 *
 * @package CF7_Mate
 * @since 3.0.0
 */

(function () {
  'use strict';

  function init() {
    document.querySelectorAll('.cf7m-multistep-form').forEach(function (form) {
      if (form.dataset.init) return;
      form.dataset.init = '1';

      var steps    = form.querySelectorAll('.cf7m-step');
      var prev     = form.querySelector('.cf7m-prev-step');
      var next     = form.querySelector('.cf7m-next-step');
      var current  = 1;
      var total    = parseInt(form.dataset.totalSteps, 10) || 1;
      var style    = form.dataset.progressStyle || 'circles';

      // Progress elements per style.
      var progress    = form.querySelectorAll('.cf7m-progress-step');
      var barFill     = form.querySelector('.cf7m-progress-bar-fill');
      var barLabel    = form.querySelector('.cf7m-progress-bar-label');
      var items       = form.querySelectorAll('.cf7m-progress-item');
      var connectors  = form.querySelectorAll('.cf7m-progress-connector');

      function show(n) {
        // Toggle active step content.
        steps.forEach(function (s, i) {
          s.classList.toggle('active', i + 1 === n);
        });

        // Update progress indicator based on style.
        if (style === 'progress-bar') {
          if (barFill) barFill.style.width = (n / total * 100) + '%';
          if (barLabel) barLabel.textContent = 'Step ' + n + '/' + total;
        } else if (style === 'connected') {
          items.forEach(function (item, i) {
            item.classList.remove('active', 'completed');
            if (i + 1 < n) item.classList.add('completed');
            if (i + 1 === n) item.classList.add('active');
          });
          connectors.forEach(function (c, i) {
            // Connector i sits between item i and item i+1.
            // It's "completed" when both surrounding steps are done (i+1 < n).
            c.classList.toggle('completed', i + 1 < n);
          });
        } else {
          // Default circles.
          progress.forEach(function (p, i) {
            p.classList.remove('active', 'completed');
            if (i + 1 < n) p.classList.add('completed');
            if (i + 1 === n) p.classList.add('active');
          });
        }

        // Toggle nav buttons.
        if (prev) prev.style.display = n === 1 ? 'none' : 'block';
        if (next) next.style.display = n === total ? 'none' : 'block';
      }

      if (prev) prev.onclick = function () { if (current > 1) { current--; show(current); } };
      if (next) next.onclick = function () { if (current < total) { current++; show(current); } };
      show(1);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
