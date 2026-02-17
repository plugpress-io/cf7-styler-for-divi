<?php
/*
Plugin Name: Styler Mate for Contact Form 7
Plugin URI: https://cf7mate.com
Description: CF7 Mate is a plugin for Contact Form 7 that allows you to style your forms with Divi's visual builder.
Version: 3.0.0
Author: PlugPress
Author URI:  https://plugpress.io
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: cf7-styler-for-divi
Domain Path: /languages

@fs_premium_only /includes/pro/, /assets/pro/
*/

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

define('CF7M_VERSION', '3.0.0');
define('CF7M_BASENAME', plugin_basename(__FILE__));
define('CF7M_BASENAME_DIR', plugin_basename(__DIR__));
define('CF7M_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('CF7M_PLUGIN_URL', plugin_dir_url(__FILE__));
define('CF7M_MODULES_JSON_PATH', CF7M_PLUGIN_PATH . 'modules-json/');
define('CF7M_URL_MAIN', 'https://cf7mate.com');
define('CF7M_URL_DOCS', 'https://cf7mate.com/docs');
define('CF7M_URL_PRICING', 'https://cf7mate.com/pricing');

// Freemius
require_once CF7M_PLUGIN_PATH . 'freemius.php';

require_once CF7M_PLUGIN_PATH . 'includes/plugin.php';
