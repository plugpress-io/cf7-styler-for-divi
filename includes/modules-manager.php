<?php

namespace DiviTorque;

use DiviTorque\AdminHelper;

/**
 * Class ModulesManager
 *
 * @package DiviTorque Pro
 */
final class ModulesManager
{
    /**
     * @var ModulesManager
     */
    private static $instance;

    /**
     * Get an instance of the ModulesManager
     *
     * @return ModulesManager
     */
    public static function get_instance()
    {
        if (!isset(self::$instance)) {
            self::$instance = new ModulesManager();
        }

        return self::$instance;
    }

    /**
     * ModulesManager constructor.
     */
    public function __construct()
    {
        add_action('et_builder_ready', [$this, 'load_modules'], 9);
    }

    /**
     * Load active modules
     */
    public function load_modules()
    {
        if (!class_exists('ET_Builder_Element')) {
            return;
        }

        $module_files = glob(__DIR__ . '/modules/*/*.php');

        // Load custom Divi Builder modules.
        foreach ((array) $module_files as $module_file) {
            if ($module_file && preg_match("/\/modules\/\b([^\/]+)\/\\1\.php$/", $module_file)) {
                require_once $module_file;
            }
        }
    }
}
