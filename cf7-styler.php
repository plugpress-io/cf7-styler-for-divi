<?php
/*
Plugin Name: Contact Form 7 Styler
Plugin URI: https://diviextensions.com/divi-cf7-styler
Description: Effortlessly style Contact Form 7, Gravity Forms, and Fluent Forms to match your site's design.
Version: 2.3.0
Author: DiviExtensions
Author URI:  https://diviextensions.com
License: GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: cf7-styler-for-divi
Domain Path: /languages
*/

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

define('DCS_VERSION', '2.3.0');
define('DCS_BASENAME', plugin_basename(__FILE__));
define('DCS_BASENAME_DIR', plugin_basename(__DIR__));
define('DCS_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('DCS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('DCS_PLUGIN_ASSETS', trailingslashit(DCS_PLUGIN_URL . 'assets'));

require_once 'includes/plugin.php';
