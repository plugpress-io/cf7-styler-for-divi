<?php
/*
Plugin Name: Form Styler for Divi
Plugin URI: https://diviepic.com
Description: Effortlessly style Contact Form 7, Gravity Forms, and Fluent Forms to match your site's design.
Version: 2.2.0
Author: DiviEpic
Author URI:  https://diviepic.com
License: GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: form-styler-for-divi
Domain Path: /languages
*/

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

define('TFS_VERSION', '2.2.0');
define('TFS_BASENAME', plugin_basename(__FILE__));
define('TFS_BASENAME_DIR', plugin_basename(__DIR__));
define('TFS_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('TFS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('TFS_PLUGIN_ASSETS', trailingslashit(TFS_PLUGIN_URL . 'assets'));

require_once 'plugin.php';

add_action('wpcf7_admin_init', 'custom_tag_generator', 15);

function custom_tag_generator()
{
    // Check if the tag generator class exists
    if (class_exists('WPCF7_TagGenerator')) {
        $tag_generator = WPCF7_TagGenerator::get_instance();
        $tag_generator->add(
            'custom_text',
            __('Custom Text Field', 'contact-form-7'),
            'jj'
        );
    }
}

// Function to define the custom tag form in the Contact Form 7 editor
function custom_text_tag_generator($contact_form, $args = '')
{
    $args = wp_parse_args($args, array());
}
