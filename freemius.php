<?php

/**
 * Freemius SDK Integration for CF7 Mate for Divi.
 *
 * Official Freemius Model: Single codebase with Free + Premium versions.
 * - Free version: Auto-stripped premium code, deployed to WordPress.org
 * - Premium version: Full code, deployed via Freemius
 *
 * Premium code is wrapped with:
 * - if (cf7m_fs()->is__premium_only()) { ... } - auto-stripped from free version
 * - if (cf7m_fs()->can_use_premium_code()) { ... } - runtime license check
 * - Files/folders with __premium_only suffix - auto-excluded from free version
 *
 * @package CF7_Mate
 * @since 3.0.0
 * @see https://freemius.com/help/documentation/wordpress-sdk/software-licensing/
 */

if (!function_exists('cf7m_fs')) {
    /**
     * Create a helper function for easy SDK access.
     *
     * @return \Freemius
     */
    function cf7m_fs()
    {
        global $cf7m_fs;

        if (!isset($cf7m_fs)) {
            // Include Freemius SDK.
            require_once dirname(__FILE__) . '/vendor/freemius/wordpress-sdk/start.php';

            // Slug cf7-styler-for-divi + main file cf7-styler.php required for WordPress.org.
            // Premium zip (cf7-mate-pro) built via Grunt package:pro; main file cf7-mate-pro.php.
            // first-path = dashboard; pricing page = admin.php?page=cf7-mate-pricing
            $cf7m_fs = fs_dynamic_init(array(
                'id'                  => '23451',
                'slug'                => 'cf7-styler-for-divi',
                'premium_slug'        => 'cf7-mate-pro',
                'type'                => 'plugin',
                'public_key'          => 'pk_eaca5f64718c0442540f2224f745d',
                'is_premium'          => false,
                'is_premium_only'     => false,
                'has_premium_version' => true,
                'has_addons'          => true,
                'has_paid_plans'      => true,
                'is_org_compliant'    => true,
                'menu'                => array(
                    'slug'           => 'cf7-mate',
                    'first-path'     => 'admin.php?page=cf7-mate-dashboard',
                    'contact'        => true,
                    'support'        => false,
                    'pricing'        => true,
                    'account'        => true,
                ),
            ));
        }

        return $cf7m_fs;
    }

    // Init Freemius.
    cf7m_fs();
    // Signal that SDK was initiated.
    do_action('cf7m_fs_loaded');
}

/**
 * Whether to treat the site as having premium access for local/testing.
 * Automatically enabled when WP_DEBUG is true and pro files exist.
 * Can also be explicitly set: define( 'CF7M_DEV_PRO_TEST', true );
 *
 * @since 3.0.0
 * @return bool
 */
function cf7m_dev_can_use_premium()
{
    // Explicit constant takes precedence
    if (defined('CF7M_DEV_PRO_TEST')) {
        return CF7M_DEV_PRO_TEST;
    }

    // Auto-enable in WP_DEBUG mode when pro files exist (for local development)
    if (defined('WP_DEBUG') && WP_DEBUG) {
        $pro_loader = CF7M_PLUGIN_PATH . 'includes/pro/loader.php';
        if (file_exists($pro_loader)) {
            return true;
        }
    }

    return false;
}

/**
 * Helper function to check if premium code can be used.
 * True when: valid license/trial OR dev bypass (CF7M_DEV_PRO_TEST) for local testing.
 *
 * @since 3.0.0
 * @return bool True if user has valid license, trial, or dev test flag.
 */
function cf7m_can_use_premium()
{
    if (cf7m_dev_can_use_premium()) {
        return true;
    }
    if (!function_exists('cf7m_fs')) {
        return false;
    }
    return cf7m_fs()->can_use_premium_code();
}

/**
 * Helper function to check if running premium version.
 * Used for code that should only exist in premium version.
 *
 * @since 3.0.0
 * @return bool True if running premium version code.
 */
function cf7m_is_premium()
{
    if (!function_exists('cf7m_fs')) {
        return false;
    }
    return cf7m_fs()->is__premium_only();
}
