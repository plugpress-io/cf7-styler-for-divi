/**
 * CF7 Mate – AI Form Generator Modal
 *
 * One-click presets, drag-drop image upload, editable result, regenerate.
 *
 * @package CF7_Mate
 * @since   3.0.0
 */
(function ($) {
  'use strict';

  var config = window.cf7mAI || {};
  var strings = config.strings || {};
  var presets = config.presets || {};
  var categoryLabels = config.categoryLabels || {};
  var modal = null;

  // ───── Helpers ─────────────────────────────────────────────────────
  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : s;
    return d.innerHTML;
  }
  function escAttr(s) {
    return esc(s).replace(/"/g, '&quot;');
  }

  function buildPresetGroups() {
    // Group by category, preserve original order within each group.
    var order = ['lead-contact', 'booking', 'application', 'calculators'];
    var groups = {};
    Object.keys(presets).forEach(function (key) {
      var p = presets[key] || {};
      var cat = p.category || 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({ key: key, preset: p });
    });

    var html = '';
    order.concat(Object.keys(groups).filter(function (c) {
      return order.indexOf(c) === -1;
    })).forEach(function (cat) {
      if (!groups[cat] || !groups[cat].length) return;
      var label = categoryLabels[cat] || cat;
      html += '<div class="cf7m-ai__preset-group" data-category="' + esc(cat) + '">';
      html += '<div class="cf7m-ai__group-title">' + esc(label) + '</div>';
      html += '<div class="cf7m-ai__preset-row">';
      groups[cat].forEach(function (item) {
        html += '<button type="button" class="cf7m-preset-item" '
          + 'data-preset="' + esc(item.key) + '" '
          + 'data-prompt="' + escAttr(item.preset.prompt) + '" '
          + 'title="' + escAttr(item.preset.description || '') + '">'
          + esc(item.preset.name)
          + '</button>';
      });
      html += '</div></div>';
    });
    return html;
  }

  // ───── Modal markup ────────────────────────────────────────────────
  function createModal() {
    var presetsHtml = '';
    if (Object.keys(presets).length > 0) {
      presetsHtml = '<div class="cf7m-presets-section">'
        + '<div class="cf7m-presets-label">' + esc(strings.presets || 'Quick presets') + '</div>'
        + buildPresetGroups()
        + '</div>';
    }

    var providerRow = ''
      + '<div class="cf7m-ai__provider-row">'
        + '<span class="cf7m-ai__provider-name">' + esc(config.provider || 'AI') + '</span>'
        + (config.model ? '<span class="cf7m-ai__provider-sep" aria-hidden="true">·</span>'
          + '<span class="cf7m-ai__provider-model">' + esc(config.model) + '</span>' : '')
        + '<a href="' + esc(config.dashUrl || config.settingsUrl || '#')
        + '" target="_blank" rel="noopener" class="cf7m-ai__provider-change">'
        + esc(strings.change || 'Change')
        + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">'
        + '<path d="M7 17L17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        + '</a>'
      + '</div>';

    var noKey = !config.hasApiKey ? [
      '<div class="cf7m-no-key">',
        '<p>' + esc(strings.noKey || 'Configure AI provider.') + '</p>',
        '<a href="' + esc(config.settingsUrl || '#') + '">' + esc(strings.configure || 'Configure') + '</a>',
      '</div>'
    ].join('') : '';

    var html = [
      '<div class="cf7m-modal-overlay" id="cf7m-modal">',
        '<div class="cf7m-modal cf7m-modal-chat">',
          '<div class="cf7m-modal-header">',
            '<h2 class="cf7m-modal-title">',
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
              esc(strings.title || 'AI Form Generator'),
            '</h2>',
            providerRow,
            '<button type="button" class="cf7m-modal-close" aria-label="Close">&times;</button>',
          '</div>',
          '<div class="cf7m-modal-body">',
            noKey,
            '<div class="cf7m-chat-input-area">',
              '<textarea class="cf7m-prompt-input" id="cf7m-prompt" placeholder="' + escAttr(strings.placeholder || 'Describe the form…') + '"></textarea>',
              '<div class="cf7m-ai__dropzone" id="cf7m-dropzone">',
                '<input type="file" class="cf7m-image-input" id="cf7m-image" accept="image/jpeg,image/png,image/gif,image/webp" hidden>',
                '<span class="cf7m-ai__dropzone-empty" id="cf7m-dropzone-empty">',
                  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">',
                    '<path d="M4 16l4-4 4 4 4-4 4 4M14 8a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"/>',
                    '<rect x="3" y="3" width="18" height="18" rx="2" stroke-linecap="round" stroke-linejoin="round"/>',
                  '</svg>',
                  '<span>' + esc(strings.dropImage || 'Drop an image, or click to upload') + '</span>',
                '</span>',
                '<div class="cf7m-ai__dropzone-preview" id="cf7m-image-preview"></div>',
                '<button type="button" class="cf7m-image-clear" id="cf7m-image-clear" hidden aria-label="' + escAttr(strings.removeImage || 'Remove image') + '">&times;</button>',
              '</div>',
              '<div class="cf7m-error" id="cf7m-error" role="alert"></div>',
              '<div class="cf7m-generate-row">',
                '<span class="cf7m-ai__shortcut">' + esc(strings.shortcut || '') + '</span>',
                '<button type="button" class="cf7m-generate-btn" id="cf7m-generate">',
                  '<span class="btn-text">' + esc(strings.generate || 'Generate') + '</span>',
                '</button>',
              '</div>',
            '</div>',
            presetsHtml,
            '<div class="cf7m-result" id="cf7m-result">',
              '<div class="cf7m-result-header">',
                '<span class="cf7m-result-title">Generated Form</span>',
                '<div class="cf7m-result-actions">',
                  '<button type="button" class="cf7m-regen-btn" id="cf7m-regen">' + esc(strings.regenerate || 'Regenerate') + '</button>',
                  '<button type="button" class="cf7m-copy-btn" id="cf7m-copy">' + esc(strings.copy || 'Copy') + '</button>',
                  '<button type="button" class="cf7m-insert-btn" id="cf7m-insert">' + esc(strings.insert || 'Insert') + '</button>',
                '</div>',
              '</div>',
              '<div class="cf7m-code-box"><textarea id="cf7m-code" spellcheck="false"></textarea></div>',
            '</div>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');

    $('body').append(html);
    modal = $('#cf7m-modal');
    bind();
  }

  // ───── Bindings ────────────────────────────────────────────────────
  function bind() {
    modal.find('.cf7m-modal-close').on('click', close);
    modal.on('click', function (e) {
      if ($(e.target).hasClass('cf7m-modal-overlay')) close();
    });
    $(document).on('keydown.cf7mAI', function (e) {
      if (e.key === 'Escape' && modal.hasClass('open')) close();
    });

    // One-click preset → fill prompt + generate.
    modal.on('click', '.cf7m-preset-item', function () {
      var prompt = $(this).data('prompt');
      if (!prompt) return;
      $('#cf7m-prompt').val(prompt);
      modal.find('.cf7m-preset-item').removeClass('active');
      $(this).addClass('active');
      generate();
    });

    // Generate / Regenerate buttons.
    $('#cf7m-generate').on('click', generate);
    $('#cf7m-regen').on('click', generate);

    // Cmd / Ctrl + Enter.
    $('#cf7m-prompt, #cf7m-code').on('keydown', function (e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) generate();
    });

    // Track edits to result so Insert label flips.
    $('#cf7m-code').on('input', function () {
      $('#cf7m-insert').text(strings.insertEdited || 'Insert edited form');
    });

    $('#cf7m-copy').on('click', copy);
    $('#cf7m-insert').on('click', insert);

    // Image upload + drag/drop.
    var $dz = $('#cf7m-dropzone');
    var $input = $('#cf7m-image');

    $dz.on('click', function (e) {
      // Don't reopen file picker when clicking the clear button.
      if ($(e.target).closest('#cf7m-image-clear').length) return;
      $input.trigger('click');
    });

    $input.on('change', function () {
      if (this.files && this.files[0]) showImagePreview(this.files[0]);
    });

    $dz.on('dragover', function (e) {
      e.preventDefault();
      $dz.addClass('is-dragover');
    });
    $dz.on('dragleave dragend drop', function () {
      $dz.removeClass('is-dragover');
    });
    $dz.on('drop', function (e) {
      e.preventDefault();
      var dt = e.originalEvent.dataTransfer;
      if (dt && dt.files && dt.files[0]) {
        $input[0].files = dt.files;
        showImagePreview(dt.files[0]);
      }
    });

    $('#cf7m-image-clear').on('click', function (e) {
      e.stopPropagation();
      clearImage();
    });
  }

  function showImagePreview(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#cf7m-image-preview').html(
        '<img src="' + e.target.result + '" alt="" class="cf7m-image-thumb">'
      );
      $('#cf7m-dropzone').addClass('has-image');
      $('#cf7m-image-clear').removeAttr('hidden');
    };
    reader.readAsDataURL(file);
  }

  function clearImage() {
    $('#cf7m-image').val('');
    $('#cf7m-image-preview').empty();
    $('#cf7m-dropzone').removeClass('has-image');
    $('#cf7m-image-clear').attr('hidden', true);
  }

  // ───── Open / Close ────────────────────────────────────────────────
  function open() {
    if (!modal) createModal();
    modal.addClass('open');
    setTimeout(function () { $('#cf7m-prompt').focus(); }, 50);
  }

  function close() {
    if (modal) modal.removeClass('open');
  }

  // ───── Generate ────────────────────────────────────────────────────
  function generate() {
    var prompt = $('#cf7m-prompt').val().trim();
    var imageInput = document.getElementById('cf7m-image');
    var hasImage = imageInput && imageInput.files && imageInput.files[0];

    if (!prompt && !hasImage) {
      showError(strings.emptyError || 'Please describe the form, pick a preset, or upload an image.');
      return;
    }

    var $genBtn = $('#cf7m-generate');
    var $regenBtn = $('#cf7m-regen');
    var origGenHtml = $genBtn.html();
    var origRegenText = $regenBtn.text();
    var loadingHtml = '<span class="spinner"></span> ' + esc(strings.generating || 'Generating…');

    $genBtn.prop('disabled', true).html(loadingHtml);
    $regenBtn.prop('disabled', true).html(loadingHtml);
    modal.find('.cf7m-preset-item').prop('disabled', true);
    hideError();

    function done() {
      $genBtn.prop('disabled', false).html(origGenHtml);
      $regenBtn.prop('disabled', false).text(origRegenText);
      modal.find('.cf7m-preset-item').prop('disabled', false);
    }

    function doRequest(payload) {
      $.ajax({
        url: config.generateUrl,
        method: 'POST',
        headers: { 'X-WP-Nonce': config.nonce },
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (r) {
          if (r.success && r.form) {
            $('#cf7m-code').val(r.form);
            $('#cf7m-insert').text(strings.insert || 'Insert');
            $('#cf7m-result').addClass('show');
            modal.find('.cf7m-modal-body').animate({
              scrollTop: modal.find('.cf7m-result').position().top
            }, 300);
          } else {
            showError(r.message || strings.error);
          }
        },
        error: function (xhr) {
          showError((xhr.responseJSON && xhr.responseJSON.message) || strings.error);
        },
        complete: done
      });
    }

    if (hasImage) {
      var file = imageInput.files[0];
      var reader = new FileReader();
      reader.onload = function () {
        var base64 = reader.result.split(',')[1];
        var mediaType = file.type || 'image/jpeg';
        var textPrompt = prompt || 'Convert this form design or screenshot into valid Contact Form 7 form code. Output only the form code.';
        doRequest({ prompt: textPrompt, image: base64, image_type: mediaType });
      };
      reader.readAsDataURL(file);
    } else {
      doRequest({ prompt: prompt });
    }
  }

  // ───── Result actions ──────────────────────────────────────────────
  function copy() {
    var code = $('#cf7m-code').val();
    if (!code) return;
    navigator.clipboard.writeText(code).then(function () {
      var $btn = $('#cf7m-copy');
      var orig = $btn.text();
      $btn.text(strings.copied || 'Copied!');
      setTimeout(function () { $btn.text(orig); }, 1500);
    });
  }

  function insert() {
    var code = $('#cf7m-code').val();
    var ta = $('#wpcf7-form');
    if (ta.length) {
      ta.val(code).trigger('change');
      close();
      $('html, body').animate({ scrollTop: ta.offset().top - 80 }, 200);
    } else {
      showError(strings.noEditor || 'Form editor not found.');
    }
  }

  function showError(msg) {
    $('#cf7m-error').text(msg).addClass('show');
  }
  function hideError() {
    $('#cf7m-error').removeClass('show').text('');
  }

  // ───── Init ────────────────────────────────────────────────────────
  $(document).ready(function () {
    $(document).on('click', '#cf7m-ai-btn', function (e) {
      e.preventDefault();
      open();
    });
  });
})(jQuery);
