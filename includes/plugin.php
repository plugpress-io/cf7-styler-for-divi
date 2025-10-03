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
            'grid.php',
            'admin-notice.php',
            'admin-review-notice.php'
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

        // Diprecated
        require_once DCS_PLUGIN_PATH . 'includes/modules/divi-4/FluentForms/FluentForms.php';
        require_once DCS_PLUGIN_PATH . 'includes/modules/divi-4/GravityForms/GravityForms.php';
    }

    private function init_components()
    {
        // Initialize admin notices
        Admin_Notice::instance();
        Admin_Review_Notice::instance();
    }
}

Plugin::instance();
