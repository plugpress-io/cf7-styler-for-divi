<?php

/**
 * Main plugin class that handles initialization and core functionality
 *
 * @package Divi_Form_Styler
 */

namespace Divi_Form_Styler;

use Divi_Form_Styler\Admin_Notices;

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

    const DOCS_LINK = 'https://diviepic.com/docs/';
    const PRICING_LINK = 'https://diviepic.com/divi-torque-pro/';

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
        // Upsell
        new Admin_Notices([
            'slug' => 'divi_form_styler_cyber_sale',
            'title' => __('Only 50 Spots!', 'form-styler-for-divi'),
            'message' => __('Hurry! Get Divi Torque Pro just $89!  Limited Time Offer!!', 'form-styler-for-divi'),
            'type' => 'success',
            'show_after' => 'hour',
            'screens' => ['plugins', 'dashboard'],
            'buttons' => [
                [
                    'text' => __('Claim Your Cyber Sale Offer Now', 'form-styler-for-divi'),
                    'url' => 'https://diviepic.com/divi-torque-pro/',
                    'class' => 'button-primary',
                    'target' => '_blank'
                ]
            ]
        ]);

        // new Admin_Notices([
        //     'slug' => 'divi_form_styler_ask_review',
        //     'title' => __('Please rate and review Contact Form Styler for Divi!', 'form-styler-for-divi'),
        //     'message' => __('We hope you\'re enjoying using Contact Form Styler for Divi. Please take a moment to rate and review the plugin. Your feedback helps us improve and serve you better!', 'form-styler-for-divi'),
        //     'type' => 'success',
        //     'show_after' => 'hour',
        //     'screens' => ['plugins', 'dashboard'],
        //     'buttons' => [
        //         [
        //             'text' => __('Rate and Review', 'form-styler-for-divi'),
        //             'url' => 'https://wordpress.org/support/plugin/cf7-styler-for-divi/reviews/?filter=5#new-post',
        //             'class' => 'button-primary',
        //             'target' => '_blank'
        //         ],
        //     ]
        // ]);
    }

    /**
     * Load required dependencies
     */
    private function load_dependencies()
    {
        // Common
        include_once self::PLUGIN_PATH . 'includes/functions.php';

        // Assets
        include_once self::PLUGIN_PATH . 'includes/assets-manager.php';

        // Modules
        include_once self::PLUGIN_PATH . 'includes/module-manager.php';

        // Required
        include_once self::PLUGIN_PATH . 'includes/admin.php';

        // CF7 Grid
        include_once self::PLUGIN_PATH . 'includes/cf7-grid-helper.php';

        // Upsell
        include_once self::PLUGIN_PATH . 'includes/upsell/notices.php';
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
    }

    /**
     * Store current plugin version
     */
    public function store_current_version()
    {
        update_option('divi_form_styler_current_version', TFS_VERSION);

        // Install Date
        if (!get_option('divi_form_styler_install_date')) {
            update_option('divi_form_styler_install_date', time());
        }
    }

    /**
     * Check for plugin updates
     */
    public function check_for_update()
    {
        $stored_version = get_option('divi_form_styler_current_version');

        if (version_compare(TFS_VERSION, $stored_version, '>')) {
            $this->store_current_version();
        }
    }

    /**
     * Handle plugin activation
     */
    public function on_activation()
    {
        $this->store_current_version();
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
        load_plugin_textdomain('form-styler-for-divi', false, self::BASENAME_DIR . '/languages');
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
            __('Docs', 'form-styler-for-divi')
        );
        $links[] = sprintf(
            '<a href="%s" target="_blank" style="color: #FF6900;font-weight: 600;">%s</a>',
            self::PRICING_LINK,
            __('Get Divi Torque Pro', 'form-styler-for-divi')
        );
        return $links;
    }

    /**
     * Initialize Divi extension
     */
    public function init_extension()
    {
        add_action('et_builder_ready', [$this, 'load_modules'], 9);
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

Plugin::get_instance();
