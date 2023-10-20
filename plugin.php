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

    const PLUGIN_PATH = TFS_PLUGIN_PATH;
    const BASENAME_DIR = TFS_BASENAME_DIR;
    const BASENAME = TFS_BASENAME;
    const DOCS_LINK = 'https://divitorque.com/docs/';
    const PRICING_LINK = 'https://divitorque.com/pricing/';

    /**
     * Plugin constructor.
     */
    private function __construct()
    {
        $this->load_dependencies();
        $this->define_hooks();
    }

    /**
     * Get an instance of the Plugin
     *
     * @return Plugin
     */
    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
            self::$instance->init();
        }

        return self::$instance;
    }

    /**
     * Load required files
     */
    private function load_dependencies()
    {
        include_once self::PLUGIN_PATH . 'includes/functions.php';
        require_once self::PLUGIN_PATH . 'includes/deprecated/cf7-helper.php';
        require_once self::PLUGIN_PATH . 'includes/assets-manager.php';
        require_once self::PLUGIN_PATH . 'includes/module-manager.php';
    }

    /**
     * Define WP hooks
     */
    private function define_hooks()
    {
        add_action('plugins_loaded', [$this, 'load_textdomain'], 15);
        add_action('divi_extensions_init', [$this, 'init_extension']);
        add_filter('plugin_action_links_' . self::BASENAME, [$this, 'add_plugin_action_links']);
        register_activation_hook(self::BASENAME, [$this, 'on_activation']);
    }

    /**
     * Initialize required instances
     */
    public function init()
    {
        Assets_Manager::get_instance();

        $deprecated_options = get_option('dipe_options');
        if (isset($deprecated_options['grid']) && 'on' === $deprecated_options['grid']) {
            CF7_Helper::get_instance();
        }
    }

    /**
     * On plugin activation
     */
    public function on_activation()
    {
        // To be implemented
    }

    /**
     * Load plugin translations
     */
    public function load_textdomain()
    {
        load_plugin_textdomain('divitorque', false, self::BASENAME_DIR . '/languages');
    }

    /**
     * Add action links for the plugin
     *
     * @param array $links
     * @return array
     */
    public function add_plugin_action_links($links)
    {

        $links[] = sprintf('<a href="%s" target="_blank" style="color: #197efb;font-weight: 600;">%s</a>', self::DOCS_LINK, __('Docs', 'divitorque'));
        $links[] = sprintf('<a href="%s" target="_blank" style="color: #FF6900;font-weight: 600;">%s</a>', self::PRICING_LINK, __('Get Torque Pro', 'divitorque'));
        return $links;
    }

    /**
     * Initialize extension
     */
    public function init_extension()
    {
        Module_Manager::get_instance();
    }
}

Plugin::get_instance();
