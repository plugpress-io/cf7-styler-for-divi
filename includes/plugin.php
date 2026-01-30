<?php

namespace CF7_Mate;

class Plugin
{
    private static $instance = null;

    const BASENAME = CF7M_BASENAME;
    const TEXT_DOMAIN = 'cf7-styler-for-divi';

    public static function instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        // Try to load Divi 5 modules immediately if Divi is already loaded
        $this->maybe_load_divi5_modules();

        // Also try on plugins_loaded with high priority as fallback
        add_action('plugins_loaded', [$this, 'maybe_load_divi5_modules'], 5);

        $this->init();
    }

    private function init()
    {
        $this->include_files();
        $this->define_hooks();
        $this->init_components();
    }

    private function include_files()
    {
        // Core files that are always loaded
        $core_files = [
            'functions.php',
            'assets.php',
            'rest-api.php', // Load early so feature check is available
            'notices/review.php',
            'admin/admin.php',
            'admin/onboarding.php',
        ];

        foreach ($core_files as $file) {
            $filepath = CF7M_PLUGIN_PATH . 'includes/' . $file;
            if (file_exists($filepath)) {
                require_once $filepath;
            }
        }

        // Load Grid Layout only if feature is enabled
        if ($this->is_feature_enabled('grid_layout')) {
            $grid_path = CF7M_PLUGIN_PATH . 'includes/utils/grid.php';
            if (file_exists($grid_path)) {
                require_once $grid_path;
            }
        }

        // Load Premium Features on plugins_loaded with lower priority so feature options
        // (cf7m_features) are available and toggles take effect on next page load.
        add_action('plugins_loaded', [$this, 'load_premium_loader'], 20);
    }

    /**
     * Load premium features loader after free plugin and options are ready.
     *
     * @since 3.0.0
     */
    public function load_premium_loader()
    {
        $premium_loader = CF7M_PLUGIN_PATH . 'includes/pro/loader.php';
        if (!file_exists($premium_loader)) {
            return;
        }
        if (!function_exists('cf7m_fs') || !(cf7m_fs()->is__premium_only() || cf7m_can_use_premium())) {
            return;
        }
        require_once $premium_loader;
    }

    /**
     * Check if a feature is enabled.
     *
     * @since 3.0.0
     * @param string $feature Feature key.
     * @return bool
     */
    private function is_feature_enabled($feature)
    {
        $defaults = [
            'cf7_module' => true,
            'grid_layout' => true,
            'multi_column' => true,
            'multi_step' => true,
            'star_rating' => true,
            'database_entries' => true,
            'range_slider' => true,
            'separator' => true,
            'heading' => true,
            'image' => true,
            'icon' => true,
        ];
        $saved = get_option('cf7m_features', []);
        $features = wp_parse_args($saved, $defaults);

        return isset($features[$feature]) ? (bool) $features[$feature] : false;
    }

    private function define_hooks()
    {
        register_activation_hook(self::BASENAME, [$this, 'on_activation']);
        add_action('plugins_loaded', [$this, 'load_textdomain']);
        add_action('et_builder_ready', [$this, 'load_modules'], 11);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_cf7_tag_admin_styles'], 20);
    }

    /**
     * Enqueue CSS on CF7 admin so our tag generator buttons look distinct (CF7 Mate color).
     *
     * @since 3.0.0
     */
    public function enqueue_cf7_tag_admin_styles($hook)
    {
        if (!function_exists('cf7m_can_use_premium') || !cf7m_can_use_premium()) {
            return;
        }
        $screen = get_current_screen();
        if (!$screen || strpos($screen->id, 'wpcf7') === false) {
            return;
        }
        $url = CF7M_PLUGIN_URL . 'assets/css/cf7m-tag-admin.css';
        if (!file_exists(CF7M_PLUGIN_PATH . 'assets/css/cf7m-tag-admin.css')) {
            return;
        }
        wp_enqueue_style(
            'cf7m-tag-admin',
            $url,
            [],
            CF7M_VERSION
        );
    }

    public function on_activation()
    {
        $this->maybe_set_install_date();
        $this->update_plugin_version();
    }

    private function maybe_set_install_date()
    {
        if (!get_option('divi_cf7_styler_install_date')) {
            update_option('divi_cf7_styler_install_date', time());
        }
    }

    private function update_plugin_version()
    {
        update_option('divi_cf7_styler_current_version', CF7M_VERSION);
    }

    public function load_textdomain()
    {
        load_plugin_textdomain('cf7-styler-for-divi', false, CF7M_BASENAME_DIR . '/languages');
    }

    public function load_modules()
    {
        if (!class_exists('ET_Builder_Element')) {
            return;
        }

        // Only load CF7 Styler module if feature is enabled
        if ($this->is_feature_enabled('cf7_module')) {
            require_once CF7M_PLUGIN_PATH . 'includes/modules/divi-4/CF7Styler/CF7Styler.php';
        }

        // Only load deprecated modules for existing users (before version 3.0.0)
        if ($this->should_load_deprecated_modules()) {
            require_once CF7M_PLUGIN_PATH . 'includes/modules/divi-4/FluentForms/FluentForms.php';
            require_once CF7M_PLUGIN_PATH . 'includes/modules/divi-4/GravityForms/GravityForms.php';
        }
    }

    /**
     * Check if deprecated modules should be loaded.
     * Only load for existing users (install date before version 3.0.0 release).
     *
     * @since 3.0.0
     * @return bool
     */
    private function should_load_deprecated_modules()
    {
        $install_date = get_option('divi_cf7_styler_install_date');

        // If no install date, user is new - don't load deprecated modules
        if (!$install_date) {
            return false;
        }

        // Version 3.0.0 release date: January 2026 (approximate timestamp)
        // Load deprecated modules only if installed before this date
        $version_3_release_date = strtotime('2026-01-01');

        return $install_date < $version_3_release_date;
    }

    private function init_components()
    {
        // Initialize review notice (star rating)
        if (class_exists(__NAMESPACE__ . '\Admin_Review_Notice')) {
            Admin_Review_Notice::instance();
        }

        // Initialize onboarding
        if (class_exists(__NAMESPACE__ . '\Onboarding')) {
            Onboarding::instance();
        }

        // Initialize admin dashboard
        if (class_exists(__NAMESPACE__ . '\Admin')) {
            Admin::get_instance();
        }
    }

    /**
     * Load Divi 5 modules if available.
     * Tries immediately and also on plugins_loaded hook with priority 5.
     *
     * @since 3.0.0
     */
    public function maybe_load_divi5_modules()
    {
        // Prevent loading multiple times
        static $loaded = false;
        if ($loaded) {
            return;
        }

        // Only load if CF7 module feature is enabled
        if (!$this->is_feature_enabled('cf7_module')) {
            return;
        }

        $dependency_interface_path = ABSPATH . 'wp-content/themes/Divi/includes/builder-5/server/Framework/DependencyManagement/Interfaces/DependencyInterface.php';

        if (!file_exists($dependency_interface_path)) {
            return;
        }

        require_once CF7M_PLUGIN_PATH . 'includes/modules/Modules.php';
        $loaded = true;
    }
}

Plugin::instance();
