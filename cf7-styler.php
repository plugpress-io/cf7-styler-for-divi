<?php
/*
Plugin Name: Styler Mate for Contact Form 7
Plugin URI: https://cf7mate.com
Description: CF7 Mate is a plugin for Contact Form 7 that allows you to style your forms.
Version: 3.0.0
Author: Fahim Reza
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

// Auto-deactivate lite when the pro plugin is active.
if (!function_exists('cf7m_lite_maybe_self_deactivate')) {
    function cf7m_lite_maybe_self_deactivate()
    {
        if (!function_exists('is_plugin_active')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        if (is_plugin_active('cf7-mate-pro/cf7-mate-pro.php')) {
            deactivate_plugins(plugin_basename(__FILE__));

            if (isset($_GET['activate'])) {
                unset($_GET['activate']);
            }

            add_action('admin_notices', function () {
                echo '<div class="notice notice-warning is-dismissible"><p>';
                echo esc_html__('CF7 Styler (Lite) has been deactivated because CF7 Mate Pro is active.', 'cf7-styler-for-divi');
                echo '</p></div>';
            });

            return true;
        }

        return false;
    }

    // Check on every admin load (covers edge cases like manual DB activation).
    add_action('admin_init', 'cf7m_lite_maybe_self_deactivate');

    // Immediate check when the pro plugin is activated.
    add_action('activated_plugin', function ($plugin) {
        if ($plugin === 'cf7-mate-pro/cf7-mate-pro.php') {
            cf7m_lite_maybe_self_deactivate();
        }
    });
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
