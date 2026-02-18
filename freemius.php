<?php

if (!function_exists('cf7m_fs')) {
    function cf7m_fs()
    {
        global $cf7m_fs;

        if (!isset($cf7m_fs)) {
            require_once dirname(__FILE__) . '/vendor/freemius/wordpress-sdk/start.php';

            $cf7m_fs = fs_dynamic_init([
                'id'                  => '23451',
                'slug'                => 'cf7-styler-for-divi',
                'premium_slug'        => 'cf7-mate-pro',
                'type'                => 'plugin',
                'public_key'          => 'pk_eaca5f64718c0442540f2224f745d',
                'is_premium'          => false,
                'has_premium_version' => true,
                'has_addons'          => false,
                'has_paid_plans'      => true,
                'is_org_compliant'    => true,
                'menu' => [
                    'slug'       => 'cf7-mate',
                    'first-path'  => 'admin.php?page=cf7-mate-dashboard',
                    'contact'    => false,
                    'support'    => false,
                    'pricing'    => true,
                    'account'    => true
                ],
                'is_live'          => true,
            ]);
        }

        return $cf7m_fs;
    }

    cf7m_fs();

    // Override i18n strings after init so the textdomain is already loaded (WP 6.7+)
    add_action('init', function () {
        cf7m_fs()->override_i18n([
            'account'    => __('License', 'cf7-styler-for-divi'),
            'contact-us' => __('Help', 'cf7-styler-for-divi'),
        ]);
    }, 0);

    cf7m_fs()->add_filter('after_connect_url', function ($url) {
        return admin_url('admin.php?page=cf7-mate-dashboard');
    }, 10, 1);

    // Set plugin icon
    cf7m_fs()->add_filter('plugin_icon', function () {
        return __DIR__ . '/assets/images/cf7-mate-icon.png';
    });
    // Disable affiliate notice
    cf7m_fs()->add_filter('show_affiliate_program_notice', '__return_false');
    // Disable auto deactivation
    cf7m_fs()->add_filter('deactivate_on_activation', '__return_false');
    // Disable redirect on activation
    cf7m_fs()->add_filter('redirect_on_activation', '__return_false');
    // Custom pricing page branding
    cf7m_fs()->add_filter('pricing/css_path', function () {
        return CF7M_PLUGIN_PATH . 'assets/css/cf7m-pricing.css';
    });

    do_action('cf7m_fs_loaded');
}

function cf7m_can_use_premium()
{
    $pro = defined('CF7M_PLUGIN_PATH') ? CF7M_PLUGIN_PATH . 'includes/pro/loader.php' : '';
    if (!$pro || !file_exists($pro)) {
        return false;
    }
    if (defined('CF7M_DEV_MODE') && CF7M_DEV_MODE) {
        return true;
    }
    return function_exists('cf7m_fs') && cf7m_fs()->can_use_premium_code();
}

function cf7m_is_premium()
{
    return function_exists('cf7m_fs') && cf7m_fs()->is__premium_only();
}
