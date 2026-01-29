<?php
/*
Plugin Name: CF7 Mate for Divi
Plugin URI: https://divipeople.com/cf7-mate
Description: The complete Contact Form 7 companion for Divi - style forms, add entries, star ratings, range sliders, and more.
Version: 3.0.0
Author: PlugPress
Author URI:  https://divipeople.com
License: GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: cf7-styler-for-divi
Domain Path: /languages
*/

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

define('DCS_VERSION', '3.0.0');
define('DCS_BASENAME', plugin_basename(__FILE__));
define('DCS_BASENAME_DIR', plugin_basename(__DIR__));
define('DCS_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('DCS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('DCS_MODULES_JSON_PATH', DCS_PLUGIN_PATH . 'modules-json/');
define('DCS_SELF_HOSTED_ACTIVE', 'true');

// Freemius
if ('true' === DCS_SELF_HOSTED_ACTIVE) {
    require_once DCS_PLUGIN_PATH . 'freemius.php'; // phpcs:ignore
}

require_once DCS_PLUGIN_PATH . 'includes/plugin.php';
