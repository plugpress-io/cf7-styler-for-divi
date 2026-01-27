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
        add_action('divi_visual_builder_assets_before_enqueue_scripts', array($this, 'enqueue_d5_vb_assets'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_d5_frontend_assets'));
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

    /**
     * Enqueue Divi 5 Visual Builder assets using PackageBuildManager.
     *
     * @since 3.0.0
     */
    public function enqueue_d5_vb_assets()
    {
        $plugin_dir_url = DCS_PLUGIN_URL;

        // Register the module bundle
        if (class_exists('\ET\Builder\VisualBuilder\Assets\PackageBuildManager')) {
            \ET\Builder\VisualBuilder\Assets\PackageBuildManager::register_package_build(
                array(
                    'name'    => 'cf7-styler-for-divi-builder-bundle-script',
                    'version' => DCS_VERSION,
                    'script'  => array(
                        'src'                => "{$plugin_dir_url}dist/js/bundle.js",
                        'deps'               => array(
                            'divi-module-library',
                            'divi-vendor-wp-hooks',
                        ),
                        'enqueue_top_window' => false,
                        'enqueue_app_window' => true,
                    ),
                )
            );

            \ET\Builder\VisualBuilder\Assets\PackageBuildManager::register_package_build(
                array(
                    'name'    => 'cf7-styler-for-divi-builder-bundle-style',
                    'version' => DCS_VERSION,
                    'style'   => array(
                        'src'                => "{$plugin_dir_url}dist/css/bundle.css",
                        'deps'               => array(),
                        'enqueue_top_window' => false,
                        'enqueue_app_window' => true,
                    ),
                )
            );
        }
    }

    /**
     * Enqueue Divi 5 frontend assets for published pages.
     *
     * @since 3.0.0
     */
    public function enqueue_d5_frontend_assets()
    {
        if (!function_exists('et_builder_d5_enabled') || !et_builder_d5_enabled()) {
            return;
        }
        if (function_exists('et_core_is_fb_enabled') && et_core_is_fb_enabled()) {
            return;
        }

        // Enqueue Divi 5 frontend CSS
        wp_enqueue_style(
            'cf7-styler-for-divi-d5-frontend-style',
            esc_url(DCS_PLUGIN_URL . 'dist/css/bundle.css'),
            array(),
            DCS_VERSION
        );
    }
}

Assets::instance();
