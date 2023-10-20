jQuery(function ($) {
    // Cached selectors for performance
    const $cf7StylerFormPage = $('.dipe-cf7-styler-form-page');
    const $cf7StylerAnchors = $('.dipe-cf7-styler a');

    function setActiveTabFromStorageOrDefault() {
        let activetab = localStorage.getItem('activetab') || '';

        if (window.location.hash) {
            activetab = window.location.hash;
            localStorage.setItem('activetab', activetab);
        }

        if (activetab && $(activetab).length) {
            $(activetab).fadeIn();
            $(activetab + '-tab').addClass('nav-tab-active');
        } else {
            $cf7StylerFormPage.first().fadeIn();
            $cf7StylerAnchors.first().addClass('nav-tab-active');
        }
    }

    function handleAnchorClicks(evt) {
        $cf7StylerAnchors.removeClass('nav-tab-active');
        const $this = $(this);
        $this.addClass('nav-tab-active').blur();

        const clickedGroup = $this.attr('href');
        localStorage.setItem('activetab', clickedGroup);
        $cf7StylerFormPage.hide();
        $(clickedGroup).fadeIn();

        evt.preventDefault();
    }

    function getUrlParam(pram, href) {
        const regex = new RegExp('[\\?&]' + pram + '=([^&#]*)');
        const results = regex.exec(href);
        return results ? decodeURIComponent(results[1].replace(/\+/g, ' ')).replace('tag-generator-panel-', '') : '';
    }

    function gridInsert(name) {
        const form = document.getElementById('wpcf7-form');
        const shortcode = `[${name}]`;
        gridUpdate(form.selectionStart, shortcode);
        gridUpdate(form.selectionEnd + shortcode.length, `[/ ${name}]`);
    }

    function gridUpdate(i, text) {
        const $form = $('#wpcf7-form');
        const val = $form.val();
        $form.val(val.slice(0, i) + text + val.slice(i));
    }

    function handleAjaxNoticeDismiss(event) {
        event.preventDefault();
        const $this = $(this);
        const attrValue = $this.parent().attr('data-dismissible').split('-');
        const dismissibleLength = attrValue.pop();
        const optionName = attrValue.join('-');
        $.post(ajaxurl, {
            action: 'dismiss_admin_notice',
            option_name: optionName,
            dismissible_length: dismissibleLength,
            nonce: dismissible_notice.nonce,
        });
    }

    setActiveTabFromStorageOrDefault();
    $cf7StylerAnchors.click(handleAnchorClicks);

    $('#tag-generator-list a').on('click', function (e) {
        e.preventDefault();
        const name = getUrlParam('inlineId', $(this).attr('href'));
        if (name.startsWith('dipe')) {
            gridInsert(name);
        }
    });

    $('div[data-dismissible] .notice-dismiss').click(handleAjaxNoticeDismiss);
});
