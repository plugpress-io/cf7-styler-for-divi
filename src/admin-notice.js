jQuery(document).ready(function ($) {
    'use strict';

    // Handle notice dismissal
    $(document).on('click', '.dcs-admin-notice .notice-dismiss', function (e) {
        e.preventDefault();

        const $notice = $(this).closest('.dcs-admin-notice');
        const noticeId = $notice.attr('id');

        // Determine which action to use based on notice ID
        let action = 'dcs_dismiss_pro_notice';
        if (noticeId === 'dcs_review_notice') {
            action = 'dcs_dismiss_review_notice';
        }

        // Make AJAX request to dismiss notice
        $.ajax({
            url: dcs_admin_notice.ajax_url,
            type: 'POST',
            data: {
                action: action,
                nonce: dcs_admin_notice.nonce,
                notice_id: noticeId,
            },
            success: function (response) {
                if (response.success) {
                    // Fade out the notice
                    $notice.fadeOut(300, function () {
                        $(this).remove();
                    });
                }
            },
            error: function () {
                // If AJAX fails, still remove the notice locally
                $notice.fadeOut(300, function () {
                    $(this).remove();
                });
            },
        });
    });

    // Add smooth animation when notice appears
    $('.dcs-admin-notice').each(function () {
        const $notice = $(this);

        // Add entrance animation
        $notice
            .css({
                opacity: '0',
                transform: 'translateY(-20px)',
            })
            .animate(
                {
                    opacity: '1',
                },
                500
            )
            .css({
                transform: 'translateY(0)',
                transition: 'transform 0.5s ease',
            });
    });

    // Add hover effects for upgrade button
    $('.dcs-upgrade-button').hover(
        function () {
            $(this).addClass('hover');
        },
        function () {
            $(this).removeClass('hover');
        }
    );
});
