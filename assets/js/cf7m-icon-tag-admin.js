/**
 * CF7 Mate – Icon field tag generator: icon browser + image upload.
 *
 * @package CF7_Mate
 * @since 3.0.0
 */
(function ($) {
  'use strict';

  function getPanel(el) {
    return $(el).closest('.cf7m-icon-tag-panel')[0] || $(el).closest('.cf7m-tag-panel')[0];
  }

  function updateIconTagCode(panel) {
    if (!panel) return;
    var tagInput = $(panel).find('input.tag.code[name="cf7m-icon"]')[0];
    var nameInput = $(panel).find('input.cf7m-icon-name-input, input[name="name"]')[0];
    var srcInput = $(panel).find('input.cf7m-icon-src-input, input[name="src"]')[0];
    var sizeInput = $(panel).find('input.cf7m-icon-size-input, input[name="size"]')[0];
    if (!tagInput) return;
    var size = sizeInput && sizeInput.value ? sizeInput.value : '24';
    var src = srcInput && srcInput.value ? srcInput.value.trim() : '';
    var tag;
    if (src) {
      tag = '[cf7m-icon src:' + src + ' size:' + size + ']';
    } else {
      var name = nameInput && nameInput.value ? nameInput.value.trim() : 'dashicons-star-filled';
      if (name.indexOf('dashicons-') !== 0) {
        name = 'dashicons-' + name.replace(/^dashicons-?/, '');
      }
      tag = '[cf7m-icon name:' + name + ' size:' + size + ']';
    }
    tagInput.value = tag;
  }

  function setType(panel, type) {
    var isDashicon = type === 'dashicon';
    $(panel).find('.cf7m-icon-row-dashicon').toggle(isDashicon);
    $(panel).find('.cf7m-icon-row-image').toggle(!isDashicon);
    if (!isDashicon) {
      $(panel).find('input.cf7m-icon-name-input').val('');
    } else {
      $(panel).find('input.cf7m-icon-src-input').val('');
    }
    updateIconTagCode(panel);
  }

  function openMediaModal(panel) {
    var srcInput = $(panel).find('input.cf7m-icon-src-input, input[name="src"]')[0];
    if (!srcInput) return;
    if (typeof wp === 'undefined' || !wp.media) return;

    var frame = wp.media({
      library: { type: 'image' },
      multiple: false,
      title: (wp.i18n && wp.i18n.__) ? wp.i18n.__('Select Image', 'cf7-styler-for-divi') : 'Select Image',
      button: { text: (wp.i18n && wp.i18n.__) ? wp.i18n.__('Use Image', 'cf7-styler-for-divi') : 'Use Image' }
    });

    frame.on('select', function () {
      var attachment = frame.state().get('selection').first().toJSON();
      if (attachment && attachment.url) {
        srcInput.value = attachment.url;
        $(panel).find('input.cf7m-icon-type[value="image"]').prop('checked', true);
        setType(panel, 'image');
      }
    });

    frame.open();
  }

  $(document).on('click', '.cf7m-icon-picker-item', function (e) {
    e.preventDefault();
    var panel = getPanel(this);
    if (!panel) return;
    var name = $(this).data('name');
    if (!name) return;
    $(panel).find('.cf7m-icon-picker-item').removeClass('selected');
    $(this).addClass('selected');
    $(panel).find('input.cf7m-icon-name-input, input[name="name"]').val(name);
    $(panel).find('input.cf7m-icon-src-input').val('');
    $(panel).find('input.cf7m-icon-type[value="dashicon"]').prop('checked', true);
    setType(panel, 'dashicon');
  });

  $(document).on('change', '.cf7m-icon-type', function () {
    var panel = getPanel(this);
    if (!panel) return;
    setType(panel, $(this).val());
  });

  $(document).on('click', '.cf7m-icon-upload-trigger', function (e) {
    e.preventDefault();
    var panel = getPanel(this);
    if (panel) openMediaModal(panel);
  });

  $(document).on('input change', '.cf7m-icon-name-input, .cf7m-icon-src-input, .cf7m-icon-size-input', function () {
    var panel = getPanel(this);
    if (panel) updateIconTagCode(panel);
  });

  $(document).on('click', '#tag-generator-list button', function () {
    setTimeout(function () {
      $('.cf7m-icon-tag-panel .cf7m-icon-picker-item').removeClass('selected');
      var nameInput = $('.cf7m-icon-tag-panel input.cf7m-icon-name-input');
      if (nameInput.length) {
        var name = nameInput.val();
        $('.cf7m-icon-tag-panel .cf7m-icon-picker-item[data-name="' + name + '"]').addClass('selected');
      }
    }, 100);
  });
})(jQuery);
