<?php
/**
 * Bricks builder: register CF7 Styler element.
 *
 * @package CF7_Mate\Lite\Builders\Bricks
 * @since   3.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register CF7 Mate element with Bricks.
 */
function cf7m_register_bricks_element() {
    if (!class_exists('\Bricks\Elements')) {
        return;
    }

    $element_file = __DIR__ . '/bricks-element.php';

    if (file_exists($element_file)) {
        \Bricks\Elements::register_element($element_file);
    }
}

add_action('init', 'cf7m_register_bricks_element', 11);
