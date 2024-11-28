<?php

namespace Divi_Form_Styler;

class Assets_Manager
{
    private static $instance;

    public static function get_instance()
    {
        if (!isset(self::$instance) && !(self::$instance instanceof Assets_Manager)) {
            self::$instance = new Assets_Manager;
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
        $mj = file_get_contents(TFS_PLUGIN_PATH . 'assets/mix-manifest.json');
        $mj = json_decode($mj, true);

        wp_enqueue_style('tfs-frontend', TFS_PLUGIN_URL . 'assets/css/frontend.css', [], TFS_VERSION);
        wp_enqueue_style('cf7-grid', TFS_PLUGIN_URL . 'assets/css/cf7-grid.css', [], TFS_VERSION);
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

        $mj = file_get_contents(TFS_PLUGIN_PATH . 'assets/mix-manifest.json');
        $mj = json_decode($mj, true);

        wp_enqueue_script('tfs-builder', TFS_PLUGIN_URL . 'assets' . $mj['/js/builder.js'], ['react-dom', 'react'], TFS_VERSION, true);
        wp_enqueue_style('tfs-builder', TFS_PLUGIN_URL . 'assets' . $mj['/css/builder.css'], [], TFS_VERSION);
    }
}
