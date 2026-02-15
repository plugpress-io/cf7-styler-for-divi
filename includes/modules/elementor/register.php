<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register CF7 Mate widgets with Elementor.
 */
function cf7m_register_elementor_widgets($widgets_manager) {
    require_once dirname(__FILE__) . '/class-cf7m-elementor-widget.php';
    $widgets_manager->register(new CF7M_Elementor_Widget());
}

add_action('elementor/widgets/register', 'cf7m_register_elementor_widgets');
