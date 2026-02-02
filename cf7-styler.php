<?php
/*
Plugin Name: CF7 Mate for Divi
Plugin URI: https://divipeople.com/cf7-mate
Description: Built for CF7 power users—your all-in-one toolkit for Contact Form 7.
Version: 3.0.0
Author: PlugPress
Author URI:  https://plugpress.io
License: GPL2
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
define('CF7M_SELF_HOSTED_ACTIVE', 'true');

// Freemius
if ('true' === CF7M_SELF_HOSTED_ACTIVE) {
    require_once CF7M_PLUGIN_PATH . 'freemius.php';
}

require_once CF7M_PLUGIN_PATH . 'includes/plugin.php';
