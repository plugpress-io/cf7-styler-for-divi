<?php

namespace Divi_CF7_Styler;

class Plugin
{
    private static $instance = null;

    const PLUGIN_PATH = DCS_PLUGIN_PATH;
    const BASENAME_DIR = DCS_BASENAME_DIR;
    const BASENAME = DCS_BASENAME;
    const DOCS_LINK = 'https://diviextensions.com/docs/';
    const PRICING_LINK = 'https://diviextensions.com/divi-cf7-styler/';
    const TEXT_DOMAIN = 'cf7-styler-for-divi';

    public static function get_instance()
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
        Assets::get_instance();
    }

    private function include_files()
    {
        $required_files = [
            'functions.php',
            'assets.php',
            'grid.php'
        ];

        foreach ($required_files as $file) {
            $filepath = self::PLUGIN_PATH . 'includes/' . $file;
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
        add_filter('plugin_action_links_' . self::BASENAME, [$this, 'add_plugin_action_links']);
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
        load_plugin_textdomain(self::TEXT_DOMAIN, false, self::BASENAME_DIR . '/languages');
    }

    public function load_modules()
    {

        if (!class_exists('ET_Builder_Element')) {
            return;
        }

        require_once DCS_PLUGIN_PATH . 'includes/modules/divi-4/CF7Styler/CF7Styler.php';
        require_once DCS_PLUGIN_PATH . 'includes/modules/divi-4/FluentForms/FluentForms.php';
        require_once DCS_PLUGIN_PATH . 'includes/modules/divi-4/GravityForms/GravityForms.php';
    }

    public function add_plugin_action_links($links)
    {
        $additional_links = [
            $this->create_link(self::DOCS_LINK, 'Docs', '#197efb'),
            $this->create_link(self::PRICING_LINK, 'Get Pro', '#FF6900')
        ];

        return array_merge($links, $additional_links);
    }

    private function create_link($url, $text, $color)
    {
        return sprintf(
            '<a href="%s" target="_blank" style="color: %s;font-weight: 600;">%s</a>',
            esc_url($url),
            esc_attr($color),
            esc_html__($text, self::TEXT_DOMAIN)
        );
    }
}

Plugin::get_instance();
