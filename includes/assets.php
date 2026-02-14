<?php

namespace CF7_Mate;

/**
 * Frontend and builder asset enqueue.
 *
 * Free bundle (builder4.css, frontend4.css) is enqueued only when the page has
 * a CF7 form (shortcode or Divi CF7 Styler for Divi). Pro-only assets (tag-admin
 * CSS, multi-column, multi-steps, star-rating, range-slider, icon dashicons) are
 * enqueued only when Pro is active and, where applicable, only on pages with a CF7 form.
 */
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
        $in_vb = function_exists('et_core_is_fb_enabled') && et_core_is_fb_enabled();
        if (!$in_vb) {
            global $post;
            if (!$post || !is_singular()) {
                return;
            }
            $has_cf7 = has_shortcode($post->post_content, 'contact-form-7')
                || (strpos($post->post_content, 'dvppl_cf7_styler') !== false)
                || (strpos($post->post_content, 'cf7-styler-for-divi/cf7-styler') !== false);
            if (!$has_cf7) {
                return;
            }
        }
        wp_enqueue_style(
            'cf7-styler-for-divi',
            CF7M_PLUGIN_URL . 'dist/css/builder4.css',
            [],
            CF7M_VERSION
        );
    }

    public function enqueue_builder_scripts()
    {

        if (function_exists('et_core_is_fb_enabled') && !et_core_is_fb_enabled()) {
            return;
        }

        wp_enqueue_style(
            'cf7-styler-for-divi-builder',
            CF7M_PLUGIN_URL . 'dist/css/builder4.css',
            [],
            CF7M_VERSION
        );

        wp_enqueue_script(
            'cf7-styler-for-divi-builder',
            CF7M_PLUGIN_URL . 'dist/js/builder4.js',
            ['react-dom', 'react'],
            CF7M_VERSION,
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
        $plugin_dir_url = CF7M_PLUGIN_URL;

        // Register the module bundle
        if (class_exists('\ET\Builder\VisualBuilder\Assets\PackageBuildManager')) {
            \ET\Builder\VisualBuilder\Assets\PackageBuildManager::register_package_build(
                array(
                    'name'    => 'cf7-styler-for-divi-builder-bundle-script',
                    'version' => CF7M_VERSION,
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
                    'version' => CF7M_VERSION,
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
        global $post;
        if (!$post || !is_singular()) {
            return;
        }
        $has_cf7 = has_shortcode($post->post_content, 'contact-form-7')
            || (strpos($post->post_content, 'dvppl_cf7_styler') !== false)
            || (strpos($post->post_content, 'cf7-styler-for-divi/cf7-styler') !== false);
        if (!$has_cf7) {
            return;
        }

        // Enqueue Divi 5 frontend CSS only when page has CF7 form
        wp_enqueue_style(
            'cf7-styler-for-divi-d5-frontend-style',
            esc_url(CF7M_PLUGIN_URL . 'dist/css/bundle.css'),
            array(),
            CF7M_VERSION
        );
    }
}

Assets::instance();
