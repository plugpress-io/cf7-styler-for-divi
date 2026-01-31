<?php
/*
Plugin Name: CF7 Mate for Divi
Plugin URI: https://divipeople.com/cf7-mate
Description: Built for CF7 power users—your all-in-one toolkit for Contact Form 7.
Version: 3.0.0
Author: PlugPress
Author URI:  https://divipeople.com
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

/**
 * Register CF7M custom form tags directly.
 * This ensures tags work regardless of Pro loader status.
 */
add_action('wpcf7_init', 'cf7m_register_custom_form_tags', 10);

function cf7m_register_custom_form_tags() {
    if (!function_exists('wpcf7_add_form_tag')) {
        return;
    }
    wpcf7_add_form_tag(
        array('cf7m-star', 'cf7m-star*'),
        'cf7m_star_rating_handler',
        array('name-attr' => true)
    );
    wpcf7_add_form_tag(
        array('cf7m-range', 'cf7m-range*'),
        'cf7m_range_slider_handler',
        array('name-attr' => true)
    );
}

/**
 * Star Rating: parse option from CF7 tag (e.g. "max:5" or "default:0").
 */
function cf7m_star_parse_option($options, $key, $default) {
    $prefix = $key . ':';
    foreach ((array) $options as $opt) {
        if (is_string($opt) && strpos($opt, $prefix) === 0) {
            return (int) substr($opt, strlen($prefix));
        }
    }
    return $default;
}

/**
 * Star Rating tag handler. Renders [cf7m-star name max:5 default:0].
 *
 * @param WPCF7_FormTag $tag
 * @return string
 */
function cf7m_star_rating_handler($tag) {
    $name = trim((string) $tag->name);
    if ($name === '') {
        $name = 'rating';
    }
    $max = cf7m_star_parse_option($tag->options, 'max', 5);
    $default = cf7m_star_parse_option($tag->options, 'default', 0);
    $max = max(1, min(10, $max));
    $default = max(0, min($default, $max));

    $star_svg = '<svg class="cf7m-star-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

    $out = '<span class="wpcf7-form-control-wrap wpcf7-form-control-wrap-' . esc_attr($name) . '" data-name="' . esc_attr($name) . '">';
    $out .= '<span class="cf7m-star-rating" data-max="' . $max . '" data-value="' . $default . '" data-name="' . esc_attr($name) . '" role="group" aria-label="' . esc_attr__('Star rating', 'cf7-styler-for-divi') . '">';
    $out .= '<input type="hidden" name="' . esc_attr($name) . '" value="' . $default . '" class="cf7m-star-input" data-cf7m-star-input>';
    for ($i = 1; $i <= $max; $i++) {
        $active = $i <= $default ? ' cf7m-star--on' : '';
        $out .= '<button type="button" class="cf7m-star' . $active . '" data-value="' . $i . '" aria-label="' . sprintf(esc_attr__('Rate %d star', 'cf7-styler-for-divi'), $i) . '">' . $star_svg . '</button>';
    }
    $out .= '</span></span>';
    return $out;
}

/**
 * Range Slider tag handler.
 *
 * @param WPCF7_FormTag $tag
 * @return string HTML output
 */
function cf7m_range_slider_handler($tag) {
    $name = $tag->name;
    if (empty($name)) {
        $name = 'amount';
    }
    
    $min = 0;
    $max = 100;
    $step = 1;
    $default = 50;
    $prefix = '';
    $suffix = '';
    
    // Parse options
    $min_opt = $tag->get_option('min', 'int', true);
    if ($min_opt !== false && $min_opt !== null) {
        $min = is_array($min_opt) ? (int) reset($min_opt) : (int) $min_opt;
    }
    
    $max_opt = $tag->get_option('max', 'int', true);
    if ($max_opt !== false && $max_opt !== null) {
        $max = is_array($max_opt) ? (int) reset($max_opt) : (int) $max_opt;
    }
    
    $step_opt = $tag->get_option('step', 'int', true);
    if ($step_opt !== false && $step_opt !== null) {
        $step = is_array($step_opt) ? (int) reset($step_opt) : (int) $step_opt;
    }
    
    $default_opt = $tag->get_option('default', 'int', true);
    if ($default_opt !== false && $default_opt !== null) {
        $default = is_array($default_opt) ? (int) reset($default_opt) : (int) $default_opt;
    }
    
    $prefix_opt = $tag->get_option('prefix', '', true);
    if ($prefix_opt) {
        $prefix = is_array($prefix_opt) ? (string) reset($prefix_opt) : (string) $prefix_opt;
    }
    
    $suffix_opt = $tag->get_option('suffix', '', true);
    if ($suffix_opt) {
        $suffix = is_array($suffix_opt) ? (string) reset($suffix_opt) : (string) $suffix_opt;
    }
    
    // Build HTML
    $html = sprintf(
        '<span class="wpcf7-form-control-wrap" data-name="%s">',
        esc_attr($name)
    );
    
    $html .= sprintf(
        '<span class="dcs-range-slider" data-prefix="%s" data-suffix="%s">',
        esc_attr($prefix),
        esc_attr($suffix)
    );
    
    $html .= sprintf(
        '<input type="range" name="%s" min="%d" max="%d" step="%d" value="%d" class="cf7m-range-input">',
        esc_attr($name),
        $min,
        $max,
        $step,
        $default
    );
    
    $html .= sprintf(
        '<span class="dcs-range-value">%s</span>',
        esc_html($prefix . $default . $suffix)
    );
    
    $html .= '</span></span>';
    
    return $html;
}

/**
 * Enqueue frontend assets for CF7M custom fields.
 */
add_action('wp_enqueue_scripts', 'cf7m_enqueue_pro_assets');

function cf7m_enqueue_pro_assets() {
    // Always enqueue on pages/posts - CF7 might be added via shortcode
    // CSS and JS are small enough that this is acceptable
    $css_file = CF7M_PLUGIN_PATH . 'assets/pro/css/cf7m-pro-forms.css';
    $star_js = CF7M_PLUGIN_PATH . 'assets/pro/js/cf7m-star-rating.js';
    $range_js = CF7M_PLUGIN_PATH . 'assets/pro/js/cf7m-range-slider.js';
    
    if (file_exists($css_file)) {
        wp_enqueue_style(
            'cf7m-pro-forms',
            CF7M_PLUGIN_URL . 'assets/pro/css/cf7m-pro-forms.css',
            array(),
            CF7M_VERSION
        );
    }
    
    if (file_exists($star_js)) {
        wp_enqueue_script(
            'cf7m-star-rating',
            CF7M_PLUGIN_URL . 'assets/pro/js/cf7m-star-rating.js',
            array(),
            CF7M_VERSION,
            true
        );
    }
    
    if (file_exists($range_js)) {
        wp_enqueue_script(
            'cf7m-range-slider',
            CF7M_PLUGIN_URL . 'assets/pro/js/cf7m-range-slider.js',
            array(),
            CF7M_VERSION,
            true
        );
    }
}

/**
 * Validation for star rating field.
 */
add_filter('wpcf7_validate_cf7m-star', 'cf7m_star_rating_validation', 10, 2);
add_filter('wpcf7_validate_cf7m-star*', 'cf7m_star_rating_validation', 10, 2);

function cf7m_star_rating_validation($result, $tag) {
    $name = trim((string) $tag->name);
    if ($name === '') {
        $name = 'rating';
    }
    $value = isset($_POST[$name]) ? (int) $_POST[$name] : 0;
    if ($tag->is_required() && $value < 1) {
        $result->invalidate($tag, wpcf7_get_message('invalid_required'));
    }
    return $result;
}

/**
 * Validation for range slider field.
 */
add_filter('wpcf7_validate_cf7m-range', 'cf7m_range_slider_validation', 10, 2);
add_filter('wpcf7_validate_cf7m-range*', 'cf7m_range_slider_validation', 10, 2);

function cf7m_range_slider_validation($result, $tag) {
    $name = $tag->name;
    $value = isset($_POST[$name]) ? sanitize_text_field($_POST[$name]) : '';
    
    if ($tag->is_required() && $value === '') {
        $result->invalidate($tag, wpcf7_get_message('invalid_required'));
    }
    
    return $result;
}
