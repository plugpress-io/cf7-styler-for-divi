<?php

namespace TorqueFormsStyler;

use TorqueFormsStyler\Module_Manager;

class Admin
{

    const ASSETS_PATH = 'assets';
    const JS_PATH = '/js/dashboard.js';
    const CSS_PATH = '/css/dashboard.css';
    const TFS_SLUG = 'torque-forms-styler';

    private static $instance;

    private function __construct()
    {
        add_action('admin_menu', array($this, 'admin_menu'), 99);
        add_action('wp_ajax_tfs_close_modal', array($this, 'tfs_handle_close_modal'));
        add_action('wp_ajax_nopriv_tfs_close_modal', array($this, 'tfs_handle_close_modal'));
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
        if (!$this->is_divi_torque_pro_installed()) {
            add_submenu_page(
                'et_divi_options',
                __('Divi Forms Styler', 'torque-forms-styler'),
                __('Divi Forms Styler', 'torque-forms-styler'),
                'manage_options',
                'divi-forms-styler',
                [$this, 'load_page']
            );
        } else {
        }
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
            'react', 'wp-api', 'wp-i18n', 'lodash', 'wp-components',
            'wp-element', 'wp-api-fetch', 'wp-core-data', 'wp-data', 'wp-dom-ready',
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
            'isModalVisible' => self::is_modal_visible(),
            'isProInstalled' => self::is_divi_torque_pro_installed(),
            'nonce'    => wp_create_nonce('tfs_nonce'),
        ]);
    }

    private function is_modal_visible()
    {
        return get_option('tfs_modal_bfcm') !== '1';
    }

    function tfs_handle_close_modal()
    {
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'tfs_nonce')) {
            echo json_encode(array('status' => 'error', 'message' => 'Unauthorized request!'));
            wp_die();
        }

        update_option('tfs_modal_bfcm', '1');

        echo json_encode(array('status' => 'success', 'message' => 'Modal display option updated.'));

        wp_die();
    }

    public function menu_icon()
    {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0wIDMwQzAgMTMuNDMxNSAxMy40MzE2IDAgMzAgMEM0Ni41Njg0IDAgNjAgMTMuNDMxNSA2MCAzMEM2MCA0Ni41Njg1IDQ2LjU2ODQgNjAgMzAgNjBDMTMuNDMxNiA2MCAwIDQ2LjU2ODUgMCAzMFpNMTEuMzMxNSAyOC41NDc1QzExLjE4MzYgMjguNjgzNiAxMC45ODc4IDI4Ljc2MTIgMTAuNzkxNSAyOC43NjEyQzEwLjYyODQgMjguNzYxMiAxMC40NjUzIDI4LjcwNzUgMTAuMzMwMSAyOC42MTExQzEwLjEzNjcgMjguNDczNCAxMCAyOC4yNDg5IDEwIDI3Ljk2OTZWMjcuNjUzQzEwLjA3OTEgMjcuMzM2MyAxMC4zOTYgMjcuMDk4OSAxMC43OTE1IDI3LjA5ODlDMTEuMTg3NSAyNy4xNzggMTEuNTgzIDI3LjQ5NDYgMTEuNTgzIDI3Ljk2OTZDMTEuNTgzIDI4LjIwOTQgMTEuNDgyNCAyOC40MDg3IDExLjMzMTUgMjguNTQ3NVpNMzAuMTA2OSA1MC43NjgyQzQxLjM0ODEgNTAuNzY4MiA1MC41MzA4IDQxLjY2NDYgNTAuNTMwOCAzMC40MjM2QzUwLjUzMDggMTkuMTgyNyA0MS40MjcyIDEwIDMwLjE4NiAxMEMyNi4xNDg5IDEwIDIyLjQyODIgMTEuMTg3NCAxOS4yNjE3IDEzLjE2NjVDMTUuNjk5NyAxNS40NjIyIDEyLjg1MDEgMTguNzg2OSAxMS4yNjY2IDIyLjc0NUMxMS4wMjkzIDIzLjQ1NzQgMTAuNjMzMyAyNC42NDQ5IDEwLjM5NiAyNS41MTU2QzEwLjM0NDcgMjUuNzczMiAxMC40NjA0IDI2LjAzMDYgMTAuNjU3MiAyNi4yMDFDMTAuNzYyNyAyNi4yOTI1IDEwLjg5MTEgMjYuMzU4OCAxMS4wMjkzIDI2LjM4NjVDMTEuNTAzOSAyNi40NjU2IDExLjg5OTkgMjYuMjI4MSAxMS45NzkgMjUuODMyM0MxMi4wMTk1IDI1LjY2OTQgMTIuMTAyMSAyNS40MjMgMTIuMTcyOSAyNS4yMTEyQzEyLjIzOTcgMjUuMDExIDEyLjI5NTkgMjQuODQxNyAxMi4yOTU5IDI0LjgwMzJDMTIuNDU0MSAyNC40MDczIDEyLjg1MDEgMjQuMTY5OSAxMy4yNDU2IDI0LjMyODJDMTMuNTYyNSAyNC40ODY2IDEzLjc5OTggMjQuODAzMiAxMy43OTk4IDI1LjExOTlDMTMuNzIwNyAyNS4xOTkgMTMuNzIwNyAyNS4xOTkgMTMuNzIwNyAyNS4yNzgyQzEzLjQwMzggMjYuNDY1NiAxMy4wODc0IDI3Ljg5MDUgMTMuMDA4MyAyOS4yMzYyQzEyLjkyOTIgMjkuNjMyMSAxMy4yNDU2IDMwLjAyNzggMTMuNzIwNyAzMC4wMjc4QzE0LjExNjcgMzAuMTA3MSAxNC41MTIyIDI5LjcxMTIgMTQuNTEyMiAyOS4zMTU0QzE0LjUxMjIgMjkuMjc1OSAxNC41MzIyIDI5LjA3NzkgMTQuNTUxOCAyOC44OEMxNC41NzEzIDI4LjY4MjEgMTQuNTkxMyAyOC40ODQxIDE0LjU5MTMgMjguNDQ0NkMxNC44MjkxIDI3LjAxOTcgMTUuMjI0NiAyNS41OTQ4IDE1Ljc3ODggMjQuMjQ5QzE1Ljg1NzkgMjQuMDExNiAxNi4wMTYxIDIzLjg1MzMgMTYuMDk1NyAyMy42MTU3QzE2LjI1MzkgMjMuMjk5MSAxNi43MjkgMjMuMTQwNyAxNy4xMjQ1IDIzLjI5OTFIMTcuMjAzNkMxNy41OTk2IDIzLjQ1NzQgMTcuNzU3OCAyMy44NTMzIDE3LjU5OTYgMjQuMjQ5QzE3LjUyMDUgMjQuMzI4MiAxNy4wNDU0IDI1LjE5OSAxNi43MjkgMjYuNTQ0N0MxNi41NzAzIDI2Ljk0MDYgMTYuODg3MiAyNy40MTU1IDE3LjM2MjMgMjcuNDk0NkMxNy43NTc4IDI3LjU3MzkgMTguMDc0NyAyNy4zMzYzIDE4LjIzMjkgMjYuOTQwNkMxOC41NDkzIDI1LjkxMTUgMTkuMDI0NCAyNC44ODIzIDE5LjEwMzUgMjQuNzI0QzIwLjIxMTkgMjIuNTA3NCAyMS45NTM2IDIwLjY4NjggMjQuMDkwOCAxOS40OTk0QzI1LjgzMjUgMTguNDcwMiAyNy44OTA2IDE3LjkxNjEgMzAuMTA2OSAxNy45MTYxQzM2Ljk5NDEgMTcuOTE2MSA0Mi41MzU2IDIzLjQ1NzQgNDIuNTM1NiAzMC4zNDQ1QzQyLjUzNTYgMzYuNjc3NCAzNy44NjQ3IDQxLjgyMjkgMzEuODQ4NiA0Mi42OTM2VjI5LjA3NzlDMzEuODQ4NiAyNi44NjEzIDMwLjEwNjkgMjUuMTE5OSAyNy44OTA2IDI1LjExOTlDMjUuNjczOCAyNS4xMTk5IDIzLjkzMjYgMjYuODYxMyAyMy45MzI2IDI5LjA3NzlWNDYuODEwMUMyMy45MzI2IDQ5LjAyNjYgMjUuNjczOCA1MC43NjgyIDI3Ljg5MDYgNTAuNzY4MkgzMC4xMDY5WiIgZmlsbD0iIzFGMjkzNyIvPgo8L3N2Zz4K';
    }

    private function is_divi_torque_pro_installed()
    {
        return defined('DTP_VERSION');
    }
}
