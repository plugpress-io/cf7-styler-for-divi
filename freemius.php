<?php

if (! function_exists('dcs_fs')) {
    // Create a helper function for easy SDK access.
    function dcs_fs()
    {
        global $dcs_fs;

        if (! isset($dcs_fs)) {
            // Include Freemius SDK.
            require_once dirname(__FILE__) . '/vendor/freemius/wordpress-sdk/start.php';

            $dcs_fs = fs_dynamic_init(array(
                'id'                  => '6220',
                'slug'                => 'cf7-styler-for-divi',
                'type'                => 'plugin',
                'public_key'          => 'pk_5ed03b8670d0cfbf345aa03dc6c80',
                'is_premium'          => false,
                'is_premium_only'     => false,
                'has_addons'          => false,
                'has_paid_plans'      => true,
                'is_org_compliant'    => true,
                'menu'                => array(
                    'slug'           => 'cf7-styler',
                    'contact'        => false,
                    'support'        => false,
                    'pricing'        => true,
                    // Removed parent menu - Freemius will create top-level menu
                    // Custom admin page is handled in includes/admin.php under et_divi_options
                ),
            ));
        }

        return $dcs_fs;
    }

    // Init Freemius.
    dcs_fs();
    // Signal that SDK was initiated.
    do_action('dcs_fs_loaded');
}
