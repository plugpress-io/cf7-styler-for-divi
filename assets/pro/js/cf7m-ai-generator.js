/**
 * CF7 Mate – AI Form Generator Modal
 *
 * One-click presets and custom prompt generation.
 *
 * @package CF7_Mate
 * @since   3.0.0
 */
(function($) {
  'use strict';

  var config = window.cf7mAI || {};
  var strings = config.strings || {};
  var presets = config.presets || {};
  var modal = null;

  /**
   * Create the modal HTML – chat-style: prompt box top, presets title-only below.
   */
  function createModal() {
    // Presets as title-only list (click fills prompt, user then clicks Generate).
    var presetsListHtml = '';
    if (Object.keys(presets).length > 0) {
      presetsListHtml = '<div class="cf7m-presets-section">';
      presetsListHtml += '<div class="cf7m-presets-label">' + (strings.presets || 'Quick Presets') + '</div>';
      presetsListHtml += '<div class="cf7m-presets-list">';
      for (var key in presets) {
        if (presets.hasOwnProperty(key)) {
          var preset = presets[key];
          presetsListHtml += '<button type="button" class="cf7m-preset-item" data-preset="' + esc(key) + '" data-prompt="' + esc(preset.prompt) + '">';
          presetsListHtml += esc(preset.name);
          presetsListHtml += '</button>';
        }
      }
      presetsListHtml += '</div></div>';
    }

    var noKey = !config.hasApiKey ? [
      '<div class="cf7m-no-key">',
        '<p>' + (strings.noKey || 'Configure AI provider.') + '</p>',
        '<a href="' + (config.settingsUrl || '#') + '">' + (strings.configure || 'Configure') + '</a>',
      '</div>'
    ].join('') : '';

    var html = [
      '<div class="cf7m-modal-overlay" id="cf7m-modal">',
        '<div class="cf7m-modal cf7m-modal-chat">',
          '<div class="cf7m-modal-header">',
            '<h2 class="cf7m-modal-title">',
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
              (strings.title || 'AI Form Generator'),
              '<span class="cf7m-modal-badge">' + (config.provider || 'AI') + '</span>',
            '</h2>',
            '<button type="button" class="cf7m-modal-close">&times;</button>',
          '</div>',
          '<div class="cf7m-modal-body">',
            noKey,
            '<div class="cf7m-chat-input-area">',
              '<textarea class="cf7m-prompt-input" id="cf7m-prompt" placeholder="Describe the form you want to create, or pick a preset below..."></textarea>',
              '<div class="cf7m-generate-row">',
                '<button type="button" class="cf7m-generate-btn" id="cf7m-generate">',
                  '<span class="btn-text">' + (strings.generate || 'Generate') + '</span>',
                '</button>',
              '</div>',
            '</div>',
            presetsListHtml,
            '<div class="cf7m-error" id="cf7m-error"></div>',
            '<div class="cf7m-result" id="cf7m-result">',
              '<div class="cf7m-result-header">',
                '<span class="cf7m-result-title">Generated Form</span>',
                '<div class="cf7m-result-actions">',
                  '<button type="button" class="cf7m-copy-btn" id="cf7m-copy">' + (strings.copy || 'Copy') + '</button>',
                  '<button type="button" class="cf7m-insert-btn" id="cf7m-insert">' + (strings.insert || 'Insert') + '</button>',
                '</div>',
              '</div>',
              '<div class="cf7m-code-box"><pre id="cf7m-code"></pre></div>',
            '</div>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');

    $('body').append(html);
    modal = $('#cf7m-modal');
    bind();
  }

  /**
   * Bind event handlers.
   */
  function bind() {
    modal.find('.cf7m-modal-close').on('click', close);
    modal.on('click', function(e) {
      if ($(e.target).hasClass('cf7m-modal-overlay')) close();
    });
    $(document).on('keydown.cf7mAI', function(e) {
      if (e.key === 'Escape' && modal.hasClass('open')) close();
    });

    // Preset items – fill prompt only; user clicks Generate.
    modal.find('.cf7m-preset-item').on('click', function() {
      var prompt = $(this).data('prompt');
      if (prompt) {
        $('#cf7m-prompt').val(prompt).focus();
        modal.find('.cf7m-preset-item').removeClass('active');
        $(this).addClass('active');
      }
    });

    // Generate button.
    $('#cf7m-generate').on('click', generate);
    
    // Enter key in textarea.
    $('#cf7m-prompt').on('keydown', function(e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) generate();
    });

    // Copy and insert buttons.
    $('#cf7m-copy').on('click', copy);
    $('#cf7m-insert').on('click', insert);
  }

  /**
   * Open modal.
   */
  function open() {
    if (!modal) createModal();
    modal.addClass('open');
    setTimeout(function() { $('#cf7m-prompt').focus(); }, 50);
  }

  /**
   * Close modal.
   */
  function close() {
    if (modal) modal.removeClass('open');
  }

  /**
   * Generate form.
   */
  function generate() {
    var prompt = $('#cf7m-prompt').val().trim();
    if (!prompt) {
      showError('Please describe the form or select a preset.');
      return;
    }

    var btn = $('#cf7m-generate');
    var txt = btn.html();
    btn.prop('disabled', true).html('<span class="spinner"></span> ' + (strings.generating || 'Generating...'));
    
    modal.find('.cf7m-preset-item').prop('disabled', true);
    
    hideError();
    $('#cf7m-result').removeClass('show');

    $.ajax({
      url: config.generateUrl,
      method: 'POST',
      headers: { 'X-WP-Nonce': config.nonce },
      contentType: 'application/json',
      data: JSON.stringify({ prompt: prompt }),
      success: function(r) {
        if (r.success && r.form) {
          $('#cf7m-code').text(r.form);
          $('#cf7m-result').addClass('show');
          // Scroll to result.
          modal.find('.cf7m-modal-body').animate({
            scrollTop: modal.find('.cf7m-result').position().top
          }, 300);
        } else {
          showError(r.message || strings.error);
        }
      },
      error: function(xhr) {
        showError(xhr.responseJSON?.message || strings.error);
      },
      complete: function() {
        btn.prop('disabled', false).html(txt);
        modal.find('.cf7m-preset-item').prop('disabled', false);
      }
    });
  }

  /**
   * Copy to clipboard.
   */
  function copy() {
    var code = $('#cf7m-code').text();
    navigator.clipboard.writeText(code).then(function() {
      var btn = $('#cf7m-copy');
      var txt = btn.text();
      btn.text(strings.copied || 'Copied!');
      setTimeout(function() { btn.text(txt); }, 1500);
    });
  }

  /**
   * Insert into CF7 editor.
   */
  function insert() {
    var code = $('#cf7m-code').text();
    var ta = $('#wpcf7-form');
    if (ta.length) {
      ta.val(code).trigger('change');
      close();
      $('html, body').animate({ scrollTop: ta.offset().top - 80 }, 200);
    } else {
      showError('Form editor not found.');
    }
  }

  /**
   * Show error message.
   */
  function showError(msg) {
    $('#cf7m-error').text(msg).addClass('show');
  }

  /**
   * Hide error message.
   */
  function hideError() {
    $('#cf7m-error').removeClass('show');
  }

  /**
   * Escape HTML.
   */
  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  // Initialize.
  $(document).ready(function() {
    $(document).on('click', '#cf7m-ai-btn', function(e) {
      e.preventDefault();
      open();
    });
  });
})(jQuery);
