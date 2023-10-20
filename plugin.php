<?php

namespace TorqueFormsStyler;

/**
 * Main class plugin
 */
class Plugin
{

    /**
     * @var Plugin
     */
    private static $instance;

    /**
     * Get an instance of the Plugin
     *
     * @return Plugin
     */
    public static function get_instance()
    {
        if (!isset(self::$instance) && !(self::$instance instanceof Plugin))
            self::$instance = new Plugin;

        return self::$instance;
    }

    /**
     * Plugin constructor.
     */
    public function __construct()
    {
        add_action('divi_extensions_init', array($this, 'init_extension'));
        add_action('plugins_loaded', array($this, 'load_textdomain'), 15);
        add_filter('plugin_action_links_' . TFS_BASENAME, array($this, 'add_plugin_action_links'));
        register_activation_hook(TFS_BASENAME, array($this, 'activation'));
    }

    /**
     * Run the activation of the plugin
     */
    public function activation()
    {
        self::init();
    }

    /**
     * Initialize the plugin
     */
    public static function init()
    {
    }

    /**
     * Load the text domain of the plugin
     */
    public function load_textdomain()
    {
        load_plugin_textdomain('divitorque', false, TFS_BASENAME_DIR . '/languages');
    }

    /**
     * Add plugin action links
     *
     * @param $links
     * @return array
     */
    public function add_plugin_action_links($links)
    {
        $links[] = '<a href="https://divitorque.com/docs/" target="_blank">' . __('Docs', 'divitorque') . '</a>';
        $links[] = '<a href="https://divitorque.com/pricing/" target="_blank">' . __('Get Torque Pro', 'divitorque') . '</a>';
        return $links;
    }

    /**
     *  Load the extensions.
     *
     * @return void
     */
    public function init_extension()
    {
        ModulesManager::get_instance();
    }
}

/**
 * Kicking this off by calling 'get_instance()' method
 */
Plugin::get_instance();
