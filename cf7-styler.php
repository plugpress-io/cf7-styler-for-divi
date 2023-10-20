<?php
/*
Plugin Name: Torque Forms Styler For Divi
Plugin URI: https://divitorque.com
Version: 2.0.0
Author: Divi Torque
Author URI:  https://divitorque.com
License: GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: torque-forms-styler
Domain Path: /languages
*/

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

define('TFS_VERSION', '1.4.0');
define('TFS_BASENAME', plugin_basename(__FILE__));
define('TFS_BASENAME_DIR', plugin_basename(__DIR__));
define('TFS_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('TFS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('TFS_PLUGIN_ASSETS', trailingslashit(TFS_PLUGIN_URL . 'assets'));

// load_plugin_textdomain(
//     'torque-forms-styler',
//     false,
//     dirname(plugin_basename(__FILE__)) . '/languages/'
// );

// if (!class_exists('DT_FORMS_STYLER')) {

//     final class DT_FORMS_STYLER
//     {

//         private static $instance;

//         private function __construct()
//         {
//             register_activation_hook(__FILE__, array($this, 'activate'));
//         }

//         public static function instance()
//         {
//             if (!isset(self::$instance) && !(self::$instance instanceof DT_FORMS_STYLER)) {
//                 self::$instance = new DT_FORMS_STYLER();
//                 self::$instance->init();
//                 self::$instance->includes();
//             }

//             return self::$instance;
//         }

//         private function init()
//         {
//             add_action('divi_extensions_init', array($this, 'initialize_extension'));
//             add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
//         }

//         public function activate()
//         {
//             update_option('dipe_version', TFS_FORMS_STYLER_VERSION);

//             if (get_option('_TFS_FORMS_STYLER_installed_time') === false) {
//                 update_option('_TFS_FORMS_STYLER_installed_time', strtotime('now'));
//             }
//         }

//         public function enqueue_scripts()
//         {
//             $options = get_option('dipe_options');
//             $grid    = isset($options['grid']) ? $options['grid'] : 'off';

//             if ('on' === $grid) {
//                 wp_enqueue_style('dipe-grid', TFS_FORMS_STYLER_ASSETS_URL . 'css/cf7-grid.css');
//             }

//             wp_enqueue_style('dipe-module', TFS_FORMS_STYLER_ASSETS_URL . 'css/module.css');
//         }

//         private function includes()
//         {
//             $options = get_option('dipe_options');
//             $grid    = isset($options['grid']) ? $options['grid'] : 'off';

//             require_once TFS_FORMS_STYLER_PATH . 'includes/functions.php';

//             if ('on' === $grid) {
//                 require_once TFS_FORMS_STYLER_PATH . 'includes/shortcode.php';
//                 require_once TFS_FORMS_STYLER_PATH . 'includes/tag.php';
//             }

//             if (is_admin()) {
//                 require_once TFS_FORMS_STYLER_PATH . 'includes/admin/admin.php';
//                 require_once TFS_FORMS_STYLER_PATH . 'includes/admin/rollback.php';
//             }
//         }

//         public function initialize_extension()
//         {
//             require_once TFS_FORMS_STYLER_PATH . 'includes/Cf7StylerMain.php';
//         }
//     }
// }

// function TFS_FORMS_STYLER_styler_module()
// {
//     return DT_FORMS_STYLER::instance();
// }

// TFS_FORMS_STYLER_styler_module();
