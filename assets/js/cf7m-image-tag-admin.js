/**
 * CF7 Mate – Image field tag generator: open WordPress media modal and fill URL/alt.
 *
 * @package CF7_Mate
 * @since 3.0.0
 */
(function ($) {
  'use strict';

  function openMediaModal(panel) {
    var srcInput    = panel.querySelector('input.cf7m-image-src-input, input[name="src"]');
    var altInput    = panel.querySelector('input.cf7m-image-alt-input, input[name="alt"]');
    var widthInput  = panel.querySelector('input[name="width"]');
    var heightInput = panel.querySelector('input[name="height"]');
    if (!srcInput) return;

    if (typeof wp === 'undefined' || !wp.media) {
      return;
    }

    var frame = wp.media({
      library: { type: 'image' },
      multiple: false,
      title:  (wp.i18n && wp.i18n.__) ? wp.i18n.__('Select Image', 'cf7-styler-for-divi') : 'Select Image',
      button: { text: (wp.i18n && wp.i18n.__) ? wp.i18n.__('Use Image', 'cf7-styler-for-divi') : 'Use Image' }
    });

    // Raise the media modal above the CF7 tag generator dialog.
    frame.on('open', function () {
      $('.media-modal').css('z-index', '999999');
      $('.media-modal-backdrop').css('z-index', '999998');
    });

    frame.on('select', function () {
      var attachment = frame.state().get('selection').first().toJSON();
      if (!attachment || !attachment.url) return;

      srcInput.value = attachment.url;

      if (altInput) {
        altInput.value = attachment.alt || attachment.title || '';
      }

      // Auto-populate dimensions from the selected attachment.
      if (widthInput  && attachment.width)  { widthInput.value  = attachment.width; }
      if (heightInput && attachment.height) { heightInput.value = attachment.height; }

      updateImageTagCode(panel);
      updateImagePreview(panel);
    });

    frame.open();
  }

  function updateImageTagCode(panel) {
    var tagInput    = panel.querySelector('input.tag.code[name="cf7m-image"]');
    var srcInput    = panel.querySelector('input.cf7m-image-src-input, input[name="src"]');
    var altInput    = panel.querySelector('input.cf7m-image-alt-input, input[name="alt"]');
    var widthInput  = panel.querySelector('input[name="width"]');
    var heightInput = panel.querySelector('input[name="height"]');
    if (!tagInput || !srcInput) return;

    var src    = srcInput.value.trim();
    var alt    = altInput    ? altInput.value.trim()           : '';
    var width  = widthInput  ? parseInt(widthInput.value,  10) : 0;
    var height = heightInput ? parseInt(heightInput.value, 10) : 0;

    if (!src) {
      tagInput.value = '[cf7m-image src:url alt:text]';
      return;
    }

    var tag = '[cf7m-image src:' + src;

    if (alt) {
      tag += alt.indexOf(' ') >= 0
        ? ' alt:"' + alt.replace(/"/g, '\\"') + '"'
        : ' alt:' + alt;
    }

    if (width  > 0) { tag += ' width:'  + width;  }
    if (height > 0) { tag += ' height:' + height; }

    tag += ']';
    tagInput.value = tag;
  }

  function updateImagePreview(panel) {
    var srcInput = panel.querySelector('input.cf7m-image-src-input, input[name="src"]');
    var preview  = panel.querySelector('.cf7m-image-preview');
    if (!srcInput || !preview) return;
    var src = srcInput.value.trim();
    if (src) {
      preview.src           = src;
      preview.alt           = '';
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

  // Update tag code whenever any relevant field changes.
  $(document).on(
    'input change',
    '.cf7m-image-src-input, .cf7m-image-alt-input, .cf7m-image-tag-panel input[name="width"], .cf7m-image-tag-panel input[name="height"]',
    function () {
      var panel = $(this).closest('.cf7m-tag-panel')[0];
      if (panel) {
        updateImageTagCode(panel);
        updateImagePreview(panel);
      }
    }
  );
})(jQuery);
