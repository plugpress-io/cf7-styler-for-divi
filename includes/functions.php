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


function cf7m_get_pricing_url($coupon = '')
{
    $use_admin_page = false;

    if (function_exists('cf7m_fs')) {
        $fs = cf7m_fs();
        // Freemius registers its menu pages only after the user has completed
        // the opt-in (is_registered) or explicitly opted out (is_anonymous).
        if ($fs->is_registered() || $fs->is_anonymous()) {
            $use_admin_page = true;
        }
    }

    if ($use_admin_page) {
        $url = admin_url('admin.php?page=cf7-mate-pricing');
    } else {
        $url = CF7M_URL_PRICING;
    }

    if ($coupon) {
        $url = add_query_arg('coupon', rawurlencode($coupon), $url);
    }

    return $url;
}

function cf7m_global_assets_list($global_list)
{

    $assets_list   = array();
    $assets_prefix = et_get_dynamic_assets_path();

    $assets_list['et_icons_fa'] = array(
        'css' => "{$assets_prefix}/css/icons_fa_all.css",
    );

    return array_merge($global_list, $assets_list);
}

function cf7m_inject_fa_icons($icon_data)
{
    if (function_exists('et_pb_maybe_fa_font_icon') && et_pb_maybe_fa_font_icon($icon_data)) {
        add_filter('et_global_assets_list', 'cf7m_global_assets_list');
        add_filter('et_late_global_assets_list', 'cf7m_global_assets_list');
    }
}
