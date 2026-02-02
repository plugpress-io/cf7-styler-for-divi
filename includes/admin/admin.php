<?php

namespace CF7_Mate;

if (!defined('ABSPATH')) {
    exit;
}

class Admin
{
    private static $instance;

    /** Our page slug – dashboard style. */
    const PAGE_SLUG = 'cf7-mate-dashboard';

    /** Features page slug – registered so URL works; not shown under Divi (reachable via in-app nav or direct URL). */
    const FEATURES_PAGE_SLUG = 'cf7-mate-features';

    public static function get_instance()
    {
        if (!isset(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct()
    {
        add_action('admin_menu', [$this, 'add_menu'], 20);
        add_action('admin_init', [$this, 'redirect_cf7_mate_to_settings'], 5);
    }

    /**
     * Redirect page=cf7-mate to our dashboard (cf7-mate-dashboard).
     */
    public function redirect_cf7_mate_to_settings()
    {
        $page = isset($_GET['page']) ? sanitize_text_field(wp_unslash($_GET['page'])) : '';
        if ($page !== 'cf7-mate' || !current_user_can('manage_options')) {
            return;
        }
        wp_safe_redirect(admin_url('admin.php?page=' . self::PAGE_SLUG));
        exit;
    }

    /**
     * Add "CF7 Mate" under Divi when Divi theme/Builder is present; if no Divi found, add as toplevel menu so dashboard is always accessible.
     */
    public function add_menu()
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        $divi_found = defined('ET_BUILDER_VERSION') || defined('ET_CORE_VERSION');

        if ($divi_found) {
            add_submenu_page(
                'et_divi_options',
                __('CF7 Mate', 'cf7-styler-for-divi'),
                __('CF7 Mate', 'cf7-styler-for-divi'),
                'manage_options',
                self::PAGE_SLUG,
                [$this, 'render_page']
            );
        } else {
            // No Divi theme/Builder found: show CF7 Mate as toplevel menu (e.g. Pro-only install, or Divi not active).
            add_menu_page(
                __('CF7 Mate', 'cf7-styler-for-divi'),
                __('CF7 Mate', 'cf7-styler-for-divi'),
                'manage_options',
                self::PAGE_SLUG,
                [$this, 'render_page'],
                'dashicons-email-alt',
                59
            );
        }

        // Register Features page as submenu of dashboard so admin.php?page=cf7-mate-features works.
        add_submenu_page(
            self::PAGE_SLUG,
            __('Features', 'cf7-styler-for-divi'),
            __('Features', 'cf7-styler-for-divi'),
            'manage_options',
            self::FEATURES_PAGE_SLUG,
            [$this, 'render_features_page']
        );
    }

    public function render_page()
    {
        $this->render_app_root([]);
    }

    /**
     * Render Features page (admin.php?page=cf7-mate-features). Direct URL or bookmark.
     */
    public function render_features_page()
    {
        $this->render_app_root(['current_page' => 'features']);
    }

    /**
     * Enqueue admin app assets, localize config, output root div.
     * Used by both dashboard page and Entries page (under Contact).
     *
     * @param array $options Optional. 'entries_only' => true when rendering from CF7 Entries submenu.
     */
    public function render_app_root(array $options = [])
    {
        $entries_only = !empty($options['entries_only']);
        $current_page  = isset($options['current_page']) ? $options['current_page'] : 'dashboard';

        wp_enqueue_script(
            'dcs-admin',
            CF7M_PLUGIN_URL . 'dist/js/admin.js',
            ['react', 'wp-api', 'wp-i18n', 'wp-element', 'wp-api-fetch', 'wp-dom-ready'],
            CF7M_VERSION,
            true
        );

        wp_enqueue_style(
            'dcs-admin',
            CF7M_PLUGIN_URL . 'dist/css/admin.css',
            [],
            CF7M_VERSION
        );

        $rebrand_seen = get_option('cf7m_rebrand_seen', '') === '1';
        $onboarding_done = get_option('cf7m_onboarding_completed', '') === '1' || get_option('cf7m_onboarding_skipped', '') === '1';

        $localize = [
            'root' => esc_url_raw(get_rest_url()),
            'ajax_url' => admin_url('admin-ajax.php'),
            'fs_is_active' => 'true' === CF7M_SELF_HOSTED_ACTIVE,
            'fs_account_url' => function_exists('cf7m_fs') ? cf7m_fs()->get_account_url() : '',
            'pricing_url' => admin_url('admin.php?page=cf7-mate-pricing&coupon=NEW2026'),
            'nonce' => wp_create_nonce('wp_rest'),
            'pluginUrl' => CF7M_PLUGIN_URL,
            'show_v3_banner' => !$rebrand_seen && $onboarding_done,
            'dismiss_rebrand_nonce' => wp_create_nonce('cf7m_onboarding_nonce'),
            'version' => defined('CF7M_VERSION') ? CF7M_VERSION : '3.0.0',
            'dashboard_url' => admin_url('admin.php?page=' . self::PAGE_SLUG),
            'currentPage' => $current_page,
        ];

        if ($entries_only) {
            $localize['entriesOnlyPage'] = true;
            $localize['cf7_admin_url'] = admin_url('admin.php?page=wpcf7');
        }

        $localize = apply_filters('cf7m_admin_app_localize', $localize, $options);

        wp_localize_script('dcs-admin', 'dcsCF7Styler', $localize);

        echo '<div id="cf7-styler-for-divi-root"></div>';
    }
}
