<?php
/*
Plugin Name: Divi CF7 Styler (Free)
Plugin URI: https://diviextensions.com/divi-cf7-styler
Description: Effortlessly style Contact Form 7 to match your site's design.
Version: 2.3.3
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

define('DCS_VERSION', '2.3.3');
define('DCS_BASENAME', plugin_basename(__FILE__));
define('DCS_BASENAME_DIR', plugin_basename(__DIR__));
define('DCS_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('DCS_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once DCS_PLUGIN_PATH . 'includes/plugin.php';
