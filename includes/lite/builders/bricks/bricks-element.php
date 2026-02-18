<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Bricks element: CF7 Styler – display and style Contact Form 7 forms.
 *
 * @package CF7_Mate\Lite\Builders\Bricks
 * @since   3.0.0
 */
class CF7M_Bricks_Element extends \Bricks\Element {

    public $category = 'general';
    public $name     = 'cf7-styler';
    public $icon     = 'ti-email';
    public $scripts  = [];

    public function get_label() {
        return esc_html__('CF7 Styler', 'cf7-styler-for-divi');
    }

    public function get_keywords() {
        return ['contact', 'form', 'cf7', 'contact form 7', 'styler'];
    }

    public function set_controls() {
        // ── Content: Form Selection ──
        $forms = cf7m_get_contact_forms();

        $this->controls['cf7_form_id'] = [
            'tab'     => 'content',
            'group'   => 'content',
            'label'   => esc_html__('Select Form', 'cf7-styler-for-divi'),
            'type'    => 'select',
            'options' => $forms,
            'default' => '0',
        ];

        // ── Content: Form Header ──
        $this->controls['headerSep'] = [
            'tab'   => 'content',
            'group' => 'form_header',
            'type'  => 'separator',
            'label' => esc_html__('Form Header', 'cf7-styler-for-divi'),
        ];

        $this->controls['use_form_header'] = [
            'tab'     => 'content',
            'group'   => 'form_header',
            'label'   => esc_html__('Show Form Header', 'cf7-styler-for-divi'),
            'type'    => 'checkbox',
            'default' => false,
        ];

        $this->controls['form_header_title'] = [
            'tab'      => 'content',
            'group'    => 'form_header',
            'label'    => esc_html__('Header Title', 'cf7-styler-for-divi'),
            'type'     => 'text',
            'default'  => '',
            'required' => ['use_form_header', '!=', ''],
        ];

        $this->controls['form_header_text'] = [
            'tab'      => 'content',
            'group'    => 'form_header',
            'label'    => esc_html__('Header Text', 'cf7-styler-for-divi'),
            'type'     => 'textarea',
            'default'  => '',
            'required' => ['use_form_header', '!=', ''],
        ];

        $this->controls['use_icon'] = [
            'tab'      => 'content',
            'group'    => 'form_header',
            'label'    => esc_html__('Use Icon', 'cf7-styler-for-divi'),
            'type'     => 'checkbox',
            'default'  => false,
            'required' => ['use_form_header', '!=', ''],
        ];

        $this->controls['header_icon'] = [
            'tab'      => 'content',
            'group'    => 'form_header',
            'label'    => esc_html__('Header Icon', 'cf7-styler-for-divi'),
            'type'     => 'icon',
            'required' => [
                ['use_form_header', '!=', ''],
                ['use_icon', '!=', ''],
            ],
        ];

        $this->controls['header_image'] = [
            'tab'      => 'content',
            'group'    => 'form_header',
            'label'    => esc_html__('Header Image', 'cf7-styler-for-divi'),
            'type'     => 'image',
            'required' => [
                ['use_form_header', '!=', ''],
                ['use_icon', '=', ''],
            ],
        ];

        // ── Style: Form Header ──
        $this->controls['form_header_bg'] = [
            'tab'   => 'content',
            'group' => 'form_header_style',
            'label' => esc_html__('Header Background', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'background-color',
                    'selector' => '.cf7m-form-header-container',
                ],
            ],
            'required' => ['use_form_header', '!=', ''],
        ];

        $this->controls['form_header_padding'] = [
            'tab'   => 'content',
            'group' => 'form_header_style',
            'label' => esc_html__('Header Padding', 'cf7-styler-for-divi'),
            'type'  => 'spacing',
            'css'   => [
                [
                    'property' => 'padding',
                    'selector' => '.cf7m-form-header-container',
                ],
            ],
            'required' => ['use_form_header', '!=', ''],
        ];

        $this->controls['form_header_bottom_spacing'] = [
            'tab'   => 'content',
            'group' => 'form_header_style',
            'label' => esc_html__('Bottom Spacing', 'cf7-styler-for-divi'),
            'type'  => 'number',
            'units' => true,
            'css'   => [
                [
                    'property' => 'margin-bottom',
                    'selector' => '.cf7m-form-header-container',
                ],
            ],
            'required' => ['use_form_header', '!=', ''],
        ];

        $this->controls['form_header_img_bg'] = [
            'tab'   => 'content',
            'group' => 'form_header_style',
            'label' => esc_html__('Image/Icon Background', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'background-color',
                    'selector' => '.cf7m-form-header-icon',
                ],
                [
                    'property' => 'background-color',
                    'selector' => '.cf7m-form-header-image',
                ],
            ],
            'required' => ['use_form_header', '!=', ''],
        ];

        $this->controls['form_header_icon_color'] = [
            'tab'   => 'content',
            'group' => 'form_header_style',
            'label' => esc_html__('Icon Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'color',
                    'selector' => '.cf7m-form-header-icon i',
                ],
                [
                    'property' => 'fill',
                    'selector' => '.cf7m-form-header-icon svg',
                ],
            ],
            'required' => [
                ['use_form_header', '!=', ''],
                ['use_icon', '!=', ''],
            ],
        ];

        $this->controls['header_title_typography'] = [
            'tab'   => 'content',
            'group' => 'form_header_style',
            'label' => esc_html__('Title Typography', 'cf7-styler-for-divi'),
            'type'  => 'typography',
            'css'   => [
                [
                    'property' => 'font',
                    'selector' => '.cf7m-form-header-title',
                ],
            ],
            'required' => ['use_form_header', '!=', ''],
        ];

        $this->controls['header_text_typography'] = [
            'tab'   => 'content',
            'group' => 'form_header_style',
            'label' => esc_html__('Text Typography', 'cf7-styler-for-divi'),
            'type'  => 'typography',
            'css'   => [
                [
                    'property' => 'font',
                    'selector' => '.cf7m-form-header-text',
                ],
            ],
            'required' => ['use_form_header', '!=', ''],
        ];

        // ── Style: Form Common ──
        $this->controls['form_bg'] = [
            'tab'   => 'content',
            'group' => 'form_common',
            'label' => esc_html__('Form Background', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'background-color',
                    'selector' => '.dipe-cf7-styler',
                ],
            ],
        ];

        $this->controls['form_padding'] = [
            'tab'   => 'content',
            'group' => 'form_common',
            'label' => esc_html__('Form Padding', 'cf7-styler-for-divi'),
            'type'  => 'spacing',
            'css'   => [
                [
                    'property' => 'padding',
                    'selector' => '.dipe-cf7-styler',
                ],
            ],
        ];

        $this->controls['form_border'] = [
            'tab'   => 'content',
            'group' => 'form_common',
            'label' => esc_html__('Form Border', 'cf7-styler-for-divi'),
            'type'  => 'border',
            'css'   => [
                [
                    'property' => 'border',
                    'selector' => '.dipe-cf7-styler',
                ],
            ],
        ];

        $this->controls['use_form_button_fullwidth'] = [
            'tab'     => 'content',
            'group'   => 'form_common',
            'label'   => esc_html__('Fullwidth Button', 'cf7-styler-for-divi'),
            'type'    => 'checkbox',
            'default' => false,
            'css'     => [
                [
                    'property' => 'width',
                    'selector' => '.cf7m-button-fullwidth .wpcf7-form input[type=submit]',
                    'value'    => '100%',
                ],
            ],
        ];

        $this->controls['button_alignment'] = [
            'tab'      => 'content',
            'group'    => 'form_common',
            'label'    => esc_html__('Button Alignment', 'cf7-styler-for-divi'),
            'type'     => 'justify-content',
            'css'      => [
                [
                    'property' => 'text-align',
                    'selector' => '.cf7m-bricks-element .wpcf7-form p:last-of-type',
                ],
            ],
            'required' => ['use_form_button_fullwidth', '=', ''],
        ];

        // ── Style: Form Fields ──
        $field_selector = '.dipe-cf7-styler .wpcf7 input:not([type=submit]):not([type=checkbox]):not([type=radio]), .dipe-cf7-styler .wpcf7 select, .dipe-cf7-styler .wpcf7 textarea';

        $this->controls['form_field_height'] = [
            'tab'   => 'content',
            'group' => 'form_fields',
            'label' => esc_html__('Field Height', 'cf7-styler-for-divi'),
            'type'  => 'number',
            'units' => true,
            'css'   => [
                [
                    'property' => 'height',
                    'selector' => '.dipe-cf7-styler .wpcf7 input:not([type=submit]):not([type=checkbox]):not([type=radio]), .dipe-cf7-styler .wpcf7 select',
                ],
            ],
        ];

        $this->controls['form_field_padding'] = [
            'tab'   => 'content',
            'group' => 'form_fields',
            'label' => esc_html__('Field Padding', 'cf7-styler-for-divi'),
            'type'  => 'spacing',
            'css'   => [
                [
                    'property' => 'padding',
                    'selector' => $field_selector,
                ],
            ],
        ];

        $this->controls['form_field_bg_color'] = [
            'tab'   => 'content',
            'group' => 'form_fields',
            'label' => esc_html__('Background Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'background-color',
                    'selector' => $field_selector,
                ],
            ],
        ];

        $this->controls['form_field_text_color'] = [
            'tab'   => 'content',
            'group' => 'form_fields',
            'label' => esc_html__('Text Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'color',
                    'selector' => $field_selector,
                ],
            ],
        ];

        $this->controls['form_field_active_color'] = [
            'tab'   => 'content',
            'group' => 'form_fields',
            'label' => esc_html__('Focus Border Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'border-color',
                    'selector' => '.dipe-cf7-styler .wpcf7 input:not([type=submit]):focus, .dipe-cf7-styler .wpcf7 select:focus, .dipe-cf7-styler .wpcf7 textarea:focus',
                ],
            ],
        ];

        $this->controls['field_border'] = [
            'tab'   => 'content',
            'group' => 'form_fields',
            'label' => esc_html__('Field Border', 'cf7-styler-for-divi'),
            'type'  => 'border',
            'css'   => [
                [
                    'property' => 'border',
                    'selector' => $field_selector,
                ],
            ],
        ];

        $this->controls['form_field_spacing'] = [
            'tab'     => 'content',
            'group'   => 'form_fields',
            'label'   => esc_html__('Field Spacing Bottom', 'cf7-styler-for-divi'),
            'type'    => 'number',
            'units'   => true,
            'default' => '20px',
            'css'     => [
                [
                    'property' => 'margin-bottom',
                    'selector' => '.dipe-cf7-styler .wpcf7 form > p, .dipe-cf7-styler .wpcf7 form > div, .dipe-cf7-styler .wpcf7 form > label',
                ],
            ],
        ];

        $this->controls['field_typography'] = [
            'tab'   => 'content',
            'group' => 'form_fields',
            'label' => esc_html__('Field Typography', 'cf7-styler-for-divi'),
            'type'  => 'typography',
            'css'   => [
                [
                    'property' => 'font',
                    'selector' => '.dipe-cf7-styler .wpcf7 input:not([type=submit]), .dipe-cf7-styler .wpcf7 select, .dipe-cf7-styler .wpcf7 textarea',
                ],
            ],
        ];

        // ── Style: Labels ──
        $this->controls['label_color'] = [
            'tab'   => 'content',
            'group' => 'form_labels',
            'label' => esc_html__('Label Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'color',
                    'selector' => '.dipe-cf7-styler .wpcf7 label',
                ],
            ],
        ];

        $this->controls['label_typography'] = [
            'tab'   => 'content',
            'group' => 'form_labels',
            'label' => esc_html__('Label Typography', 'cf7-styler-for-divi'),
            'type'  => 'typography',
            'css'   => [
                [
                    'property' => 'font',
                    'selector' => '.dipe-cf7-styler .wpcf7 label',
                ],
            ],
        ];

        $this->controls['form_label_spacing'] = [
            'tab'     => 'content',
            'group'   => 'form_labels',
            'label'   => esc_html__('Label Spacing Bottom', 'cf7-styler-for-divi'),
            'type'    => 'number',
            'units'   => true,
            'default' => '7px',
            'css'     => [
                [
                    'property' => 'margin-top',
                    'selector' => '.dipe-cf7-styler .wpcf7 .wpcf7-form-control:not(.wpcf7-submit)',
                ],
            ],
        ];

        // ── Style: Placeholder ──
        $this->controls['placeholder_color'] = [
            'tab'   => 'content',
            'group' => 'form_placeholder',
            'label' => esc_html__('Placeholder Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'color',
                    'selector' => '.dipe-cf7-styler .wpcf7 input::placeholder',
                ],
                [
                    'property' => 'color',
                    'selector' => '.dipe-cf7-styler .wpcf7 textarea::placeholder',
                ],
            ],
        ];

        $this->controls['placeholder_typography'] = [
            'tab'   => 'content',
            'group' => 'form_placeholder',
            'label' => esc_html__('Placeholder Typography', 'cf7-styler-for-divi'),
            'type'  => 'typography',
            'css'   => [
                [
                    'property' => 'font',
                    'selector' => '.dipe-cf7-styler .wpcf7 input::placeholder, .dipe-cf7-styler .wpcf7 textarea::placeholder',
                ],
            ],
        ];

        // ── Style: Radio & Checkbox ──
        $this->controls['cr_custom_styles'] = [
            'tab'     => 'content',
            'group'   => 'radio_checkbox',
            'label'   => esc_html__('Custom Styles', 'cf7-styler-for-divi'),
            'type'    => 'checkbox',
            'default' => false,
        ];

        $this->controls['cr_size'] = [
            'tab'      => 'content',
            'group'    => 'radio_checkbox',
            'label'    => esc_html__('Size', 'cf7-styler-for-divi'),
            'type'     => 'number',
            'units'    => true,
            'default'  => '20px',
            'css'      => [
                [
                    'property' => 'width',
                    'selector' => '.dipe-cf7-cr .wpcf7-checkbox input[type=checkbox] + span:before, .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox] + span:before, .dipe-cf7-cr .wpcf7-radio input[type=radio] + span:before',
                ],
                [
                    'property' => 'height',
                    'selector' => '.dipe-cf7-cr .wpcf7-checkbox input[type=checkbox] + span:before, .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox] + span:before, .dipe-cf7-cr .wpcf7-radio input[type=radio] + span:before',
                ],
            ],
            'required' => ['cr_custom_styles', '!=', ''],
        ];

        $this->controls['cr_background_color'] = [
            'tab'   => 'content',
            'group' => 'radio_checkbox',
            'label' => esc_html__('Background Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'background-color',
                    'selector' => '.dipe-cf7-cr .wpcf7-checkbox input[type=checkbox] + span:before, .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox] + span:before, .dipe-cf7-cr .wpcf7-radio input[type=radio]:not(:checked) + span:before',
                ],
            ],
            'required' => ['cr_custom_styles', '!=', ''],
        ];

        $this->controls['cr_selected_color'] = [
            'tab'   => 'content',
            'group' => 'radio_checkbox',
            'label' => esc_html__('Selected Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'color',
                    'selector' => '.dipe-cf7-cr .wpcf7-checkbox input[type=checkbox]:checked + span:before, .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox]:checked + span:before',
                ],
                [
                    'property' => 'background-color',
                    'selector' => '.dipe-cf7-cr .wpcf7-radio input[type=radio]:checked + span:before',
                ],
            ],
            'required' => ['cr_custom_styles', '!=', ''],
        ];

        $this->controls['cr_border_color'] = [
            'tab'   => 'content',
            'group' => 'radio_checkbox',
            'label' => esc_html__('Border Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'border-color',
                    'selector' => '.dipe-cf7-cr .wpcf7-checkbox input[type=checkbox] + span:before, .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox] + span:before, .dipe-cf7-cr .wpcf7-radio input[type=radio] + span:before',
                ],
            ],
            'required' => ['cr_custom_styles', '!=', ''],
        ];

        $this->controls['cr_border_size'] = [
            'tab'      => 'content',
            'group'    => 'radio_checkbox',
            'label'    => esc_html__('Border Size', 'cf7-styler-for-divi'),
            'type'     => 'number',
            'units'    => true,
            'default'  => '1px',
            'css'      => [
                [
                    'property' => 'border-width',
                    'selector' => '.dipe-cf7-cr .wpcf7-checkbox input[type=checkbox] + span:before, .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox] + span:before, .dipe-cf7-cr .wpcf7-radio input[type=radio] + span:before',
                ],
            ],
            'required' => ['cr_custom_styles', '!=', ''],
        ];

        $this->controls['cr_label_color'] = [
            'tab'   => 'content',
            'group' => 'radio_checkbox',
            'label' => esc_html__('Label Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'color',
                    'selector' => '.dipe-cf7-cr .wpcf7-checkbox label, .dipe-cf7-cr .wpcf7-radio label',
                ],
            ],
            'required' => ['cr_custom_styles', '!=', ''],
        ];

        // ── Style: Submit Button ──
        $button_selector = '.dipe-cf7-styler .wpcf7-form input[type=submit]';

        $this->controls['button_typography'] = [
            'tab'   => 'content',
            'group' => 'submit_button',
            'label' => esc_html__('Typography', 'cf7-styler-for-divi'),
            'type'  => 'typography',
            'css'   => [
                [
                    'property' => 'font',
                    'selector' => $button_selector,
                ],
            ],
        ];

        $this->controls['button_text_color'] = [
            'tab'   => 'content',
            'group' => 'submit_button',
            'label' => esc_html__('Text Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'color',
                    'selector' => $button_selector,
                ],
            ],
        ];

        $this->controls['button_bg_color'] = [
            'tab'   => 'content',
            'group' => 'submit_button',
            'label' => esc_html__('Background Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'background-color',
                    'selector' => $button_selector,
                ],
            ],
        ];

        $this->controls['button_text_color_hover'] = [
            'tab'   => 'content',
            'group' => 'submit_button',
            'label' => esc_html__('Hover Text Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'color',
                    'selector' => $button_selector . ':hover',
                ],
            ],
        ];

        $this->controls['button_bg_color_hover'] = [
            'tab'   => 'content',
            'group' => 'submit_button',
            'label' => esc_html__('Hover Background Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'background-color',
                    'selector' => $button_selector . ':hover',
                ],
            ],
        ];

        $this->controls['button_padding'] = [
            'tab'   => 'content',
            'group' => 'submit_button',
            'label' => esc_html__('Padding', 'cf7-styler-for-divi'),
            'type'  => 'spacing',
            'css'   => [
                [
                    'property' => 'padding',
                    'selector' => $button_selector,
                ],
            ],
        ];

        $this->controls['button_border'] = [
            'tab'   => 'content',
            'group' => 'submit_button',
            'label' => esc_html__('Border', 'cf7-styler-for-divi'),
            'type'  => 'border',
            'css'   => [
                [
                    'property' => 'border',
                    'selector' => $button_selector,
                ],
            ],
        ];

        $this->controls['button_border_color_hover'] = [
            'tab'   => 'content',
            'group' => 'submit_button',
            'label' => esc_html__('Hover Border Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'border-color',
                    'selector' => $button_selector . ':hover',
                ],
            ],
        ];

        $this->controls['button_box_shadow'] = [
            'tab'   => 'content',
            'group' => 'submit_button',
            'label' => esc_html__('Box Shadow', 'cf7-styler-for-divi'),
            'type'  => 'box-shadow',
            'css'   => [
                [
                    'property' => 'box-shadow',
                    'selector' => $button_selector,
                ],
            ],
        ];

        // ── Style: Messages ──
        $this->controls['cf7_message_padding'] = [
            'tab'   => 'content',
            'group' => 'messages',
            'label' => esc_html__('Validation Padding', 'cf7-styler-for-divi'),
            'type'  => 'number',
            'units' => true,
            'css'   => [
                [
                    'property' => 'padding',
                    'selector' => '.dipe-cf7-styler span.wpcf7-not-valid-tip',
                ],
            ],
        ];

        $this->controls['cf7_message_margin_top'] = [
            'tab'   => 'content',
            'group' => 'messages',
            'label' => esc_html__('Validation Margin Top', 'cf7-styler-for-divi'),
            'type'  => 'number',
            'units' => true,
            'css'   => [
                [
                    'property' => 'margin-top',
                    'selector' => '.dipe-cf7-styler span.wpcf7-not-valid-tip',
                ],
            ],
        ];

        $this->controls['cf7_message_alignment'] = [
            'tab'     => 'content',
            'group'   => 'messages',
            'label'   => esc_html__('Message Alignment', 'cf7-styler-for-divi'),
            'type'    => 'text-align',
            'css'     => [
                [
                    'property' => 'text-align',
                    'selector' => '.dipe-cf7-styler .wpcf7 form .wpcf7-response-output, .dipe-cf7-styler .wpcf7 form span.wpcf7-not-valid-tip',
                ],
            ],
        ];

        $this->controls['cf7_message_color'] = [
            'tab'   => 'content',
            'group' => 'messages',
            'label' => esc_html__('Validation Text Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'color',
                    'selector' => '.dipe-cf7-styler span.wpcf7-not-valid-tip',
                ],
            ],
        ];

        $this->controls['cf7_message_bg_color'] = [
            'tab'   => 'content',
            'group' => 'messages',
            'label' => esc_html__('Validation Background', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'background-color',
                    'selector' => '.dipe-cf7-styler span.wpcf7-not-valid-tip',
                ],
            ],
        ];

        $this->controls['cf7_border_highlight_color'] = [
            'tab'   => 'content',
            'group' => 'messages',
            'label' => esc_html__('Validation Border Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'border-color',
                    'selector' => '.dipe-cf7-styler span.wpcf7-not-valid-tip',
                ],
            ],
        ];

        $this->controls['successMsgSep'] = [
            'tab'   => 'content',
            'group' => 'messages',
            'type'  => 'separator',
            'label' => esc_html__('Success Message', 'cf7-styler-for-divi'),
        ];

        $this->controls['cf7_success_message_color'] = [
            'tab'   => 'content',
            'group' => 'messages',
            'label' => esc_html__('Success Text Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'color',
                    'selector' => '.dipe-cf7-styler .wpcf7 form.sent .wpcf7-response-output',
                ],
            ],
        ];

        $this->controls['cf7_success_message_bg_color'] = [
            'tab'   => 'content',
            'group' => 'messages',
            'label' => esc_html__('Success Background', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'background-color',
                    'selector' => '.dipe-cf7-styler .wpcf7 form.sent .wpcf7-response-output',
                ],
            ],
        ];

        $this->controls['cf7_success_border_color'] = [
            'tab'   => 'content',
            'group' => 'messages',
            'label' => esc_html__('Success Border Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'border-color',
                    'selector' => '.dipe-cf7-styler .wpcf7 form.sent .wpcf7-response-output',
                ],
            ],
        ];

        $this->controls['errorMsgSep'] = [
            'tab'   => 'content',
            'group' => 'messages',
            'type'  => 'separator',
            'label' => esc_html__('Error Message', 'cf7-styler-for-divi'),
        ];

        $this->controls['cf7_error_message_color'] = [
            'tab'   => 'content',
            'group' => 'messages',
            'label' => esc_html__('Error Text Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'color',
                    'selector' => '.dipe-cf7-styler .wpcf7 form .wpcf7-response-output',
                ],
            ],
        ];

        $this->controls['cf7_error_message_bg_color'] = [
            'tab'   => 'content',
            'group' => 'messages',
            'label' => esc_html__('Error Background', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'background-color',
                    'selector' => '.dipe-cf7-styler .wpcf7 form .wpcf7-response-output',
                ],
            ],
        ];

        $this->controls['cf7_error_border_color'] = [
            'tab'   => 'content',
            'group' => 'messages',
            'label' => esc_html__('Error Border Color', 'cf7-styler-for-divi'),
            'type'  => 'color',
            'css'   => [
                [
                    'property' => 'border-color',
                    'selector' => '.dipe-cf7-styler .wpcf7 form .wpcf7-response-output',
                ],
            ],
        ];
    }

    public function set_control_groups() {
        $this->control_groups['content'] = [
            'title' => esc_html__('Content', 'cf7-styler-for-divi'),
            'tab'   => 'content',
        ];

        $this->control_groups['form_header'] = [
            'title' => esc_html__('Form Header', 'cf7-styler-for-divi'),
            'tab'   => 'content',
        ];

        $this->control_groups['form_header_style'] = [
            'title' => esc_html__('Header Style', 'cf7-styler-for-divi'),
            'tab'   => 'content',
        ];

        $this->control_groups['form_common'] = [
            'title' => esc_html__('Form Common', 'cf7-styler-for-divi'),
            'tab'   => 'content',
        ];

        $this->control_groups['form_fields'] = [
            'title' => esc_html__('Form Fields', 'cf7-styler-for-divi'),
            'tab'   => 'content',
        ];

        $this->control_groups['form_labels'] = [
            'title' => esc_html__('Labels', 'cf7-styler-for-divi'),
            'tab'   => 'content',
        ];

        $this->control_groups['form_placeholder'] = [
            'title' => esc_html__('Placeholder', 'cf7-styler-for-divi'),
            'tab'   => 'content',
        ];

        $this->control_groups['radio_checkbox'] = [
            'title' => esc_html__('Radio & Checkbox', 'cf7-styler-for-divi'),
            'tab'   => 'content',
        ];

        $this->control_groups['submit_button'] = [
            'title' => esc_html__('Button', 'cf7-styler-for-divi'),
            'tab'   => 'content',
        ];

        $this->control_groups['messages'] = [
            'title' => esc_html__('Messages', 'cf7-styler-for-divi'),
            'tab'   => 'content',
        ];
    }

    public function render() {
        $form_id = isset($this->settings['cf7_form_id']) ? (int) $this->settings['cf7_form_id'] : 0;

        if ($form_id <= 0) {
            if (bricks_is_builder()) {
                echo '<div class="cf7m-bricks-placeholder">' . esc_html__('Please select a Contact Form 7 form.', 'cf7-styler-for-divi') . '</div>';
            }
            return;
        }

        $use_form_header  = !empty($this->settings['use_form_header']);
        $cr_custom_styles = !empty($this->settings['cr_custom_styles']);
        $fullwidth_button = !empty($this->settings['use_form_button_fullwidth']);
        $cr_class         = $cr_custom_styles ? ' dipe-cf7-cr' : '';
        $fullwidth_class  = $fullwidth_button ? ' cf7m-button-fullwidth' : '';

        $form_header_html = '';
        if ($use_form_header) {
            $icon_image_html = '';
            $use_icon        = !empty($this->settings['use_icon']);

            if ($use_icon && !empty($this->settings['header_icon'])) {
                $icon_html       = isset($this->settings['header_icon']['icon']) ? '<i class="' . esc_attr($this->settings['header_icon']['icon']) . '"></i>' : '';
                $icon_image_html = '<div class="cf7m-form-header-icon">' . $icon_html . '</div>';
            } elseif (!empty($this->settings['header_image']['url'])) {
                $icon_image_html = '<div class="cf7m-form-header-image"><img src="' . esc_url($this->settings['header_image']['url']) . '" alt="" /></div>';
            }

            $title_html = '';
            if (!empty($this->settings['form_header_title'])) {
                $title_html = '<h2 class="cf7m-form-header-title">' . esc_html($this->settings['form_header_title']) . '</h2>';
            }

            $text_html = '';
            if (!empty($this->settings['form_header_text'])) {
                $text_html = '<div class="cf7m-form-header-text">' . esc_html($this->settings['form_header_text']) . '</div>';
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

        $root_classes = 'cf7m-bricks-element' . esc_attr($fullwidth_class);
        $this->set_attribute('_root', 'class', $root_classes);

        echo '<div ' . $this->render_attributes('_root') . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Bricks render_attributes
        echo $form_header_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built from escaped parts
        echo '<div class="dipe-cf7 dipe-cf7-styler' . esc_attr($cr_class) . '">';
        echo $shortcode; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CF7 shortcode output
        echo '</div>';
        echo '</div>';
    }
}
