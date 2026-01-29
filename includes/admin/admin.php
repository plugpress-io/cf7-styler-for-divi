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
        add_action('admin_menu', [$this, 'add_menu'], 999);
        add_action('admin_menu', [$this, 'move_freemius_menu'], 998);
    }

    /**
     * Move Freemius menu items under et_divi_options if parent exists.
     */
    public function move_freemius_menu()
    {
        global $menu, $submenu;
        $parent_slug = 'et_divi_options';
        $menu_slug = 'cf7-mate';

        if (!isset($submenu[$parent_slug]) || empty($menu) || !is_array($menu)) {
            return;
        }

        foreach ($menu as $key => $item) {
            if (!isset($item[2]) || $item[2] !== $menu_slug) {
                continue;
            }

            if (isset($submenu[$menu_slug]) && is_array($submenu[$menu_slug])) {
                foreach ($submenu[$menu_slug] as $sub_item) {
                    $submenu[$parent_slug][] = $sub_item;
                }
                unset($submenu[$menu_slug]);
            }

            unset($menu[$key]);
            break;
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

        global $submenu, $menu;
        $menu_slug = 'cf7-mate';
        $parent_slug = 'et_divi_options';

        // If Freemius already created the submenu under Divi, re-register it with our page callback.
        if (isset($submenu[$parent_slug])) {
            foreach ($submenu[$parent_slug] as $key => $item) {
                if (isset($item[2]) && $item[2] === $menu_slug) {
                    $menu_title = isset($item[0]) ? $item[0] : __('CF7 Mate', 'cf7-styler-for-divi');
                    $capability = isset($item[1]) ? $item[1] : 'manage_options';
                    $page_title = isset($item[3]) ? $item[3] : __('CF7 Mate', 'cf7-styler-for-divi');

                    remove_submenu_page($parent_slug, $menu_slug);
                    add_submenu_page(
                        $parent_slug,
                        $page_title,
                        $menu_title,
                        $capability,
                        $menu_slug,
                        [$this, 'render_page']
                    );
                    return;
                }
            }
        }

        $top_level_exists = false;
        if (!empty($menu) && is_array($menu)) {
            foreach ($menu as $item) {
                if (isset($item[2]) && $item[2] === $menu_slug) {
                    $top_level_exists = true;
                    break;
                }
            }
        }

        // If Divi parent doesn't exist, create a top-level menu.
        if (!isset($submenu[$parent_slug]) && !$top_level_exists) {
            add_menu_page(
                __('CF7 Mate for Divi', 'cf7-styler-for-divi'),
                __('CF7 Mate', 'cf7-styler-for-divi'),
                'manage_options',
                $menu_slug,
                [$this, 'render_page'],
                'dashicons-email-alt',
                30
            );
            return;
        }

        // If Divi parent exists (and no top-level menu), add as submenu.
        if (isset($submenu[$parent_slug]) && !$top_level_exists) {
            add_submenu_page(
                $parent_slug,
                __('CF7 Mate', 'cf7-styler-for-divi'),
                __('CF7 Mate', 'cf7-styler-for-divi'),
                'manage_options',
                $menu_slug,
                [$this, 'render_page']
            );
        }
    }

    public function render_page()
    {
        if (!current_user_can('manage_options')) {
            wp_die(__('Sorry, you are not allowed to access this page.', 'cf7-styler-for-divi'));
        }

        // Enqueue scripts here (like divi-instagram-feed) to ensure proper loading order
        wp_enqueue_script(
            'dcs-admin',
            DCS_PLUGIN_URL . 'dist/js/admin.js',
            ['react', 'wp-api', 'wp-i18n', 'wp-element', 'wp-api-fetch', 'wp-dom-ready'],
            DCS_VERSION,
            true
        );

        wp_enqueue_style(
            'dcs-admin',
            DCS_PLUGIN_URL . 'dist/css/admin.css',
            [],
            DCS_VERSION
        );

        wp_localize_script('dcs-admin', 'dcsCF7Styler', [
            'root' => esc_url_raw(get_rest_url()),
            'ajax_url' => admin_url('admin-ajax.php'),
            'fs_is_active' => 'true' === DCS_SELF_HOSTED_ACTIVE,
            'fs_account_url' => function_exists('cf7m_fs') ? cf7m_fs()->get_account_url() : '',
            'nonce' => wp_create_nonce('wp_rest'),
            'pluginUrl' => DCS_PLUGIN_URL,
        ]);

        echo '<div id="cf7-styler-for-divi-root"></div>';
    }
}
