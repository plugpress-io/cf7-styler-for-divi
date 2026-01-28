<?php

namespace Divi_CF7_Styler;

class Plugin
{
    private static $instance = null;

    const BASENAME = DCS_BASENAME;
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
        $required_files = [
            'functions.php',
            'assets.php',
            'utils/grid.php',
            'notices/review.php',
            'admin/admin.php',
            'admin/onboarding.php',
            'rest-api.php',
        ];

        foreach ($required_files as $file) {
            $filepath = DCS_PLUGIN_PATH . 'includes/' . $file;
            if (file_exists($filepath)) {
                require_once $filepath;
            }
        }
    }

    private function define_hooks()
    {
        register_activation_hook(self::BASENAME, [$this, 'on_activation']);
        add_action('plugins_loaded', [$this, 'load_textdomain']);
        add_action('et_builder_ready', [$this, 'load_modules'], 11);
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
        update_option('divi_cf7_styler_current_version', DCS_VERSION);
    }

    public function load_textdomain()
    {
        load_plugin_textdomain('cf7-styler-for-divi', false, DCS_BASENAME_DIR . '/languages');
    }

    public function load_modules()
    {

        if (!class_exists('ET_Builder_Element')) {
            return;
        }

        require_once DCS_PLUGIN_PATH . 'includes/modules/divi-4/CF7Styler/CF7Styler.php';

        // Only load deprecated modules for existing users (before version 3.0.0)
        if ($this->should_load_deprecated_modules()) {
            require_once DCS_PLUGIN_PATH . 'includes/modules/divi-4/FluentForms/FluentForms.php';
            require_once DCS_PLUGIN_PATH . 'includes/modules/divi-4/GravityForms/GravityForms.php';
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

        $dependency_interface_path = ABSPATH . 'wp-content/themes/Divi/includes/builder-5/server/Framework/DependencyManagement/Interfaces/DependencyInterface.php';

        if (!file_exists($dependency_interface_path)) {
            return;
        }

        require_once DCS_PLUGIN_PATH . 'includes/modules/Modules.php';
        $loaded = true;
    }
}

Plugin::instance();
