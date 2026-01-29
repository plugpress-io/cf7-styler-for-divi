<?php

/**
 * Freemius SDK Integration for CF7 Mate for Divi.
 *
 * This file initializes the Freemius SDK for the free plugin.
 * The Pro plugin uses this instance to check license status.
 *
 * @package Divi_CF7_Styler
 * @since 3.0.0
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

            $cf7m_fs = fs_dynamic_init(array(
                'id'                  => '23451',
                'slug'                => 'cf7-styler-for-divi',
                'type'                => 'plugin',
                'public_key'          => 'pk_eaca5f64718c0442540f2224f745d',
                'is_premium'          => false,
                'is_premium_only'     => false,
                'has_addons'          => true,  // Enable add-on support for Pro plugin
                'has_paid_plans'      => true,
                'is_org_compliant'    => true,
                'menu'                => array(
                    'slug'           => 'cf7-mate',
                    'contact'        => false,
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
