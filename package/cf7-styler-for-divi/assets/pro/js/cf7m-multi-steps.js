/**
 * CF7 Mate Pro – Multi-step form (cf7m-step) behaviour.
 * Premium-only. Enqueued on frontend when a CF7 form uses multi-step.
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

      var steps = form.querySelectorAll('.cf7m-step');
      var progress = form.querySelectorAll('.cf7m-progress-step');
      var prev = form.querySelector('.cf7m-prev-step');
      var next = form.querySelector('.cf7m-next-step');
      var current = 1;
      var total = parseInt(form.dataset.totalSteps, 10) || 1;

      function show(n) {
        steps.forEach(function (s, i) {
          s.classList.toggle('active', i + 1 === n);
        });
        progress.forEach(function (p, i) {
          p.classList.remove('active', 'completed');
          if (i + 1 < n) p.classList.add('completed');
          if (i + 1 === n) p.classList.add('active');
        });
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
