/**
 * Contact Form 7 Grid Layout Utility
 * Handles grid layout shortcode insertion in the CF7 form editor
 *
 * @see /includes/cf7-grid-helper.php - For grid shortcode definitions and rendering
 * @see /includes/tag.php - For tag generator registration
 * @since 2.2.0
 */
jQuery(function ($) {
    /**
     * List of grid layout shortcode types that should not use thickbox
     * These correspond to the shortcodes registered in CF7_Grid_Helper class
     */
    const gridShortcodeTypes = [
        'dipe_row', // Full width row container
        'dipe_one', // Single column (12/12)
        'dipe_one_half', // Half width column (6/12)
        'dipe_one_third', // One third width column (4/12)
        'dipe_one_fourth', // One fourth width column (3/12)
        'dipe_two_third', // Two thirds width column (8/12)
        'dipe_three_fourth', // Three fourths width column (9/12)
    ];

    gridShortcodeTypes.forEach((shortcodeType) => {
        $(
            `#tag-generator-list button[data-target="tag-generator-panel-${shortcodeType}"]`
        ).removeClass('tag-generator-dialog');
    });

    /**
     * Handle click on tag generator buttons
     */
    $('#tag-generator-list button').on('click', function (e) {
        e.preventDefault();
        const target = $(this).data('target');
        const shortcodeType = extractShortcodeType('target', target);

        // Only handle grid layout shortcodes
        if (shortcodeType.startsWith('dipe')) {
            insertGridLayoutShortcode(shortcodeType);
        }
    });

    /**
     * Extracts shortcode type from target attribute
     */
    function extractShortcodeType(paramName, target) {
        if (!target) {
            return '';
        }
        return target.replace('tag-generator-panel-', '');
    }

    /**
     * Inserts grid layout shortcode at cursor position in form editor
     * Wraps any selected text with the grid shortcode tags
     *
     * @param {string} shortcodeType - Type of grid shortcode to insert
     * @see CF7_Grid_Helper::render_shortcode() - For shortcode rendering
     */
    function insertGridLayoutShortcode(shortcodeType) {
        const $formEditor = $('#wpcf7-form');
        const formElement = $formEditor[0];
        const shortcodeOpen = `[${shortcodeType}]`;
        const shortcodeClose = `[/${shortcodeType}]`;

        const cursorStart = formElement.selectionStart;
        const cursorEnd = formElement.selectionEnd;
        const currentContent = $formEditor.val();

        // Build new content with shortcode wrapping selected text
        const updatedContent =
            currentContent.slice(0, cursorStart) +
            shortcodeOpen +
            currentContent.slice(cursorStart, cursorEnd) +
            shortcodeClose +
            currentContent.slice(cursorEnd);

        $formEditor.val(updatedContent);
    }
});
