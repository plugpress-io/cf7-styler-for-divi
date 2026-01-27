<?php

namespace Divi_CF7_Styler;

if (!defined('ABSPATH')) {
    exit;
}

class Admin
{
    private static $instance;

    public static function get_instance()
    {
        if (!isset(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct()
    {
        // Use late priority to run after Freemius creates its menu
        add_action('admin_menu', [$this, 'add_menu'], 999);
        // Move Freemius menu items under et_divi_options if it exists
        add_action('admin_menu', [$this, 'move_freemius_menu'], 998);
    }

    /**
     * Move Freemius menu items under et_divi_options if parent exists.
     */
    public function move_freemius_menu()
    {
        global $menu, $submenu;
        $parent_slug = 'et_divi_options';
        $menu_slug = 'cf7-styler';

        // Check if parent menu exists
        if (!isset($submenu[$parent_slug])) {
            return;
        }

        // Check if Freemius created a top-level menu
        $freemius_menu_found = false;
        if (isset($menu)) {
            foreach ($menu as $key => $item) {
                if (isset($item[2]) && $item[2] === $menu_slug) {
                    $freemius_menu_found = true;
                    // Move submenu items to parent
                    if (isset($submenu[$menu_slug])) {
                        foreach ($submenu[$menu_slug] as $sub_item) {
                            $submenu[$parent_slug][] = $sub_item;
                        }
                        unset($submenu[$menu_slug]);
                    }
                    // Remove top-level menu
                    unset($menu[$key]);
                    break;
                }
            }
        }
    }

    /**
     * Add or override menu callback.
     */
    public function add_menu()
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        global $submenu;
        $menu_slug = 'cf7-styler';
        $parent_slug = 'et_divi_options';

        // Check if Freemius created the menu under parent
        if (isset($submenu[$parent_slug])) {
            foreach ($submenu[$parent_slug] as $key => $item) {
                if (isset($item[2]) && $item[2] === $menu_slug) {
                    // Replace the callback function
                    $submenu[$parent_slug][$key][1] = [$this, 'render_page'];
                    return;
                }
            }
        }

        // Check if Freemius created top-level menu
        global $menu;
        $top_level_exists = false;
        if (isset($menu)) {
            foreach ($menu as $item) {
                if (isset($item[2]) && $item[2] === $menu_slug) {
                    $top_level_exists = true;
                    break;
                }
            }
        }

        // If menu doesn't exist, create it
        if (!isset($submenu[$parent_slug]) && !$top_level_exists) {
            add_menu_page(
                __('CF7 Styler for Divi', 'cf7-styler-for-divi'),
                __('CF7 Styler', 'cf7-styler-for-divi'),
                'manage_options',
                $menu_slug,
                [$this, 'render_page'],
                'dashicons-email-alt',
                30
            );
        } elseif (isset($submenu[$parent_slug]) && !$top_level_exists) {
            add_submenu_page(
                $parent_slug,
                __('CF7 Styler', 'cf7-styler-for-divi'),
                __('CF7 Styler', 'cf7-styler-for-divi'),
                'manage_options',
                $menu_slug,
                [$this, 'render_page']
            );
        }
    }

    public function render_page()
    {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('Sorry, you are not allowed to access this page.', 'cf7-styler-for-divi'));
        }

        // Check if files exist
        $admin_js = DCS_PLUGIN_PATH . 'dist/js/admin.js';
        $admin_css = DCS_PLUGIN_PATH . 'dist/css/admin.css';

        // If files don't exist, show a message
        if (!file_exists($admin_js)) {
            ?>
            <div class="wrap">
                <h1><?php esc_html_e('CF7 Styler for Divi', 'cf7-styler-for-divi'); ?></h1>
                <div class="notice notice-warning">
                    <p>
                        <?php esc_html_e('Admin dashboard files not found. Please run:', 'cf7-styler-for-divi'); ?>
                        <code>npm run build</code>
                    </p>
                </div>
            </div>
            <?php
            return;
        }

        $js_version = DCS_VERSION;
        $css_version = DCS_VERSION;

        if (file_exists($admin_js)) {
            $js_version .= '.' . filemtime($admin_js);
        }

        if (file_exists($admin_css)) {
            $css_version .= '.' . filemtime($admin_css);
        }

        // Enqueue WordPress scripts that provide React and API
        wp_enqueue_script('wp-element');
        wp_enqueue_script('wp-api-fetch');

        // Enqueue admin script with proper dependencies
        wp_enqueue_script(
            'dcs-admin',
            DCS_PLUGIN_URL . 'dist/js/admin.js',
            array(
                'wp-element',
                'wp-api-fetch',
                'wp-dom-ready',
            ),
            $js_version,
            true
        );

        if (file_exists($admin_css)) {
            wp_enqueue_style(
                'dcs-admin',
                DCS_PLUGIN_URL . 'dist/css/admin.css',
                array(),
                $css_version
            );
        }

        wp_localize_script('dcs-admin', 'dcsCF7Styler', array(
            'root' => esc_url_raw(get_rest_url()),
            'ajax_url' => admin_url('admin-ajax.php'),
            'fs_is_active' => 'true' === DCS_SELF_HOSTED_ACTIVE,
            'fs_account_url' => function_exists('dcs_fs') ? dcs_fs()->get_account_url() : '',
            'nonce' => wp_create_nonce('wp_rest'),
            'pluginUrl' => DCS_PLUGIN_URL,
        ));

        wp_set_script_translations('dcs-admin', 'cf7-styler-for-divi', DCS_PLUGIN_PATH . 'languages');

        echo '<div id="cf7-styler-for-divi-root"></div>';

        do_action('dcs_admin_page_content');
    }
}
