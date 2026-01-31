/**
 * CF7 Mate – Image field tag generator: open WordPress media modal and fill URL/alt.
 *
 * @package CF7_Mate
 * @since 3.0.0
 */
(function ($) {
  'use strict';

  function openMediaModal(panel) {
    var srcInput = panel.querySelector('input.cf7m-image-src-input, input[name="src"]');
    var altInput = panel.querySelector('input.cf7m-image-alt-input, input[name="alt"]');
    if (!srcInput) return;

    if (typeof wp === 'undefined' || !wp.media) {
      return;
    }

    var frame = wp.media({
      library: { type: 'image' },
      multiple: false,
      title: (typeof wp !== 'undefined' && wp.i18n && wp.i18n.__) ? wp.i18n.__('Select Image', 'cf7-styler-for-divi') : 'Select Image',
      button: { text: (typeof wp !== 'undefined' && wp.i18n && wp.i18n.__) ? wp.i18n.__('Use Image', 'cf7-styler-for-divi') : 'Use Image' }
    });

    frame.on('select', function () {
      var attachment = frame.state().get('selection').first().toJSON();
      if (attachment && attachment.url) {
        srcInput.value = attachment.url;
        var altVal = attachment.alt || attachment.title || '';
        if (altInput) {
          altInput.value = altVal;
        }
        updateImageTagCode(panel);
        updateImagePreview(panel);
      }
    });

    frame.open();
  }

  function updateImageTagCode(panel) {
    var tagInput = panel.querySelector('input.tag.code[name="cf7m-image"]');
    var srcInput = panel.querySelector('input.cf7m-image-src-input, input[name="src"]');
    var altInput = panel.querySelector('input.cf7m-image-alt-input, input[name="alt"]');
    if (!tagInput || !srcInput) return;
    var src = srcInput.value.trim();
    var alt = altInput ? altInput.value.trim() : '';
    if (!src) {
      tagInput.value = '[cf7m-image src:url alt:text]';
      return;
    }
    var altPart = alt ? (alt.indexOf(' ') >= 0 ? ' alt:"' + alt.replace(/"/g, '\\"') + '"' : ' alt:' + alt) : '';
    tagInput.value = '[cf7m-image src:' + src + altPart + ']';
  }

  function updateImagePreview(panel) {
    var srcInput = panel.querySelector('input.cf7m-image-src-input, input[name="src"]');
    var preview = panel.querySelector('.cf7m-image-preview');
    if (!srcInput || !preview) return;
    var src = srcInput.value.trim();
    if (src) {
      preview.src = src;
      preview.alt = '';
      preview.style.display = 'block';
    } else {
      preview.style.display = 'none';
      preview.removeAttribute('src');
    }
  }

  $(document).on('click', '.cf7m-image-upload-trigger', function (e) {
    e.preventDefault();
    var panel = $(this).closest('.cf7m-tag-panel')[0];
    if (panel) {
      openMediaModal(panel);
    }
  });

  $(document).on('input change', '.cf7m-image-src-input, .cf7m-image-alt-input', function () {
    var panel = $(this).closest('.cf7m-tag-panel')[0];
    if (panel) {
      updateImageTagCode(panel);
      updateImagePreview(panel);
    }
  });
})(jQuery);
