<?php

namespace CF7_Mate;

if (!defined('ABSPATH')) {
    exit;
}

class Admin
{
    private static $instance;

    const TOP_LEVEL_SLUG = 'cf7-mate';
    const PAGE_SLUG = 'cf7-mate-dashboard';
    const FEATURES_PAGE_SLUG = 'cf7-mate-modules';
    const ENTRIES_PAGE_SLUG = 'cf7-mate-entries';
    const AI_SETTINGS_PAGE_SLUG = 'cf7-mate-ai-settings';
    const FREE_VS_PRO_PAGE_SLUG = 'cf7-mate-free-vs-pro';
    const WEBHOOK_PAGE_SLUG = 'cf7-mate-webhook';
    const LICENSE_PAGE_SLUG = 'cf7-mate-license';

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
        add_action('admin_menu', [$this, 'ensure_dashboard_submenu'], 999999999);
        add_action('admin_head', [$this, 'print_menu_badge_css']);
        add_action('admin_init', [$this, 'redirect_cf7_mate_to_settings'], 5);
        add_filter('cf7m_admin_app_localize', [$this, 'inject_license_data'], 10, 2);
    }

    public function redirect_cf7_mate_to_settings()
    {
        $page = isset($_GET['page']) ? sanitize_text_field(wp_unslash($_GET['page'])) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if ($page !== self::TOP_LEVEL_SLUG || !current_user_can('manage_options')) {
            return;
        }

        wp_safe_redirect(admin_url('admin.php?page=' . self::PAGE_SLUG));
        exit;
    }

    public function print_menu_badge_css()
    {
        if (cf7m_is_pro()) {
            return;
        }
        echo '<style>.cf7m-menu-pro-badge{display:inline-block;padding:1px 6px;font-size:10px;line-height:16px;font-weight:600;border-radius:3px;background:transparent;color:#fff;vertical-align:middle}</style>';
    }

    public function add_menu()
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        $menu_icon_path = defined('CF7M_PLUGIN_PATH') ? CF7M_PLUGIN_PATH . 'assets/images/cf7-mate-logo.svg' : '';
        $menu_icon_url  = ($menu_icon_path && file_exists($menu_icon_path))
            ? 'data:image/svg+xml;base64,' . base64_encode((string) file_get_contents($menu_icon_path))
            : 'dashicons-email-alt';

        add_menu_page(
            __('CF7 Mate', 'cf7-styler-for-divi'),
            __('CF7 Mate', 'cf7-styler-for-divi'),
            'manage_options',
            self::TOP_LEVEL_SLUG,
            [$this, 'redirect_cf7_mate_page_to_dashboard'],
            $menu_icon_url,
            59
        );

        add_submenu_page(
            self::TOP_LEVEL_SLUG,
            __('Overview', 'cf7-styler-for-divi'),
            __('Overview', 'cf7-styler-for-divi'),
            'manage_options',
            self::PAGE_SLUG,
            [$this, 'render_page']
        );

        add_submenu_page(
            self::TOP_LEVEL_SLUG,
            __('Modules', 'cf7-styler-for-divi'),
            __('Modules', 'cf7-styler-for-divi'),
            'manage_options',
            self::FEATURES_PAGE_SLUG,
            [$this, 'render_features_page']
        );

        $is_pro_active = cf7m_is_pro();
        $pro_badge     = $is_pro_active ? '' : ' <span class="cf7m-menu-pro-badge">Pro</span>';

        add_submenu_page(
            self::TOP_LEVEL_SLUG,
            __('Entries', 'cf7-styler-for-divi'),
            __('Entries', 'cf7-styler-for-divi') . $pro_badge,
            'manage_options',
            self::ENTRIES_PAGE_SLUG,
            [$this, 'render_entries_page']
        );

        add_submenu_page(
            self::TOP_LEVEL_SLUG,
            __('Webhook', 'cf7-styler-for-divi'),
            __('Webhook', 'cf7-styler-for-divi') . $pro_badge,
            'manage_options',
            self::WEBHOOK_PAGE_SLUG,
            [$this, 'render_webhook_page']
        );

        add_submenu_page(
            self::TOP_LEVEL_SLUG,
            __('Settings', 'cf7-styler-for-divi'),
            __('Settings', 'cf7-styler-for-divi') . $pro_badge,
            'manage_options',
            self::AI_SETTINGS_PAGE_SLUG,
            [$this, 'render_ai_settings_page']
        );

        if ($is_pro_active) {
            add_submenu_page(
                self::TOP_LEVEL_SLUG,
                __('License', 'cf7-styler-for-divi'),
                __('License', 'cf7-styler-for-divi'),
                'manage_options',
                self::LICENSE_PAGE_SLUG,
                [$this, 'render_license_page']
            );
        }

        remove_submenu_page(self::TOP_LEVEL_SLUG, self::TOP_LEVEL_SLUG);
    }

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
                __('Overview', 'cf7-styler-for-divi'),
                __('Overview', 'cf7-styler-for-divi'),
                'manage_options',
                self::PAGE_SLUG,
                [$this, 'render_page']
            );
        }
    }

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

    public function render_license_page()
    {
        $this->render_app_root(['current_page' => 'license']);
    }

    public function render_app_root(array $options = [])
    {
        $entries_only = !empty($options['entries_only']);
        $current_page  = isset($options['current_page']) ? $options['current_page'] : 'dashboard';

        wp_enqueue_script(
            'cf7m-admin',
            CF7M_PLUGIN_URL . 'dist/js/admin.js',
            ['wp-i18n', 'wp-element', 'wp-api-fetch', 'wp-dom-ready'],
            CF7M_VERSION,
            true
        );

        wp_enqueue_style(
            'cf7m-admin',
            CF7M_PLUGIN_URL . 'dist/css/admin.css',
            [],
            CF7M_VERSION
        );

        // Allow pro (or add-ons) to enqueue their own scripts/styles.
        do_action('cf7m_admin_enqueue_scripts');

        $rebrand_seen = get_option('cf7m_rebrand_seen', '') === '1';
        $onboarding_done = get_option('cf7m_onboarding_completed', '') === '1' || get_option('cf7m_onboarding_skipped', '') === '1';
        $onboarding_skipped = get_option('cf7m_onboarding_skipped', '') === '1';
        $onboarding_completed = get_option('cf7m_onboarding_completed', '') === '1';
        $show_guided_setup_link = $onboarding_skipped && !$onboarding_completed;

        $localize = [
            'root' => esc_url_raw(get_rest_url()),
            'ajax_url' => admin_url('admin-ajax.php'),
            'is_pro' => cf7m_is_pro(),
            'pricing_url' => CF7M_URL_PRICING . '?coupon=NEW2026',
            'promo_code' => 'NEW2026',
            'promo_text' => '',
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

    public function inject_license_data($localize, $options)
    {
        if (class_exists('CF7_Mate\License\License_Manager')) {
            $license_manager = \CF7_Mate\License\License_Manager::instance();
            $localize['license'] = $license_manager->get_status();
        }
        return $localize;
    }
}
