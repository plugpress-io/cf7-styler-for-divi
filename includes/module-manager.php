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

    /**
     * Extract module information from the module.json file in each directory
     *
     * @return array
     */
    private static function extract_modules()
    {
        $modules = [];
        $path = __DIR__ . '/modules/modules-json/';
        $directories = glob($path . '*', GLOB_ONLYDIR);

        foreach ($directories as $dir) {
            $module_file = $dir . '/module.json';

            if (file_exists($module_file)) {
                $module_data = json_decode(file_get_contents($module_file), true);

                if (isset($module_data['name'])) {
                    $module = [
                        'name' => str_replace('divitorque/', '', $module_data['name']),
                        'title' => $module_data['title'],
                    ];
                    if (isset($module_data['child_name'])) {
                        $module['child_name'] = str_replace('divitorque/', '', $module_data['child_name']);
                    }
                    $modules[] = $module;
                }
            }
        }

        return $modules;
    }


    /**
     * Get all modules
     *
     * @return array
     */
    public static function get_all_modules()
    {
        return self::extract_modules();
    }

    public function load_modules()
    {
        if (!class_exists('ET_Builder_Element')) {
            return;
        }

        require_once TFS_PLUGIN_PATH . 'includes/modules/Base/Base.php';
        require_once TFS_PLUGIN_PATH . 'includes/modules/CF7/CF7.php';
        require_once TFS_PLUGIN_PATH . 'includes/modules/FF/FF.php';
        require_once TFS_PLUGIN_PATH . 'includes/modules/GF/GF.php';
    }
}
