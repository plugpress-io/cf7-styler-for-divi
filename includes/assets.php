<?php

namespace Divi_CF7_Styler;

class Assets
{
    private static $instance;

    public static function instance()
    {
        if (!isset(self::$instance) && !(self::$instance instanceof Assets)) {
            self::$instance = new Assets;
        }

        return self::$instance;
    }

    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_builder_scripts'));
    }

    public function enqueue_scripts()
    {
        wp_enqueue_style(
            'cf7-styler-for-divi',
            DCS_PLUGIN_URL . 'dist/css/builder4.css',
            [],
            DCS_VERSION
        );
    }

    public function enqueue_builder_scripts()
    {

        if (function_exists('et_core_is_fb_enabled') && !et_core_is_fb_enabled()) {
            return;
        }

        wp_enqueue_style(
            'cf7-styler-for-divi-builder',
            DCS_PLUGIN_URL . 'dist/css/builder4.css',
            [],
            DCS_VERSION
        );

        wp_enqueue_script(
            'cf7-styler-for-divi-builder',
            DCS_PLUGIN_URL . 'dist/js/builder4.js',
            ['react-dom', 'react'],
            DCS_VERSION,
            true
        );
    }
}

Assets::instance();
