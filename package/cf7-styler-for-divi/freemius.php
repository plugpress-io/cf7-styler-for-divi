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
                'is_premium'          => true,
                'is_premium_only'     => false,
                'has_addons'          => false,
                'has_premium_version' => true,
                'has_paid_plans'      => true,
                'is_org_compliant'    => false,
                'menu'                => [
                    'slug'    => 'cf7-mate',
                    'first-path' => 'admin.php?page=cf7-mate-dashboard',
                    'contact'    => false,
                    'support'    => false,
                    'pricing'    => true,
                    'account'    => true
                ],
            ]);
        }

        return $cf7m_fs;
    }

    cf7m_fs();

    cf7m_fs()->add_filter('after_connect_url', function ($url) {
        return admin_url('admin.php?page=cf7-mate-dashboard');
    }, 10, 1);

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
