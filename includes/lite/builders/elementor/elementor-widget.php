<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Elementor widget: CF7 Styler – display and style Contact Form 7 forms.
 *
 * @package CF7_Mate\Lite\Builders\Elementor
 * @since   3.0.0
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

    public function get_style_depends() {
        return ['cf7m-elementor-style'];
    }

    protected function register_controls() {
        $this->register_content_controls();
        $this->register_form_header_controls();
        $this->register_common_style_controls();
        $this->register_field_style_controls();
        $this->register_label_style_controls();
        $this->register_placeholder_style_controls();
        $this->register_radio_checkbox_controls();
        $this->register_button_style_controls();
        $this->register_message_style_controls();
    }

    /**
     * Content tab: Form selection & header.
     */
    private function register_content_controls() {
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

    /**
     * Content tab: Form header settings.
     */
    private function register_form_header_controls() {
        $this->start_controls_section('form_header_section', [
            'label' => esc_html__('Form Header', 'cf7-styler-for-divi'),
            'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
        ]);

        $this->add_control('use_form_header', [
            'label'        => esc_html__('Show Form Header', 'cf7-styler-for-divi'),
            'type'         => \Elementor\Controls_Manager::SWITCHER,
            'label_on'     => esc_html__('Yes', 'cf7-styler-for-divi'),
            'label_off'    => esc_html__('No', 'cf7-styler-for-divi'),
            'return_value' => 'yes',
            'default'      => '',
        ]);

        $this->add_control('form_header_title', [
            'label'     => esc_html__('Header Title', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::TEXT,
            'default'   => '',
            'condition' => ['use_form_header' => 'yes'],
        ]);

        $this->add_control('form_header_text', [
            'label'     => esc_html__('Header Text', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::TEXTAREA,
            'default'   => '',
            'condition' => ['use_form_header' => 'yes'],
        ]);

        $this->add_control('use_icon', [
            'label'        => esc_html__('Use Icon', 'cf7-styler-for-divi'),
            'type'         => \Elementor\Controls_Manager::SWITCHER,
            'label_on'     => esc_html__('Yes', 'cf7-styler-for-divi'),
            'label_off'    => esc_html__('No', 'cf7-styler-for-divi'),
            'return_value' => 'yes',
            'default'      => '',
            'condition'    => ['use_form_header' => 'yes'],
        ]);

        $this->add_control('header_icon', [
            'label'     => esc_html__('Header Icon', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::ICONS,
            'default'   => [
                'value'   => 'fas fa-envelope',
                'library' => 'fa-solid',
            ],
            'condition' => [
                'use_form_header' => 'yes',
                'use_icon'        => 'yes',
            ],
        ]);

        $this->add_control('header_image', [
            'label'     => esc_html__('Header Image', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::MEDIA,
            'condition' => [
                'use_form_header' => 'yes',
                'use_icon!'       => 'yes',
            ],
        ]);

        // Form Header style controls.
        $this->add_control('header_style_heading', [
            'label'     => esc_html__('Header Style', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::HEADING,
            'separator' => 'before',
            'condition' => ['use_form_header' => 'yes'],
        ]);

        $this->add_control('form_header_bg', [
            'label'     => esc_html__('Header Background', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .cf7m-form-header-container' => 'background-color: {{VALUE}};',
            ],
            'condition' => ['use_form_header' => 'yes'],
        ]);

        $this->add_responsive_control('form_header_padding', [
            'label'      => esc_html__('Header Padding', 'cf7-styler-for-divi'),
            'type'       => \Elementor\Controls_Manager::DIMENSIONS,
            'size_units' => ['px', 'em', '%'],
            'selectors'  => [
                '{{WRAPPER}} .cf7m-form-header-container' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
            ],
            'condition'  => ['use_form_header' => 'yes'],
        ]);

        $this->add_responsive_control('form_header_bottom_spacing', [
            'label'      => esc_html__('Bottom Spacing', 'cf7-styler-for-divi'),
            'type'       => \Elementor\Controls_Manager::SLIDER,
            'size_units' => ['px'],
            'range'      => [
                'px' => ['min' => 0, 'max' => 100, 'step' => 1],
            ],
            'selectors'  => [
                '{{WRAPPER}} .cf7m-form-header-container' => 'margin-bottom: {{SIZE}}{{UNIT}};',
            ],
            'condition'  => ['use_form_header' => 'yes'],
        ]);

        $this->add_control('form_header_img_bg', [
            'label'     => esc_html__('Image/Icon Background', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .cf7m-form-header-icon, {{WRAPPER}} .cf7m-form-header-image' => 'background-color: {{VALUE}};',
            ],
            'condition' => ['use_form_header' => 'yes'],
        ]);

        $this->add_control('form_header_icon_color', [
            'label'     => esc_html__('Icon Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .cf7m-form-header-icon i'   => 'color: {{VALUE}};',
                '{{WRAPPER}} .cf7m-form-header-icon svg' => 'fill: {{VALUE}};',
            ],
            'condition' => [
                'use_form_header' => 'yes',
                'use_icon'        => 'yes',
            ],
        ]);

        $this->add_group_control(\Elementor\Group_Control_Typography::get_type(), [
            'name'      => 'header_title_typography',
            'label'     => esc_html__('Title Typography', 'cf7-styler-for-divi'),
            'selector'  => '{{WRAPPER}} .cf7m-form-header-title',
            'condition' => ['use_form_header' => 'yes'],
        ]);

        $this->add_control('header_title_color', [
            'label'     => esc_html__('Title Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .cf7m-form-header-title' => 'color: {{VALUE}};',
            ],
            'condition' => ['use_form_header' => 'yes'],
        ]);

        $this->add_group_control(\Elementor\Group_Control_Typography::get_type(), [
            'name'      => 'header_text_typography',
            'label'     => esc_html__('Text Typography', 'cf7-styler-for-divi'),
            'selector'  => '{{WRAPPER}} .cf7m-form-header-text',
            'condition' => ['use_form_header' => 'yes'],
        ]);

        $this->add_control('header_text_color', [
            'label'     => esc_html__('Text Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .cf7m-form-header-text' => 'color: {{VALUE}};',
            ],
            'condition' => ['use_form_header' => 'yes'],
        ]);

        $this->end_controls_section();
    }

    /**
     * Style tab: Common form styles.
     */
    private function register_common_style_controls() {
        $this->start_controls_section('common_style_section', [
            'label' => esc_html__('Form Common', 'cf7-styler-for-divi'),
            'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
        ]);

        $this->add_control('form_bg', [
            'label'     => esc_html__('Form Background', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler' => 'background-color: {{VALUE}};',
            ],
        ]);

        $this->add_responsive_control('form_padding', [
            'label'      => esc_html__('Form Padding', 'cf7-styler-for-divi'),
            'type'       => \Elementor\Controls_Manager::DIMENSIONS,
            'size_units' => ['px', 'em', '%'],
            'selectors'  => [
                '{{WRAPPER}} .dipe-cf7-styler' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
            ],
        ]);

        $this->add_group_control(\Elementor\Group_Control_Border::get_type(), [
            'name'     => 'form_border',
            'label'    => esc_html__('Form Border', 'cf7-styler-for-divi'),
            'selector' => '{{WRAPPER}} .dipe-cf7-styler',
        ]);

        $this->add_responsive_control('form_border_radius', [
            'label'      => esc_html__('Form Border Radius', 'cf7-styler-for-divi'),
            'type'       => \Elementor\Controls_Manager::DIMENSIONS,
            'size_units' => ['px', '%'],
            'selectors'  => [
                '{{WRAPPER}} .dipe-cf7-styler' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
            ],
        ]);

        $this->add_control('use_form_button_fullwidth', [
            'label'        => esc_html__('Fullwidth Button', 'cf7-styler-for-divi'),
            'type'         => \Elementor\Controls_Manager::SWITCHER,
            'label_on'     => esc_html__('Yes', 'cf7-styler-for-divi'),
            'label_off'    => esc_html__('No', 'cf7-styler-for-divi'),
            'return_value' => 'yes',
            'default'      => '',
            'selectors'    => [
                '{{WRAPPER}} .cf7m-button-fullwidth .wpcf7-form input[type=submit]' => 'width: 100%;',
            ],
        ]);

        $this->add_responsive_control('button_alignment', [
            'label'     => esc_html__('Button Alignment', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::CHOOSE,
            'options'   => [
                'left'   => [
                    'title' => esc_html__('Left', 'cf7-styler-for-divi'),
                    'icon'  => 'eicon-text-align-left',
                ],
                'center' => [
                    'title' => esc_html__('Center', 'cf7-styler-for-divi'),
                    'icon'  => 'eicon-text-align-center',
                ],
                'right'  => [
                    'title' => esc_html__('Right', 'cf7-styler-for-divi'),
                    'icon'  => 'eicon-text-align-right',
                ],
            ],
            'default'   => 'left',
            'selectors' => [
                '{{WRAPPER}} .cf7m-elementor-widget .wpcf7-form p:last-of-type' => 'text-align: {{VALUE}};',
            ],
            'condition' => ['use_form_button_fullwidth!' => 'yes'],
        ]);

        $this->end_controls_section();
    }

    /**
     * Style tab: Form field styles.
     */
    private function register_field_style_controls() {
        $this->start_controls_section('field_style_section', [
            'label' => esc_html__('Form Fields', 'cf7-styler-for-divi'),
            'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
        ]);

        $this->add_responsive_control('form_field_height', [
            'label'      => esc_html__('Field Height', 'cf7-styler-for-divi'),
            'type'       => \Elementor\Controls_Manager::SLIDER,
            'size_units' => ['px'],
            'range'      => [
                'px' => ['min' => 0, 'max' => 100, 'step' => 1],
            ],
            'selectors'  => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 input:not([type=submit]):not([type=checkbox]):not([type=radio]), {{WRAPPER}} .dipe-cf7-styler .wpcf7 select' => 'height: {{SIZE}}{{UNIT}};',
            ],
        ]);

        $this->add_responsive_control('form_field_padding', [
            'label'      => esc_html__('Field Padding', 'cf7-styler-for-divi'),
            'type'       => \Elementor\Controls_Manager::DIMENSIONS,
            'size_units' => ['px', 'em', '%'],
            'default'    => [
                'top'    => '10',
                'right'  => '15',
                'bottom' => '10',
                'left'   => '15',
                'unit'   => 'px',
            ],
            'selectors'  => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 input:not([type=submit]):not([type=checkbox]):not([type=radio]), {{WRAPPER}} .dipe-cf7-styler .wpcf7 select, {{WRAPPER}} .dipe-cf7-styler .wpcf7 textarea' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
            ],
        ]);

        $this->add_control('form_field_bg_color', [
            'label'     => esc_html__('Background Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'default'   => '#f5f5f5',
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 input:not([type=submit]):not([type=checkbox]):not([type=radio]), {{WRAPPER}} .dipe-cf7-styler .wpcf7 select, {{WRAPPER}} .dipe-cf7-styler .wpcf7 textarea' => 'background-color: {{VALUE}};',
            ],
        ]);

        $this->add_control('form_field_text_color', [
            'label'     => esc_html__('Text Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 input:not([type=submit]):not([type=checkbox]):not([type=radio]), {{WRAPPER}} .dipe-cf7-styler .wpcf7 select, {{WRAPPER}} .dipe-cf7-styler .wpcf7 textarea' => 'color: {{VALUE}};',
            ],
        ]);

        $this->add_control('form_field_active_color', [
            'label'     => esc_html__('Focus Border Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 input:not([type=submit]):focus, {{WRAPPER}} .dipe-cf7-styler .wpcf7 select:focus, {{WRAPPER}} .dipe-cf7-styler .wpcf7 textarea:focus' => 'border-color: {{VALUE}};',
            ],
        ]);

        $this->add_group_control(\Elementor\Group_Control_Border::get_type(), [
            'name'     => 'field_border',
            'label'    => esc_html__('Field Border', 'cf7-styler-for-divi'),
            'selector' => '{{WRAPPER}} .dipe-cf7-styler .wpcf7 input:not([type=submit]):not([type=checkbox]):not([type=radio]), {{WRAPPER}} .dipe-cf7-styler .wpcf7 select, {{WRAPPER}} .dipe-cf7-styler .wpcf7 textarea',
        ]);

        $this->add_responsive_control('field_border_radius', [
            'label'      => esc_html__('Border Radius', 'cf7-styler-for-divi'),
            'type'       => \Elementor\Controls_Manager::DIMENSIONS,
            'size_units' => ['px', '%'],
            'selectors'  => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 input:not([type=submit]):not([type=checkbox]):not([type=radio]), {{WRAPPER}} .dipe-cf7-styler .wpcf7 select, {{WRAPPER}} .dipe-cf7-styler .wpcf7 textarea' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
            ],
        ]);

        $this->add_responsive_control('form_field_spacing', [
            'label'      => esc_html__('Field Spacing Bottom', 'cf7-styler-for-divi'),
            'type'       => \Elementor\Controls_Manager::SLIDER,
            'size_units' => ['px'],
            'range'      => [
                'px' => ['min' => 0, 'max' => 200, 'step' => 1],
            ],
            'default'    => ['size' => 20, 'unit' => 'px'],
            'selectors'  => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 form > p, {{WRAPPER}} .dipe-cf7-styler .wpcf7 form > div, {{WRAPPER}} .dipe-cf7-styler .wpcf7 form > label' => 'margin-bottom: {{SIZE}}{{UNIT}};',
            ],
        ]);

        $this->add_group_control(\Elementor\Group_Control_Typography::get_type(), [
            'name'     => 'field_typography',
            'label'    => esc_html__('Field Typography', 'cf7-styler-for-divi'),
            'selector' => '{{WRAPPER}} .dipe-cf7-styler .wpcf7 input:not([type=submit]), {{WRAPPER}} .dipe-cf7-styler .wpcf7 select, {{WRAPPER}} .dipe-cf7-styler .wpcf7 textarea',
        ]);

        $this->end_controls_section();
    }

    /**
     * Style tab: Label styles.
     */
    private function register_label_style_controls() {
        $this->start_controls_section('label_style_section', [
            'label' => esc_html__('Labels', 'cf7-styler-for-divi'),
            'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
        ]);

        $this->add_control('label_color', [
            'label'     => esc_html__('Label Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 label' => 'color: {{VALUE}};',
            ],
        ]);

        $this->add_group_control(\Elementor\Group_Control_Typography::get_type(), [
            'name'     => 'label_typography',
            'label'    => esc_html__('Label Typography', 'cf7-styler-for-divi'),
            'selector' => '{{WRAPPER}} .dipe-cf7-styler .wpcf7 label',
        ]);

        $this->add_responsive_control('form_label_spacing', [
            'label'      => esc_html__('Label Spacing Bottom', 'cf7-styler-for-divi'),
            'type'       => \Elementor\Controls_Manager::SLIDER,
            'size_units' => ['px'],
            'range'      => [
                'px' => ['min' => 0, 'max' => 200, 'step' => 1],
            ],
            'default'    => ['size' => 7, 'unit' => 'px'],
            'selectors'  => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 .wpcf7-form-control:not(.wpcf7-submit)' => 'margin-top: {{SIZE}}{{UNIT}};',
            ],
        ]);

        $this->end_controls_section();
    }

    /**
     * Style tab: Placeholder styles.
     */
    private function register_placeholder_style_controls() {
        $this->start_controls_section('placeholder_style_section', [
            'label' => esc_html__('Placeholder', 'cf7-styler-for-divi'),
            'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
        ]);

        $this->add_control('placeholder_color', [
            'label'     => esc_html__('Placeholder Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 input::placeholder, {{WRAPPER}} .dipe-cf7-styler .wpcf7 textarea::placeholder' => 'color: {{VALUE}};',
            ],
        ]);

        $this->add_group_control(\Elementor\Group_Control_Typography::get_type(), [
            'name'     => 'placeholder_typography',
            'label'    => esc_html__('Placeholder Typography', 'cf7-styler-for-divi'),
            'selector' => '{{WRAPPER}} .dipe-cf7-styler .wpcf7 input::placeholder, {{WRAPPER}} .dipe-cf7-styler .wpcf7 textarea::placeholder',
        ]);

        $this->end_controls_section();
    }

    /**
     * Style tab: Radio & Checkbox.
     */
    private function register_radio_checkbox_controls() {
        $this->start_controls_section('radio_checkbox_section', [
            'label' => esc_html__('Radio & Checkbox', 'cf7-styler-for-divi'),
            'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
        ]);

        $this->add_control('cr_custom_styles', [
            'label'        => esc_html__('Custom Styles', 'cf7-styler-for-divi'),
            'type'         => \Elementor\Controls_Manager::SWITCHER,
            'label_on'     => esc_html__('Yes', 'cf7-styler-for-divi'),
            'label_off'    => esc_html__('No', 'cf7-styler-for-divi'),
            'return_value' => 'yes',
            'default'      => '',
        ]);

        $this->add_responsive_control('cr_size', [
            'label'      => esc_html__('Size', 'cf7-styler-for-divi'),
            'type'       => \Elementor\Controls_Manager::SLIDER,
            'size_units' => ['px'],
            'range'      => [
                'px' => ['min' => 0, 'max' => 50, 'step' => 1],
            ],
            'default'    => ['size' => 20, 'unit' => 'px'],
            'selectors'  => [
                '{{WRAPPER}} .dipe-cf7-cr .wpcf7-checkbox input[type=checkbox] + span:before, {{WRAPPER}} .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox] + span:before, {{WRAPPER}} .dipe-cf7-cr .wpcf7-radio input[type=radio] + span:before' => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}};',
            ],
            'condition'  => ['cr_custom_styles' => 'yes'],
        ]);

        $this->add_control('cr_background_color', [
            'label'     => esc_html__('Background Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-cr .wpcf7-checkbox input[type=checkbox] + span:before, {{WRAPPER}} .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox] + span:before, {{WRAPPER}} .dipe-cf7-cr .wpcf7-radio input[type=radio]:not(:checked) + span:before' => 'background-color: {{VALUE}};',
                '{{WRAPPER}} .dipe-cf7-cr .wpcf7-radio input[type=radio]:checked + span:before' => 'box-shadow: inset 0px 0px 0px 4px {{VALUE}};',
            ],
            'condition' => ['cr_custom_styles' => 'yes'],
        ]);

        $this->add_control('cr_selected_color', [
            'label'     => esc_html__('Selected Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'default'   => '#222222',
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-cr .wpcf7-checkbox input[type=checkbox]:checked + span:before, {{WRAPPER}} .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox]:checked + span:before' => 'color: {{VALUE}};',
                '{{WRAPPER}} .dipe-cf7-cr .wpcf7-radio input[type=radio]:checked + span:before' => 'background-color: {{VALUE}};',
            ],
            'condition' => ['cr_custom_styles' => 'yes'],
        ]);

        $this->add_control('cr_border_color', [
            'label'     => esc_html__('Border Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'default'   => '#222222',
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-cr .wpcf7-checkbox input[type=checkbox] + span:before, {{WRAPPER}} .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox] + span:before, {{WRAPPER}} .dipe-cf7-cr .wpcf7-radio input[type=radio] + span:before' => 'border-color: {{VALUE}};',
            ],
            'condition' => ['cr_custom_styles' => 'yes'],
        ]);

        $this->add_responsive_control('cr_border_size', [
            'label'      => esc_html__('Border Size', 'cf7-styler-for-divi'),
            'type'       => \Elementor\Controls_Manager::SLIDER,
            'size_units' => ['px'],
            'range'      => [
                'px' => ['min' => 0, 'max' => 5, 'step' => 1],
            ],
            'default'    => ['size' => 1, 'unit' => 'px'],
            'selectors'  => [
                '{{WRAPPER}} .dipe-cf7-cr .wpcf7-checkbox input[type=checkbox] + span:before, {{WRAPPER}} .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox] + span:before, {{WRAPPER}} .dipe-cf7-cr .wpcf7-radio input[type=radio] + span:before' => 'border-width: {{SIZE}}{{UNIT}};',
            ],
            'condition'  => ['cr_custom_styles' => 'yes'],
        ]);

        $this->add_control('cr_label_color', [
            'label'     => esc_html__('Label Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-cr .wpcf7-checkbox label, {{WRAPPER}} .dipe-cf7-cr .wpcf7-radio label' => 'color: {{VALUE}};',
            ],
            'condition' => ['cr_custom_styles' => 'yes'],
        ]);

        $this->end_controls_section();
    }

    /**
     * Style tab: Submit button.
     */
    private function register_button_style_controls() {
        $this->start_controls_section('button_style_section', [
            'label' => esc_html__('Button', 'cf7-styler-for-divi'),
            'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
        ]);

        $this->add_group_control(\Elementor\Group_Control_Typography::get_type(), [
            'name'     => 'button_typography',
            'label'    => esc_html__('Typography', 'cf7-styler-for-divi'),
            'selector' => '{{WRAPPER}} .dipe-cf7-styler .wpcf7-form input[type=submit]',
        ]);

        $this->start_controls_tabs('button_tabs');

        $this->start_controls_tab('button_normal_tab', [
            'label' => esc_html__('Normal', 'cf7-styler-for-divi'),
        ]);

        $this->add_control('button_text_color', [
            'label'     => esc_html__('Text Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7-form input[type=submit]' => 'color: {{VALUE}};',
            ],
        ]);

        $this->add_control('button_bg_color', [
            'label'     => esc_html__('Background Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7-form input[type=submit]' => 'background-color: {{VALUE}};',
            ],
        ]);

        $this->end_controls_tab();

        $this->start_controls_tab('button_hover_tab', [
            'label' => esc_html__('Hover', 'cf7-styler-for-divi'),
        ]);

        $this->add_control('button_text_color_hover', [
            'label'     => esc_html__('Text Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7-form input[type=submit]:hover' => 'color: {{VALUE}};',
            ],
        ]);

        $this->add_control('button_bg_color_hover', [
            'label'     => esc_html__('Background Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7-form input[type=submit]:hover' => 'background-color: {{VALUE}};',
            ],
        ]);

        $this->add_control('button_border_color_hover', [
            'label'     => esc_html__('Border Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7-form input[type=submit]:hover' => 'border-color: {{VALUE}};',
            ],
        ]);

        $this->end_controls_tab();

        $this->end_controls_tabs();

        $this->add_responsive_control('button_padding', [
            'label'      => esc_html__('Padding', 'cf7-styler-for-divi'),
            'type'       => \Elementor\Controls_Manager::DIMENSIONS,
            'size_units' => ['px', 'em', '%'],
            'separator'  => 'before',
            'selectors'  => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7-form input[type=submit]' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
            ],
        ]);

        $this->add_group_control(\Elementor\Group_Control_Border::get_type(), [
            'name'     => 'button_border',
            'label'    => esc_html__('Border', 'cf7-styler-for-divi'),
            'selector' => '{{WRAPPER}} .dipe-cf7-styler .wpcf7-form input[type=submit]',
        ]);

        $this->add_responsive_control('button_border_radius', [
            'label'      => esc_html__('Border Radius', 'cf7-styler-for-divi'),
            'type'       => \Elementor\Controls_Manager::DIMENSIONS,
            'size_units' => ['px', '%'],
            'selectors'  => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7-form input[type=submit]' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
            ],
        ]);

        $this->add_group_control(\Elementor\Group_Control_Box_Shadow::get_type(), [
            'name'     => 'button_box_shadow',
            'label'    => esc_html__('Box Shadow', 'cf7-styler-for-divi'),
            'selector' => '{{WRAPPER}} .dipe-cf7-styler .wpcf7-form input[type=submit]',
        ]);

        $this->end_controls_section();
    }

    /**
     * Style tab: Success / Error messages.
     */
    private function register_message_style_controls() {
        $this->start_controls_section('message_style_section', [
            'label' => esc_html__('Messages', 'cf7-styler-for-divi'),
            'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
        ]);

        $this->add_responsive_control('cf7_message_padding', [
            'label'      => esc_html__('Validation Message Padding', 'cf7-styler-for-divi'),
            'type'       => \Elementor\Controls_Manager::SLIDER,
            'size_units' => ['px'],
            'range'      => [
                'px' => ['min' => 0, 'max' => 50, 'step' => 1],
            ],
            'selectors'  => [
                '{{WRAPPER}} .dipe-cf7-styler span.wpcf7-not-valid-tip' => 'padding: {{SIZE}}{{UNIT}};',
            ],
        ]);

        $this->add_responsive_control('cf7_message_margin_top', [
            'label'      => esc_html__('Validation Message Margin Top', 'cf7-styler-for-divi'),
            'type'       => \Elementor\Controls_Manager::SLIDER,
            'size_units' => ['px'],
            'range'      => [
                'px' => ['min' => 0, 'max' => 50, 'step' => 1],
            ],
            'selectors'  => [
                '{{WRAPPER}} .dipe-cf7-styler span.wpcf7-not-valid-tip' => 'margin-top: {{SIZE}}{{UNIT}};',
            ],
        ]);

        $this->add_responsive_control('cf7_message_alignment', [
            'label'     => esc_html__('Message Text Alignment', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::CHOOSE,
            'options'   => [
                'left'   => [
                    'title' => esc_html__('Left', 'cf7-styler-for-divi'),
                    'icon'  => 'eicon-text-align-left',
                ],
                'center' => [
                    'title' => esc_html__('Center', 'cf7-styler-for-divi'),
                    'icon'  => 'eicon-text-align-center',
                ],
                'right'  => [
                    'title' => esc_html__('Right', 'cf7-styler-for-divi'),
                    'icon'  => 'eicon-text-align-right',
                ],
            ],
            'default'   => 'left',
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 form .wpcf7-response-output, {{WRAPPER}} .dipe-cf7-styler .wpcf7 form span.wpcf7-not-valid-tip' => 'text-align: {{VALUE}};',
            ],
        ]);

        $this->add_control('cf7_message_color', [
            'label'     => esc_html__('Validation Text Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler span.wpcf7-not-valid-tip' => 'color: {{VALUE}};',
            ],
        ]);

        $this->add_control('cf7_message_bg_color', [
            'label'     => esc_html__('Validation Background Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler span.wpcf7-not-valid-tip' => 'background-color: {{VALUE}};',
            ],
        ]);

        $this->add_control('cf7_border_highlight_color', [
            'label'     => esc_html__('Validation Border Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler span.wpcf7-not-valid-tip' => 'border: 2px solid {{VALUE}};',
            ],
        ]);

        $this->add_control('success_heading', [
            'label'     => esc_html__('Success Message', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::HEADING,
            'separator' => 'before',
        ]);

        $this->add_control('cf7_success_message_color', [
            'label'     => esc_html__('Text Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 form.sent .wpcf7-response-output' => 'color: {{VALUE}};',
            ],
        ]);

        $this->add_control('cf7_success_message_bg_color', [
            'label'     => esc_html__('Background Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 form.sent .wpcf7-response-output' => 'background-color: {{VALUE}};',
            ],
        ]);

        $this->add_control('cf7_success_border_color', [
            'label'     => esc_html__('Border Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 form.sent .wpcf7-response-output' => 'border-color: {{VALUE}};',
            ],
        ]);

        $this->add_control('error_heading', [
            'label'     => esc_html__('Error Message', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::HEADING,
            'separator' => 'before',
        ]);

        $this->add_control('cf7_error_message_color', [
            'label'     => esc_html__('Text Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 form .wpcf7-response-output' => 'color: {{VALUE}};',
            ],
        ]);

        $this->add_control('cf7_error_message_bg_color', [
            'label'     => esc_html__('Background Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 form .wpcf7-response-output' => 'background-color: {{VALUE}};',
            ],
        ]);

        $this->add_control('cf7_error_border_color', [
            'label'     => esc_html__('Border Color', 'cf7-styler-for-divi'),
            'type'      => \Elementor\Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .dipe-cf7-styler .wpcf7 form .wpcf7-response-output' => 'border-color: {{VALUE}};',
            ],
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

        $use_form_header   = !empty($settings['use_form_header']) && 'yes' === $settings['use_form_header'];
        $cr_custom_styles  = !empty($settings['cr_custom_styles']) && 'yes' === $settings['cr_custom_styles'];
        $fullwidth_button  = !empty($settings['use_form_button_fullwidth']) && 'yes' === $settings['use_form_button_fullwidth'];
        $cr_class          = $cr_custom_styles ? ' dipe-cf7-cr' : '';
        $fullwidth_class   = $fullwidth_button ? ' cf7m-button-fullwidth' : '';

        $form_header_html = '';
        if ($use_form_header) {
            $icon_image_html = '';
            $use_icon        = !empty($settings['use_icon']) && 'yes' === $settings['use_icon'];

            if ($use_icon && !empty($settings['header_icon']['value'])) {
                ob_start();
                \Elementor\Icons_Manager::render_icon($settings['header_icon'], ['aria-hidden' => 'true']);
                $icon_html       = ob_get_clean();
                $icon_image_html = '<div class="cf7m-form-header-icon">' . $icon_html . '</div>';
            } elseif (!empty($settings['header_image']['url'])) {
                $icon_image_html = '<div class="cf7m-form-header-image"><img src="' . esc_url($settings['header_image']['url']) . '" alt="" /></div>';
            }

            $title_html = '';
            if (!empty($settings['form_header_title'])) {
                $title_html = '<h2 class="cf7m-form-header-title">' . esc_html($settings['form_header_title']) . '</h2>';
            }

            $text_html = '';
            if (!empty($settings['form_header_text'])) {
                $text_html = '<div class="cf7m-form-header-text">' . esc_html($settings['form_header_text']) . '</div>';
            }

            $header_info = '';
            if ($title_html || $text_html) {
                $header_info = '<div class="cf7m-form-header-info">' . $title_html . $text_html . '</div>';
            }

            $form_header_html = '<div class="cf7m-form-header-container"><div class="cf7m-form-header">' . $icon_image_html . $header_info . '</div></div>';
        }

        $shortcode = do_shortcode(sprintf('[contact-form-7 id="%d"]', $form_id));
        if (strpos($shortcode, '[cf7m-presets') !== false || strpos($shortcode, '[/cf7m-presets]') !== false) {
            $shortcode = preg_replace('/\[cf7m-presets[^\]]*\]|\[\/cf7m-presets\]/i', '', $shortcode);
        }

        echo '<div class="cf7m-elementor-widget' . esc_attr($fullwidth_class) . '">';
        echo $form_header_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built from escaped parts
        echo '<div class="dipe-cf7 dipe-cf7-styler' . esc_attr($cr_class) . '">';
        echo $shortcode; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CF7 shortcode output
        echo '</div>';
        echo '</div>';
    }
}
