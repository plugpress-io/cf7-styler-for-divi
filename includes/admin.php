<?php

namespace Divi_Form_Styler;

use Divi_Form_Styler\Module_Manager;

class Admin
{

    const ASSETS_PATH = 'assets';
    const JS_PATH = '/js/dashboard.js';
    const CSS_PATH = '/css/dashboard.css';
    const TFS_SLUG = 'form-styler-for-divi';

    private static $instance;

    private function __construct()
    {
        add_action('admin_menu', array($this, 'admin_menu'), 99);
    }

    public static function get_instance()
    {
        if (self::$instance == null) {
            self::$instance = new Admin();
        }
        return self::$instance;
    }

    public function admin_menu()
    {
        add_submenu_page(
            'et_divi_options',
            __('Contact Form Styler', 'contact-form-styler-for-divi'),
            __('Contact Form Styler', 'contact-form-styler-for-divi'),
            'manage_options',
            'cf7-styler-for-divi',
            [$this, 'load_page']
        );
    }

    public function load_page()
    {
        $this->enqueue_scripts();
        echo '<div id="tfs-root"></div>';
    }

    public function enqueue_scripts()
    {
        $dashboardJS = $this->get_asset_url(self::JS_PATH);
        $dashboardCSS = $this->get_asset_url(self::CSS_PATH);

        wp_enqueue_script('tfs-app', $dashboardJS, $this->wp_deps(), TFS_VERSION, true);
        wp_enqueue_style('tfs-app', $dashboardCSS, ['wp-components'], TFS_VERSION);
        wp_localize_script('tfs-app', 'tfsApp', $this->get_localized_data());
    }

    private function get_asset_url($assetPath)
    {
        $manifest = json_decode(file_get_contents(TFS_PLUGIN_PATH . self::ASSETS_PATH . '/mix-manifest.json'), true);

        return TFS_PLUGIN_URL . self::ASSETS_PATH . $manifest[$assetPath];
    }

    public function wp_deps()
    {
        return [
            'react',
            'wp-api',
            'wp-i18n',
            'lodash',
            'wp-components',
            'wp-element',
            'wp-api-fetch',
            'wp-core-data',
            'wp-data',
            'wp-dom-ready',
        ];
    }

    public static function get_modules()
    {
        $all_modules = Module_Manager::get_all_modules();

        $modules = [];

        foreach ($all_modules as $name => $value) {
            $modules[] = [
                'name' => $value['name'],
                'label' => $value['title'],
            ];
        }

        return $modules;
    }

    private function get_localized_data()
    {
        return apply_filters('divitorque_admin_localize', [
            'ajaxUrl' => esc_url_raw(admin_url('admin-ajax.php')),
            'root' => esc_url_raw(get_rest_url()),
            'assetsPath' => esc_url_raw(TFS_PLUGIN_ASSETS),
            'version' => TFS_VERSION,
            'home_slug' => self::TFS_SLUG,
            'modules' => Module_Manager::get_all_modules(),
            'notice_slug' => 'tfs-notice',
        ]);
    }
}
