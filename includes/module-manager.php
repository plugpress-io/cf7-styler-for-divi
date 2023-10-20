<?php

namespace TorqueFormsStyler;


class Module_Manager
{

    private static $instance;

    public static function get_instance()
    {
        if (!isset(self::$instance)) {
            self::$instance = new Module_Manager();
        }

        return self::$instance;
    }

    public function __construct()
    {
        add_action('et_builder_ready', [$this, 'load_modules'], 9);
    }

    public function load_modules()
    {
        if (!class_exists('ET_Builder_Element')) {
            return;
        }

        $module_files = glob(__DIR__ . '/modules/*/*.php');

        foreach ((array) $module_files as $module_file) {
            if ($module_file && preg_match("/\/modules\/\b([^\/]+)\/\\1\.php$/", $module_file)) {
                require_once $module_file;
            }
        }
    }
}
