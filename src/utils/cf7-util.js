jQuery(function ($) {
    $(document).ready(function () {
        $('#tag-generator-list a').on('click', function (e) {
            var href = $(this).attr('href'),
                name = tfsGetUrlParam('inlineId', href);

            if (name && name.startsWith('dipe')) {
                $(this).removeClass('thickbox');
                tfsGridInsert(name);
            }

            e.preventDefault();
        });
    });

    function tfsGetUrlParam(param, href) {
        param = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + param + '=([^&#]*)'),
            results = regex.exec(href);
        return results
            ? decodeURIComponent(results[1].replace(/\+/g, ' ')).replace('tag-generator-panel-', '')
            : null;
    }

    function tfsGridInsert(name) {
        var form = $('#wpcf7-form'),
            selection_start = form[0].selectionStart,
            selection_end = form[0].selectionEnd,
            shortcode_start = '[' + name + ']',
            shortcode_end = '[/' + name + ']';

        tfsGridUpdate(selection_start, shortcode_start);
        tfsGridUpdate(selection_end + shortcode_end.length, shortcode_end);
    }

    function tfsGridUpdate(i, t) {
        var form = $('#wpcf7-form'),
            val = form.val(),
            new_val = [val.slice(0, i), t, val.slice(i)].join('');
        form.val(new_val);
    }
});
