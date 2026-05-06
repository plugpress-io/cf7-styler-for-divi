<?php

namespace CF7_Mate;

if (!defined('ABSPATH')) {
    exit;
}

class Admin
{
    private static $instance;

    const CF7_PARENT_SLUG     = 'wpcf7';
    const RESPONSES_PAGE_SLUG = 'cf7-mate-responses';
    const SETTINGS_PAGE_SLUG  = 'cf7-mate-dash';

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
        add_filter('cf7m_admin_app_localize', [$this, 'inject_license_data'], 10, 2);
        add_filter('plugin_action_links_' . CF7M_BASENAME, [$this, 'add_plugin_action_links']);
    }

    public function add_plugin_action_links($links)
    {
        $dash_link = sprintf(
            '<a href="%s">%s</a>',
            esc_url(admin_url('admin.php?page=' . self::SETTINGS_PAGE_SLUG)),
            esc_html__('Dash', 'cf7-styler-for-divi')
        );
        array_unshift($links, $dash_link);
        return $links;
    }

    public function add_menu()
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        add_submenu_page(
            self::CF7_PARENT_SLUG,
            __('Responses', 'cf7-styler-for-divi'),
            __('Responses', 'cf7-styler-for-divi'),
            'manage_options',
            self::RESPONSES_PAGE_SLUG,
            [$this, 'render_responses_page']
        );

        add_submenu_page(
            self::CF7_PARENT_SLUG,
            __('Mate Dash', 'cf7-styler-for-divi'),
            __('Mate Dash', 'cf7-styler-for-divi'),
            'manage_options',
            self::SETTINGS_PAGE_SLUG,
            [$this, 'render_settings_page']
        );
    }

    public function render_responses_page()
    {
        $this->render_app_root([
            'app'          => 'responses',
            'current_page' => 'responses',
        ]);
    }

    public function render_settings_page()
    {
        $this->render_app_root([
            'app'          => 'settings',
            'current_page' => 'settings',
        ]);
    }

    public function render_app_root(array $options = [])
    {
        $app          = isset($options['app']) ? $options['app'] : 'settings';
        $current_page = isset($options['current_page']) ? $options['current_page'] : 'settings';

        $script_handle = $app === 'responses' ? 'cf7m-responses' : 'cf7m-settings';
        $script_file   = $app === 'responses' ? 'dist/js/responses.js' : 'dist/js/settings.js';
        $style_handle  = $app === 'responses' ? 'cf7m-responses' : 'cf7m-settings';
        $style_file    = $app === 'responses' ? 'dist/css/responses.css' : 'dist/css/settings.css';

        wp_enqueue_script(
            $script_handle,
            CF7M_PLUGIN_URL . $script_file,
            ['wp-i18n', 'wp-element', 'wp-api-fetch', 'wp-dom-ready', 'wp-components'],
            CF7M_VERSION,
            true
        );

        wp_enqueue_style(
            $style_handle,
            CF7M_PLUGIN_URL . $style_file,
            ['wp-components'],
            CF7M_VERSION
        );

        // Allow pro (or add-ons) to enqueue their own scripts/styles.
        do_action('cf7m_admin_enqueue_scripts', $app);

        $builders = $this->detect_builders();
        $rebrand_seen           = get_option('cf7m_rebrand_seen', '') === '1';
        $onboarding_done        = get_option('cf7m_onboarding_completed', '') === '1' || get_option('cf7m_onboarding_skipped', '') === '1';
        $onboarding_skipped     = get_option('cf7m_onboarding_skipped', '') === '1';
        $onboarding_completed   = get_option('cf7m_onboarding_completed', '') === '1';
        $show_guided_setup_link = $onboarding_skipped && !$onboarding_completed;

        $localize = [
            'root'                   => esc_url_raw(get_rest_url()),
            'ajax_url'               => admin_url('admin-ajax.php'),
            'is_pro'                 => cf7m_is_pro(),
            'pricing_url'            => CF7M_URL_PRICING . '?coupon=NEW2026',
            'docs_url'               => defined('CF7M_URL_DOCS') ? CF7M_URL_DOCS : '',
            'support_url'            => defined('CF7M_URL_SUPPORT') ? CF7M_URL_SUPPORT : '',
            'community_url'          => defined('CF7M_URL_COMMUNITY') ? CF7M_URL_COMMUNITY : '',
            'builders'               => $builders,
            'promo_code'             => 'NEW2026',
            'promo_text'             => '',
            'nonce'                  => wp_create_nonce('wp_rest'),
            'pluginUrl'              => CF7M_PLUGIN_URL,
            'show_v3_banner'         => !$rebrand_seen && $onboarding_done,
            'show_guided_setup_link' => $show_guided_setup_link,
            'dismiss_rebrand_nonce'  => wp_create_nonce('cf7m_onboarding_nonce'),
            'version'                => defined('CF7M_VERSION') ? CF7M_VERSION : '3.0.0',
            'cf7_admin_url'          => admin_url('admin.php?page=' . self::CF7_PARENT_SLUG),
            'dash_url'               => admin_url('admin.php?page=' . self::SETTINGS_PAGE_SLUG),
            'responses_url'          => admin_url('admin.php?page=' . self::RESPONSES_PAGE_SLUG),
            'currentPage'            => $current_page,
            'app'                    => $app,
        ];

        $localize = apply_filters('cf7m_admin_app_localize', $localize, $options);

        wp_localize_script($script_handle, 'dcsCF7Styler', $localize);

        echo '<div id="cf7-mate-app-root"></div>';
    }

    /**
     * Detect installed/active page builders so the Features UI can show only
     * the relevant builder modules.
     */
    private function detect_builders()
    {
        // Divi: parent theme or child whose parent is Divi.
        $theme        = wp_get_theme();
        $parent_theme = $theme->parent();
        $theme_name   = strtolower((string) $theme->get('Name'));
        $parent_name  = $parent_theme ? strtolower((string) $parent_theme->get('Name')) : '';
        $divi_active  = function_exists('et_setup_theme')
            || in_array('divi', [$theme_name, $parent_name], true)
            || in_array('extra', [$theme_name, $parent_name], true);

        // Bricks: theme name or constant defined by the theme.
        $bricks_active = defined('BRICKS_VERSION')
            || in_array('bricks', [$theme_name, $parent_name], true);

        // Elementor: plugin loaded.
        $elementor_active = did_action('elementor/loaded') > 0
            || class_exists('Elementor\\Plugin');

        return [
            'divi'      => (bool) $divi_active,
            'bricks'    => (bool) $bricks_active,
            'elementor' => (bool) $elementor_active,
            'gutenberg' => true, // native WP block editor — always available.
        ];
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
