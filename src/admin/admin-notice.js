jQuery(document).ready(function ($) {
	'use strict';

	$(document).on('click', '.cf7m-admin-notice .notice-dismiss', function (e) {
		e.preventDefault();

		const $notice = $(this).closest('.cf7m-admin-notice');
		const noticeId = $notice.attr('id');

		let action = 'dcs_dismiss_pro_notice';
		if (noticeId === 'dcs_review_notice') {
			action = 'dcs_dismiss_review_notice';
		}

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
					$notice.fadeOut(300, function () {
						$(this).remove();
					});
				}
			},
			error: function () {
				$notice.fadeOut(300, function () {
					$(this).remove();
				});
			},
		});
	});

	$('.cf7m-admin-notice').each(function () {
		const $notice = $(this);
		$notice
			.css({ opacity: '0', transform: 'translateY(-20px)' })
			.animate({ opacity: '1' }, 500)
			.css({ transform: 'translateY(0)', transition: 'transform 0.5s ease' });
	});

	$('.cf7m-upgrade-button').hover(
		function () {
			$(this).addClass('hover');
		},
		function () {
			$(this).removeClass('hover');
		}
	);
});
