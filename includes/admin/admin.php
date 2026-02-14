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
     * Do not redirect when Freemius needs to show opt-in/activation so the user can complete it.
     */
    public function redirect_cf7_mate_to_settings()
    {
        $page = isset($_GET['page']) ? sanitize_text_field(wp_unslash($_GET['page'])) : '';
        if ($page !== 'cf7-mate' || !current_user_can('manage_options')) {
            return;
        }
        // Let Freemius show its opt-in/activation page when user hasn't completed it.
        if (function_exists('cf7m_fs')) {
            $fs = cf7m_fs();
            if (!$fs->is_registered() && !$fs->is_anonymous()) {
                return;
            }
        }
        wp_safe_redirect(admin_url('admin.php?page=' . self::PAGE_SLUG));
        exit;
    }

    /**
     * Add "CF7 Mate" as a top-level admin menu item so it is always visible in the sidebar.
     * When Freemius is not loaded (e.g. wp.org lite build), register the cf7-mate page so
     * links to the opt-in/connect URL do not trigger "Sorry, you are not allowed to access this page."
     */
    public function add_menu()
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        $menu_icon_path = defined('CF7M_PLUGIN_PATH') ? CF7M_PLUGIN_PATH . 'assets/images/cf7-mate-logo.svg' : '';
        $menu_icon_url  = ( $menu_icon_path && file_exists( $menu_icon_path ) )
            ? 'data:image/svg+xml;base64,' . base64_encode( (string) file_get_contents( $menu_icon_path ) )
            : 'dashicons-email-alt';

        add_menu_page(
            __('CF7 Mate', 'cf7-styler-for-divi'),
            __('CF7 Mate', 'cf7-styler-for-divi'),
            'manage_options',
            self::PAGE_SLUG,
            [$this, 'render_page'],
            $menu_icon_url,
            59
        );

        // When Freemius is not loaded (lite build without SDK), register the connect slug
        // so ?page=cf7-mate is valid and we can redirect instead of wp_die.
        if (!function_exists('cf7m_fs')) {
            add_submenu_page(
                self::PAGE_SLUG,
                __('Connect', 'cf7-styler-for-divi'),
                __('Connect', 'cf7-styler-for-divi'),
                'manage_options',
                'cf7-mate',
                [$this, 'redirect_cf7_mate_page_to_dashboard']
            );
        }
    }

    /**
     * Redirect the Freemius connect slug to the dashboard when Freemius is not loaded.
     * Prevents "Sorry, you are not allowed to access this page." when hitting ?page=cf7-mate on lite build.
     */
    public function redirect_cf7_mate_page_to_dashboard()
    {
        wp_safe_redirect(admin_url('admin.php?page=' . self::PAGE_SLUG));
        exit;
    }

    public function render_page()
    {
        $this->render_app_root([]);
    }


    public function render_features_page()
    {
        $this->render_app_root(['current_page' => 'features']);
    }

    public function render_app_root(array $options = [])
    {
        $entries_only = !empty($options['entries_only']);
        $current_page  = isset($options['current_page']) ? $options['current_page'] : 'dashboard';

        wp_enqueue_script(
            'cf7m-admin',
            CF7M_PLUGIN_URL . 'dist/js/admin.js',
            ['react', 'wp-api', 'wp-i18n', 'wp-element', 'wp-api-fetch', 'wp-dom-ready'],
            CF7M_VERSION,
            true
        );

        wp_enqueue_style(
            'cf7m-admin',
            CF7M_PLUGIN_URL . 'dist/css/admin.css',
            [],
            CF7M_VERSION
        );

        $rebrand_seen = get_option('cf7m_rebrand_seen', '') === '1';
        $onboarding_done = get_option('cf7m_onboarding_completed', '') === '1' || get_option('cf7m_onboarding_skipped', '') === '1';
        $onboarding_skipped = get_option('cf7m_onboarding_skipped', '') === '1';
        $onboarding_completed = get_option('cf7m_onboarding_completed', '') === '1';
        $show_guided_setup_link = $onboarding_skipped && !$onboarding_completed;

        $localize = [
            'root' => esc_url_raw(get_rest_url()),
            'ajax_url' => admin_url('admin-ajax.php'),
            'fs_is_active' => 'true' === CF7M_SELF_HOSTED_ACTIVE,
            'fs_account_url' => function_exists('cf7m_fs') ? cf7m_fs()->get_account_url() : '',
            'pricing_url' => admin_url('admin.php?page=cf7-mate-pricing&coupon=NEW2026'),
            'promo_code' => 'NEW2026', // Shown as "Use code NEW2026". Empty = hide. Change via filter cf7m_admin_app_localize.
            'promo_text' => '', // Optional extra line (no percentage). Set via filter cf7m_admin_app_localize. Empty = hidden.
            'nonce' => wp_create_nonce('wp_rest'),
            'pluginUrl' => CF7M_PLUGIN_URL,
            'show_v3_banner' => !$rebrand_seen && $onboarding_done,
            'show_guided_setup_link' => $show_guided_setup_link,
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

        wp_localize_script('cf7m-admin', 'dcsCF7Styler', $localize);

        echo '<div id="cf7-mate-app-root"></div>';
    }
}
