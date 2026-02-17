<?php
/**
 * Elementor builder: register CF7 Styler widget.
 *
 * @package CF7_Mate\Lite\Builders\Elementor
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register CF7 Mate widget with Elementor.
 *
 * @param \Elementor\Widgets_Manager $widgets_manager Elementor widgets manager.
 */
function cf7m_register_elementor_widgets($widgets_manager) {
    require_once __DIR__ . '/elementor-widget.php';
    $widgets_manager->register(new CF7M_Elementor_Widget());
}

add_action('elementor/widgets/register', 'cf7m_register_elementor_widgets');
