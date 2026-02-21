<?php

/**
 * Lite features loader (Star Rating, Range Slider, Separator, Image, Icon, Grid).
 * Ships with free build; runs on every request.
 *
 * @package CF7_Mate
 * @since 3.0.0
 */

namespace CF7_Mate;

if (!defined('ABSPATH')) {
    exit;
}

class Lite_Loader
{
    private static $instance = null;

    private static $defaults = [
        'star_rating'   => true,
        'range_slider'  => true,
        'separator'     => true,
        'image'         => true,
        'icon'          => true,
        'grid_layout'   => true,
    ];

    private static $features = [
        'star_rating'   => [
            'file'  => 'star-rating/module.php',
            'class' => 'CF7_Mate\Lite\Features\Star_Rating\Star_Rating',
        ],
        'range_slider'  => [
            'file'  => 'range-slider/module.php',
            'class' => 'CF7_Mate\Lite\Features\Range_Slider\Range_Slider',
        ],
        'separator'     => [
            'file'  => 'separator/module.php',
            'class' => 'CF7_Mate\Lite\Features\Separator\Separator',
        ],
        'image'         => [
            'file'  => 'image/module.php',
            'class' => 'CF7_Mate\Lite\Features\Image\Image',
        ],
        'icon'          => [
            'file'  => 'icon/module.php',
            'class' => 'CF7_Mate\Lite\Features\Icon\Icon',
        ],
        'grid_layout'   => [
            'file'  => 'grid/module.php',
            'class' => 'CF7_Mate\Lite\Features\Grid\Grid',
        ],
    ];

    public static function instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        $this->load_bootstrap();
        $this->load_features();

        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);

        add_filter('wpcf7_form_elements', [$this, 'strip_unprocessed_preset_tags'], 15);
    }

    public function enqueue_admin_scripts($hook)
    {
        if ('toplevel_page_wpcf7' !== $hook && 'contact_page_wpcf7-new' !== $hook) {
            return;
        }

        $version = defined('CF7M_VERSION') ? CF7M_VERSION : '3.0.0';
        $path = CF7M_PLUGIN_PATH . 'assets/lite/js/cf7m-tag-generators-lite.js';
        if (!file_exists($path)) {
            return;
        }

        wp_enqueue_script(
            'cf7m-tag-generators-lite',
            CF7M_PLUGIN_URL . 'assets/lite/js/cf7m-tag-generators-lite.js',
            [],
            $version,
            true
        );
    }

    public function strip_unprocessed_preset_tags($form)
    {
        if (strpos($form, '[cf7m-presets') === false) {
            return $form;
        }
        return preg_replace('/\[cf7m-presets[^\]]*\]|\[\/cf7m-presets\]/i', '', $form);
    }

    private function load_bootstrap()
    {
        $base = CF7M_PLUGIN_PATH . 'includes/lite/';

        $files = [
            'Traits/singleton.php',
            'Traits/shortcode-atts.php',
            'feature-base.php',
            'form-tag-feature.php',
        ];

        foreach ($files as $file) {
            $path = $base . $file;
            if (file_exists($path)) {
                require_once $path;
            }
        }
    }

    private function load_features()
    {
        $saved    = get_option('cf7m_features', []);
        $features = wp_parse_args($saved, self::$defaults);
        $path     = CF7M_PLUGIN_PATH . 'includes/lite/features/';

        foreach (self::$features as $key => $config) {
            if (empty($features[$key])) {
                continue;
            }

            $file_path = $path . $config['file'];
            if (!file_exists($file_path)) {
                continue;
            }

            require_once $file_path;

            if (class_exists($config['class']) && method_exists($config['class'], 'instance')) {
                $config['class']::instance();
            }
        }
    }
}

Lite_Loader::instance();
