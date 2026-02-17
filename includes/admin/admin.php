<?php

namespace CF7_Mate;

if (!defined('ABSPATH')) {
    exit;
}

class Admin
{
    private static $instance;

    /** Top-level admin menu slug (handled by redirect or Freemius). */
    const TOP_LEVEL_SLUG = 'cf7-mate';

    /** Dashboard / main app page slug. */
    const PAGE_SLUG = 'cf7-mate-dashboard';

    /** Subpage slugs – same app, different initial view. */
    const FEATURES_PAGE_SLUG = 'cf7-mate-features';
    const ENTRIES_PAGE_SLUG = 'cf7-mate-entries';
    const AI_SETTINGS_PAGE_SLUG = 'cf7-mate-ai-settings';
    const FREE_VS_PRO_PAGE_SLUG = 'cf7-mate-free-vs-pro';
    const WEBHOOK_PAGE_SLUG = 'cf7-mate-webhook';

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
        // Run after Freemius (999999999) so Dashboard submenu is never overwritten when Pro/Freemius is active.
        add_action('admin_menu', [$this, 'ensure_dashboard_submenu'], 1000000000);
        add_action('admin_init', [$this, 'redirect_cf7_mate_to_settings'], 5);
    }

    /**
     * Redirect page=cf7-mate (top level) to dashboard (cf7-mate-dashboard).
     * Do not redirect when Freemius needs to show opt-in/activation so the user can complete it.
     */
    public function redirect_cf7_mate_to_settings()
    {
        $page = isset($_GET['page']) ? sanitize_text_field(wp_unslash($_GET['page'])) : '';
        if ($page !== self::TOP_LEVEL_SLUG || !current_user_can('manage_options')) {
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
     * Add "CF7 Mate" as top-level menu (slug cf7-mate) and "Dashboard" as subpage (cf7-mate-dashboard).
     * Top-level handles redirect to dashboard (or Freemius opt-in); Dashboard subpage renders the app.
     */
    public function add_menu()
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        $menu_icon_path = defined('CF7M_PLUGIN_PATH') ? CF7M_PLUGIN_PATH . 'assets/images/cf7-mate-logo.svg' : '';
        $menu_icon_url  = ($menu_icon_path && file_exists($menu_icon_path))
            ? 'data:image/svg+xml;base64,' . base64_encode((string) file_get_contents($menu_icon_path))
            : 'dashicons-email-alt';

        // Top-level: cf7-mate (redirects to dashboard or shows Freemius opt-in)
        add_menu_page(
            __('CF7 Mate', 'cf7-styler-for-divi'),
            __('CF7 Mate', 'cf7-styler-for-divi'),
            'manage_options',
            self::TOP_LEVEL_SLUG,
            [$this, 'redirect_cf7_mate_page_to_dashboard'],
            $menu_icon_url,
            59
        );

        // Subpage: Dashboard (main app)
        add_submenu_page(
            self::TOP_LEVEL_SLUG,
            __('Dashboard', 'cf7-styler-for-divi'),
            __('Dashboard', 'cf7-styler-for-divi'),
            'manage_options',
            self::PAGE_SLUG,
            [$this, 'render_page']
        );

        // Subpage: Modules (features)
        add_submenu_page(
            self::TOP_LEVEL_SLUG,
            __('Modules', 'cf7-styler-for-divi'),
            __('Modules', 'cf7-styler-for-divi'),
            'manage_options',
            self::FEATURES_PAGE_SLUG,
            [$this, 'render_features_page']
        );

        // Pro-only subpages: Entries, AI Settings, Webhook
        if (function_exists('cf7m_can_use_premium') && cf7m_can_use_premium()) {
            add_submenu_page(
                self::TOP_LEVEL_SLUG,
                __('Entries', 'cf7-styler-for-divi'),
                __('Entries', 'cf7-styler-for-divi'),
                'manage_options',
                self::ENTRIES_PAGE_SLUG,
                [$this, 'render_entries_page']
            );

            add_submenu_page(
                self::TOP_LEVEL_SLUG,
                __('AI Settings', 'cf7-styler-for-divi'),
                __('AI Settings', 'cf7-styler-for-divi'),
                'manage_options',
                self::AI_SETTINGS_PAGE_SLUG,
                [$this, 'render_ai_settings_page']
            );

            add_submenu_page(
                self::TOP_LEVEL_SLUG,
                __('Webhook', 'cf7-styler-for-divi'),
                __('Webhook', 'cf7-styler-for-divi'),
                'manage_options',
                self::WEBHOOK_PAGE_SLUG,
                [$this, 'render_webhook_page']
            );
        }

        // Subpage: Free vs Pro (only when not Pro – hide for licensed/self-hosted Pro)
        if (!function_exists('cf7m_can_use_premium') || !cf7m_can_use_premium()) {
            add_submenu_page(
                self::TOP_LEVEL_SLUG,
                __('Free vs Pro', 'cf7-styler-for-divi'),
                __('Free vs Pro', 'cf7-styler-for-divi'),
                'manage_options',
                self::FREE_VS_PRO_PAGE_SLUG,
                [$this, 'render_free_vs_pro_page']
            );
        }

        // Remove the duplicate first submenu item WordPress adds (same title as parent)
        remove_submenu_page(self::TOP_LEVEL_SLUG, self::TOP_LEVEL_SLUG);
    }

    /**
     * Ensure the Dashboard submenu and its handler exist after Freemius runs.
     * Freemius runs at 999999999 and can replace/alter the menu; re-add Dashboard so ?page=cf7-mate-dashboard always works.
     */
    public function ensure_dashboard_submenu()
    {
        global $submenu;
        $parent = self::TOP_LEVEL_SLUG;
        if (empty($submenu[$parent])) {
            return;
        }
        $has_dashboard = false;
        foreach ($submenu[$parent] as $item) {
            if (isset($item[2]) && $item[2] === self::PAGE_SLUG) {
                $has_dashboard = true;
                break;
            }
        }
        if (!$has_dashboard) {
            add_submenu_page(
                $parent,
                __('Dashboard', 'cf7-styler-for-divi'),
                __('Dashboard', 'cf7-styler-for-divi'),
                'manage_options',
                self::PAGE_SLUG,
                [$this, 'render_page']
            );
        }
    }

    /**
     * Redirect top-level cf7-mate to dashboard. Lets Freemius show opt-in when needed (no redirect in that case).
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

    public function render_entries_page()
    {
        $this->render_app_root(['current_page' => 'entries']);
    }

    public function render_ai_settings_page()
    {
        $this->render_app_root(['current_page' => 'ai-settings']);
    }

    public function render_free_vs_pro_page()
    {
        $this->render_app_root(['current_page' => 'free-vs-pro']);
    }

    public function render_webhook_page()
    {
        $this->render_app_root(['current_page' => 'webhook']);
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
            'fs_account_url' => function_exists('cf7m_fs') ? cf7m_fs()->get_account_url() : '',
            'is_pro' => function_exists('cf7m_can_use_premium') && cf7m_can_use_premium(),
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
