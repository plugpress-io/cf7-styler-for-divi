<?php

namespace TorqueFormsStyler;

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
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
    }

    public function enqueue_frontend_scripts()
    {
        $mj = file_get_contents(TFS_PLUGIN_PATH . 'assets/mix-manifest.json');
        $mj = json_decode($mj, true);

        wp_enqueue_style('tfs-frontend', TFS_PLUGIN_URL . 'assets/css/frontend.css', [], TFS_VERSION);
    }

    public function enqueue_builder_scripts()
    {
        if (!et_core_is_fb_enabled()) {
            return;
        }

        $mj = file_get_contents(TFS_PLUGIN_PATH . 'assets/mix-manifest.json');
        $mj = json_decode($mj, true);

        wp_enqueue_script('tfs-builder-js', TFS_PLUGIN_URL . 'assets' . $mj['/js/builder.js'], ['react-dom', 'react'], TFS_VERSION, true);
        wp_enqueue_style('torq-builder-css', TFS_PLUGIN_URL . 'assets' . $mj['/css/builder.css'], [], TFS_VERSION);
    }

    public function enqueue_admin_scripts()
    {

        $mj = file_get_contents(TFS_PLUGIN_PATH . 'assets/mix-manifest.json');
        $mj = json_decode($mj, true);

        wp_enqueue_script('tfs-admin-js', TFS_PLUGIN_URL . 'assets' . $mj['/js/admin.js'], ['jquery'], TFS_VERSION, true);
    }
}
