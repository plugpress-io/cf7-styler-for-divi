<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get Contact Form 7 forms for use in builders (Divi, Elementor, Bricks).
 *
 * @return array<int, string> Map of form ID => form title. Empty first option when no forms.
 */
function cf7m_get_contact_forms()
{
    $options = [];

    if (function_exists('wpcf7')) {
        $args = [
            'post_type'      => 'wpcf7_contact_form',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
        ];
        $contact_forms = get_posts($args);
        if (!empty($contact_forms) && !is_wp_error($contact_forms)) {
            $options[0] = esc_html__('Select a Contact form', 'cf7-styler-for-divi');
            foreach ($contact_forms as $post) {
                $options[(int) $post->ID] = $post->post_title;
            }
        }
    }

    return $options;
}

function dcs_global_assets_list($global_list)
{

	$assets_list   = array();
	$assets_prefix = et_get_dynamic_assets_path();

	$assets_list['et_icons_fa'] = array(
		'css' => "{$assets_prefix}/css/icons_fa_all.css",
	);

	return array_merge($global_list, $assets_list);
}

function dcs_inject_fa_icons($icon_data)
{
	if (function_exists('et_pb_maybe_fa_font_icon') && et_pb_maybe_fa_font_icon($icon_data)) {
		add_filter('et_global_assets_list', 'dcs_global_assets_list');
		add_filter('et_late_global_assets_list', 'dcs_global_assets_list');
	}
}
