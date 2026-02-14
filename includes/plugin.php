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
        $this->maybe_load_divi5_modules();
        add_action('plugins_loaded', [$this, 'maybe_load_divi5_modules'], 99);

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
        $core_files = [
            'functions.php',
            'assets.php',
            'rest-api.php',
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

        // Load lite features (star rating, range slider, separator, image, icon) – free build.
        $lite_loader = CF7M_PLUGIN_PATH . 'includes/lite/loader.php';
        if (file_exists($lite_loader)) {
            require_once $lite_loader;
        }

        // Load Grid Layout only if feature is enabled
        if ($this->is_feature_enabled('grid_layout')) {
            $grid_path = CF7M_PLUGIN_PATH . 'includes/utils/grid.php';
            if (file_exists($grid_path)) {
                require_once $grid_path;
            }
        }

        // Load Premium Features early so form-tag registration (wpcf7_init) is hooked before CF7 runs.
        add_action('plugins_loaded', [$this, 'load_premium_loader'], 5);
    }

    public function load_premium_loader()
    {
        $premium_loader = CF7M_PLUGIN_PATH . 'includes/pro/loader.php';
        if (!file_exists($premium_loader)) {
            return;
        }
        // Use cf7m_can_use_premium() which handles all cases: dev mode, self-hosted, and licensed
        if (!function_exists('cf7m_can_use_premium') || !cf7m_can_use_premium()) {
            return;
        }
        require_once $premium_loader;
    }

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
        add_action('admin_enqueue_scripts', [$this, 'enqueue_cf7_tag_admin_scripts'], 20);
    }

    public function enqueue_cf7_tag_admin_styles($hook)
    {
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

    public function enqueue_cf7_tag_admin_scripts($hook)
    {
        $screen = get_current_screen();
        if (!$screen || strpos($screen->id, 'wpcf7') === false) {
            return;
        }
        $path = CF7M_PLUGIN_PATH . 'assets/js/cf7m-tag-generator.js';
        if (!file_exists($path)) {
            return;
        }
        wp_enqueue_script(
            'cf7m-tag-generator',
            CF7M_PLUGIN_URL . 'assets/js/cf7m-tag-generator.js',
            [],
            CF7M_VERSION,
            true
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

        // Only load CF7 Styler for Divi if feature is enabled
        if ($this->is_feature_enabled('cf7_module')) {
            require_once CF7M_PLUGIN_PATH . 'includes/modules/divi-4/CF7Styler/CF7Styler.php';
        }

        // Only load deprecated modules for existing users (before version 3.0.0)
        if ($this->should_load_deprecated_modules()) {
            require_once CF7M_PLUGIN_PATH . 'includes/modules/divi-4/FluentForms/FluentForms.php';
            require_once CF7M_PLUGIN_PATH . 'includes/modules/divi-4/GravityForms/GravityForms.php';
        }
    }

    private function should_load_deprecated_modules()
    {
        $install_date = get_option('divi_cf7_styler_install_date');

        // If no install date, user is new - don't load deprecated modules
        if (!$install_date) {
            return false;
        }

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
