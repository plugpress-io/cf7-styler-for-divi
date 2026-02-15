<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register CF7 Mate element with Bricks builder.
 */
function cf7m_register_bricks_element() {
    if (!class_exists('\Bricks\Elements')) {
        return;
    }
    $file = dirname(__FILE__) . '/class-cf7m-bricks-element.php';
    \Bricks\Elements::register_element($file, 'CF7M_Bricks_Element', 'cf7-styler');
}

add_action('init', 'cf7m_register_bricks_element', 11);
