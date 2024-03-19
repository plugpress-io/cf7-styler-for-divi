<?php
/*
Plugin Name: Divi Forms Styler
Plugin URI: https://diviepic.com
Description: Effortlessly style Contact Form 7, Gravity Forms, and Fluent Forms to match your site's design.
Version: 2.1.1
Author: DiviEpic
Author URI:  https://diviepic.com
License: GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: torque-forms-styler
Domain Path: /languages
*/

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

define('TFS_VERSION', '2.1.1');
define('TFS_BASENAME', plugin_basename(__FILE__));
define('TFS_BASENAME_DIR', plugin_basename(__DIR__));
define('TFS_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('TFS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('TFS_PLUGIN_ASSETS', trailingslashit(TFS_PLUGIN_URL . 'assets'));

require_once 'plugin.php';
