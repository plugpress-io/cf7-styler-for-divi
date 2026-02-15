<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Elementor widget: CF7 Styler – display and style Contact Form 7 forms.
 */
class CF7M_Elementor_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'cf7m_cf7_styler';
    }

    public function get_title() {
        return esc_html__('CF7 Styler', 'cf7-styler-for-divi');
    }

    public function get_icon() {
        return 'eicon-form-horizontal';
    }

    public function get_categories() {
        return ['general'];
    }

    public function get_keywords() {
        return ['contact', 'form', 'cf7', 'contact form 7', 'styler'];
    }

    protected function register_controls() {
        $this->start_controls_section('content_section', [
            'label' => esc_html__('Content', 'cf7-styler-for-divi'),
            'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
        ]);

        $forms = cf7m_get_contact_forms();
        $this->add_control('cf7_form_id', [
            'label'   => esc_html__('Select Form', 'cf7-styler-for-divi'),
            'type'    => \Elementor\Controls_Manager::SELECT,
            'options' => $forms,
            'default' => '0',
        ]);

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        $form_id  = isset($settings['cf7_form_id']) ? (int) $settings['cf7_form_id'] : 0;

        if ($form_id <= 0) {
            if (\Elementor\Plugin::$instance->editor->is_edit_mode()) {
                echo '<div class="cf7m-elementor-placeholder">' . esc_html__('Please select a Contact Form 7 form.', 'cf7-styler-for-divi') . '</div>';
            }
            return;
        }

        $shortcode = do_shortcode(sprintf('[contact-form-7 id="%d"]', $form_id));
        echo '<div class="cf7m-elementor-widget dipe-cf7 dipe-cf7-styler">';
        echo $shortcode; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CF7 shortcode output
        echo '</div>';
    }
}
