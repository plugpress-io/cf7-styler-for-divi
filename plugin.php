<?php

/**
 * Main plugin class that handles initialization and core functionality
 *
 * @package Divi_Forms_Styler
 */

namespace Divi_Forms_Styler;

use Divi_Forms_Styler\Admin_Notices;

/**
 * Main Plugin Class
 */
class Plugin
{

    /**
     * Singleton instance
     *
     * @var Plugin
     */
    private static $instance;

    /**
     * Plugin constants
     */
    const PLUGIN_PATH = TFS_PLUGIN_PATH;
    const BASENAME_DIR = TFS_BASENAME_DIR;
    const BASENAME = TFS_BASENAME;
    const DOCS_LINK = 'https://diviepic.com/docs/divi-form-styler';
    const PRICING_LINK = 'https://diviepic.com/pricing/';

    /**
     * Initialize the plugin
     */
    private function __construct()
    {
        $this->load_dependencies();
        $this->define_hooks();
    }

    /**
     * Get singleton instance
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
     * Initialize admin notices
     */
    public function init_admin_notices()
    {
        new Admin_Notices([
            'slug' => 'divi_forms_styler_cyber_sale',
            'title' => __('Cyber Sale - Lifetime Access to Divi Torque just $89!', 'divi-forms-styler'),
            'message' => __('Hurry! Get lifetime access to Divi Torque just $89/lifetime!  Limited Time Offer!!', 'divi-forms-styler'),
            'type' => 'success',
            'show_after' => 'minute',
            'screens' => ['plugins', 'dashboard'],
            'buttons' => [
                [
                    'text' => __('Claim Your Cyber Sale Offer Now', 'divi-forms-styler'),
                    'url' => 'https://diviepic.com/sale/',
                    'class' => 'button-primary',
                    'target' => '_blank'
                ]
            ]
        ]);
    }

    /**
     * Load required dependencies
     */
    private function load_dependencies()
    {
        include_once self::PLUGIN_PATH . 'includes/functions.php';
        require_once self::PLUGIN_PATH . 'includes/deprecated/cf7-helper.php';
        require_once self::PLUGIN_PATH . 'includes/admin.php';
        require_once self::PLUGIN_PATH . 'includes/assets-manager.php';
        require_once self::PLUGIN_PATH . 'includes/module-manager.php';

        // Upsell
        require_once self::PLUGIN_PATH . 'includes/upsell/notices.php';
    }

    /**
     * Define WordPress hooks
     */
    private function define_hooks()
    {
        add_action('plugins_loaded', [$this, 'load_textdomain'], 15);
        add_action('divi_extensions_init', [$this, 'init_extension']);
        add_filter('plugin_action_links_' . self::BASENAME, [$this, 'add_plugin_action_links']);
        register_activation_hook(self::BASENAME, [$this, 'on_activation']);
        add_action('admin_init', [$this, 'plugin_activation_redirect']);
        add_action('admin_init', [$this, 'check_for_update']);
        add_action('admin_init', [$this, 'init_admin_notices']);
    }

    /**
     * Initialize plugin components
     */
    public function init()
    {
        Assets_Manager::get_instance();
        Admin::get_instance();

        // Handle deprecated options
        $deprecated_options = get_option('dipe_options');
        if (isset($deprecated_options['grid']) && 'on' === $deprecated_options['grid']) {
            CF7_Helper::get_instance();
        }
    }

    /**
     * Store current plugin version
     */
    public function store_current_version()
    {
        update_option('tfs_plugin_current_version', TFS_VERSION);
    }

    /**
     * Check for plugin updates
     */
    public function check_for_update()
    {
        $stored_version = get_option('tfs_plugin_current_version');

        if (version_compare(TFS_VERSION, $stored_version, '>')) {
            update_option('tfs_plugin_do_activation_redirect', true);
            $this->store_current_version();
        }
    }

    /**
     * Handle plugin activation
     */
    public function on_activation()
    {
        $this->store_current_version();
        add_option('tfs_plugin_do_activation_redirect', true);
    }

    /**
     * Handle activation redirect
     */
    public function plugin_activation_redirect()
    {
        if (get_option('tfs_plugin_do_activation_redirect', false)) {
            delete_option('tfs_plugin_do_activation_redirect');

            if ($this->is_divi_torque_pro_installed()) {
                wp_redirect(admin_url('admin.php?page=divitorque-pro'));
                exit;
            }

            wp_redirect(admin_url('admin.php?page=divi-forms-styler'));
            exit;
        }
    }

    /**
     * Check if Divi Torque Pro is installed
     *
     * @return bool
     */
    public function is_divi_torque_pro_installed()
    {
        return defined('DTP_VERSION');
    }

    /**
     * Load plugin translations
     */
    public function load_textdomain()
    {
        load_plugin_textdomain('torque-forms-styler', false, self::BASENAME_DIR . '/languages');
    }

    /**
     * Add plugin action links
     *
     * @param array $links Existing links
     * @return array Modified links
     */
    public function add_plugin_action_links($links)
    {
        $links[] = sprintf(
            '<a href="%s" target="_blank" style="color: #197efb;font-weight: 600;">%s</a>',
            self::DOCS_LINK,
            __('Docs', 'torque-forms-styler')
        );
        $links[] = sprintf(
            '<a href="%s" target="_blank" style="color: #FF6900;font-weight: 600;">%s</a>',
            self::PRICING_LINK,
            __('Get Epic Suite', 'torque-forms-styler')
        );
        return $links;
    }

    /**
     * Initialize Divi extension
     */
    public function init_extension()
    {
        Module_Manager::get_instance();
    }
}

Plugin::get_instance();
