<?php

namespace Divi_CF7_Styler;

class Assets
{
    private static $instance;

    public static function get_instance()
    {
        if (!isset(self::$instance) && !(self::$instance instanceof Assets)) {
            self::$instance = new Assets;
        }

        return self::$instance;
    }

    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_builder_scripts'));
    }

    public function enqueue_frontend_scripts()
    {

        wp_enqueue_style(
            'dcs-frontend',
            DCS_PLUGIN_URL . 'dist/css/builder4.css',
            [],
            DCS_VERSION . time()
        );
    }

    public function enqueue_builder_scripts()
    {

        if (function_exists('et_core_is_fb_enabled') && !et_core_is_fb_enabled()) {
            return;
        }

        if (function_exists('wpFluentForm')) {
            wp_enqueue_style('fluent-form-styles');
            wp_enqueue_style('fluentform-public-default');
            wp_enqueue_script('fluent-form-submission');
        }

        if (class_exists('GFForms')) {
            wp_enqueue_style('gravity_forms_theme_reset');
            wp_enqueue_style('gravity_forms_theme_foundation');
            wp_enqueue_style('gravity_forms_theme_framework');
            wp_enqueue_style('gform_basic');
            wp_enqueue_style('gform_theme_components');
            wp_enqueue_style('gform_theme');

            wp_enqueue_script('gform_json');
            wp_enqueue_script('gform_gravityforms');
            wp_enqueue_script('gform_conditional_logic');
            wp_enqueue_script('gform_masked_input');
            wp_enqueue_script('gform_gravityforms_utils');
            wp_enqueue_script('gform_gravityforms_theme');
        }

        wp_enqueue_style(
            'dcs-builder',
            DCS_PLUGIN_URL . 'dist/css/builder4.css',
            [],
            DCS_VERSION . time()
        );

        wp_enqueue_script(
            'dcs-builder',
            DCS_PLUGIN_URL . 'dist/js/builder4.js',
            ['react-dom', 'react'],
            DCS_VERSION . time(),
            true
        );
    }
}
