<?php

if (!defined('ABSPATH')) exit; // Exit if accessed directly

if (!class_exists('TFS_Builder_Module')) {
    return;
}

class TFS_FFStyler extends TFS_Builder_Module
{

    public $slug = 'tfs_fluent_forms_styler';
    public $vb_support = 'on';

    public function init()
    {
        $this->name             = esc_html__('Fluent Forms', 'torque-forms-styler');
        $this->icon_path        = plugin_dir_path(__FILE__) . '';
        $this->main_css_element = '%%order_class%%';

        $this->settings_modal_toggles = array(
            'general'  => array(
                'toggles' => array(
                    'main_content' => esc_html__('Content', 'torque-forms-styler'),
                ),
            ),
            'advanced' => array(
                'toggles' => array(
                    'form_input_style'    => array(
                        'title'             => esc_html__('Form Fields', 'torque-forms-styler'),
                        'tabbed_subtoggles' => true,
                        'sub_toggles'       => array(
                            'common' => array(
                                'name' => esc_html__('Common', 'torque-forms-styler'),
                            ),
                            'label'   => array(
                                'name' => esc_html__('Label', 'torque-forms-styler'),
                            ),
                            'field'  => array(
                                'name' => esc_html__('Input Text', 'torque-forms-styler'),
                            ),
                        ),
                    ),

                    'form_radio_check'    => esc_html__('Radio & Checkbox', 'torque-forms-styler'),

                    'form_error_style'    => array(
                        'title'             => esc_html__('Success / Error Message', 'torque-forms-styler'),
                        'tabbed_subtoggles' => true,
                        'sub_toggles'       => array(
                            'success'  => array(
                                'name' => esc_html__('Success', 'torque-forms-styler'),
                            ),
                            'error'   => array(
                                'name' => esc_html__('Error', 'torque-forms-styler'),
                            ),
                        ),
                    ),

                    'form_button' => esc_html__('Button', 'torque-forms-styler'),
                ),
            ),
        );
    }

    public static function get_fluent_forms()
    {
        if (!function_exists('wpFluentForm')) {
            return array();
        }

        $ffList = wpFluent()->table('fluentform_forms')
            ->select(['id', 'title'])
            ->orderBy('id', 'DESC')
            ->get();

        if (!$ffList) {
            return [0 => esc_html__('No Forms Found!', 'torque-forms-styler')];
        }

        $forms = [0 => esc_html__('Select', 'torque-forms-styler')];
        foreach ($ffList as $form) {
            $forms[$form->id] = $form->title . ' (' . $form->id . ')';
        }

        return $forms;
    }

    public function get_fields()
    {

        return array_merge(
            $this->register_ff_general_fields(),
            $this->register_ff_input_style_fields(),
            $this->register_ff_radio_checkbox_fields(),
            $this->register_ff_error_style_fields(),
            $this->register_ff_computed_fields()
        );
    }

    private function register_ff_general_fields()
    {
        return array(
            'form_id' => array(
                'label'           => esc_html__('Select Fluent Form', 'torque-forms-styler'),
                'type'            => 'select',
                'option_category' => 'basic_option',
                'options'         => self::get_fluent_forms(),
                'description'     => esc_html__('Choose the Fluent Form you want to display.', 'torque-forms-styler'),
                'computed_affects' => array(
                    '__fluent_forms',
                ),
                'toggle_slug'     => 'main_content',
            ),
        );
    }

    private function register_ff_input_style_fields()
    {

        return array(

            'form_input_padding' => array(
                'label'           => esc_html__('Padding', 'torque-forms-styler'),
                'type'            => 'range',
                'option_category' => 'basic_option',
                'default'         => '10px',
                'range_settings'  => array(
                    'min'  => '0',
                    'max'  => '50',
                    'step' => '1',
                ),
                'mobile_options'   => true,
                'validate_unit'   => true,
                'description'     => esc_html__('Choose the Fluent Form input padding.', 'torque-forms-styler'),
                'toggle_slug'     => 'form_input_style',
                'tab_slug'        => 'advanced',
                'sub_toggle'      => 'common',
            ),

            'form_input_bgcolor' => array(
                'label'           => esc_html__('Background Color', 'torque-forms-styler'),
                'type'            => 'color-alpha',
                'option_category' => 'basic_option',
                'description'     => esc_html__('Choose the Fluent Form input background color.', 'torque-forms-styler'),
                'toggle_slug'     => 'form_input_style',
                'tab_slug'        => 'advanced',
                'sub_toggle'      => 'common',
            ),

            'form_required_color' => array(
                'label'           => esc_html__('Required Color', 'torque-forms-styler'),
                'type'            => 'color-alpha',
                'option_category' => 'basic_option',
                'description'     => esc_html__('Choose the Fluent Form required color.', 'torque-forms-styler'),
                'toggle_slug'     => 'form_input_style',
                'tab_slug'        => 'advanced',
                'sub_toggle'      => 'common',
            ),
        );
    }

    private function register_ff_radio_checkbox_fields()
    {

        return array(

            'ff_radio_check_size' => array(
                'label'           => esc_html__('Radio & Checkbox Size', 'torque-forms-styler'),
                'type'            => 'range',
                'option_category' => 'basic_option',
                'default'         => '20px',
                'range_settings'  => array(
                    'min'  => '10',
                    'max'  => '50',
                    'step' => '1',
                ),
                'mobile_options'   => true,
                'validate_unit'   => true,
                'description'     => esc_html__('Choose the Fluent Form radio & checkbox size.', 'torque-forms-styler'),
                'toggle_slug'     => 'form_radio_check',
                'tab_slug'        => 'advanced',
            ),

            'ff_radio_check_bgcolor' => array(
                'label'           => esc_html__('Background Color', 'torque-forms-styler'),
                'type'            => 'color-alpha',
                'option_category' => 'basic_option',
                'description'     => esc_html__('Choose the Fluent Form radio & checkbox background color.', 'torque-forms-styler'),
                'toggle_slug'     => 'form_radio_check',
                'tab_slug'        => 'advanced',
            ),

            'ff_selected_color' => array(
                'label'           => esc_html__('Selected Color', 'torque-forms-styler'),
                'type'            => 'color-alpha',
                'option_category' => 'basic_option',
                'description'     => esc_html__('Choose the Fluent Form selected color.', 'torque-forms-styler'),
                'toggle_slug'     => 'form_radio_check',
                'tab_slug'        => 'advanced',
            ),

            'ff_select_color' => array(
                'label'           => esc_html__('Label Color', 'torque-forms-styler'),
                'type'            => 'color-alpha',
                'option_category' => 'basic_option',
                'description'     => esc_html__('Choose the Fluent Form label color.', 'torque-forms-styler'),
                'toggle_slug'     => 'form_radio_check',
                'tab_slug'        => 'advanced',
            ),
        );
    }

    private function register_ff_error_style_fields()
    {

        return array(
            'form_error_padding' => array(
                'label'           => esc_html__('Field Validation Padding', 'torque-forms-styler'),
                'type'            => 'custom_padding',
                'option_category' => 'basic_option',
                'description'     => esc_html__('Choose the Fluent Form field validation padding.', 'torque-forms-styler'),
                'toggle_slug'     => 'form_error_style',
                'tab_slug'        => 'advanced',
                'sub_toggle'      => 'error',
            ),

            'form_error_bgcolor' => array(
                'label'           => esc_html__('Form Error Field Background Color', 'torque-forms-styler'),
                'type'            => 'color-alpha',
                'option_category' => 'basic_option',
                'description'     => esc_html__('Choose the Fluent Form error field background color.', 'torque-forms-styler'),
                'toggle_slug'     => 'form_error_style',
                'tab_slug'        => 'advanced',
                'sub_toggle'      => 'error',
            ),

            'form_valid_padding' => array(
                'label'           => esc_html__('Form Valid Message Padding', 'torque-forms-styler'),
                'type'            => 'custom_padding',
                'option_category' => 'basic_option',
                'description'     => esc_html__('Choose the Fluent Form valid message padding.', 'torque-forms-styler'),
                'toggle_slug'     => 'form_error_style',
                'tab_slug'        => 'advanced',
                'sub_toggle'      => 'success',
            ),

            'form_valid_bgcolor' => array(
                'label'           => esc_html__('Form Valid Background Color', 'torque-forms-styler'),
                'type'            => 'color-alpha',
                'option_category' => 'basic_option',
                'description'     => esc_html__('Choose the Fluent Form valid background color.', 'torque-forms-styler'),
                'toggle_slug'     => 'form_error_style',
                'tab_slug'        => 'advanced',
                'sub_toggle'      => 'success',
            ),
        );
    }

    private function register_ff_star_rating_fields()
    {
    }

    private function register_ff_computed_fields()
    {
        return array(
            '__fluent_forms'                    => array(
                'type'                => 'computed',
                'computed_callback'   => array('TFS_FFStyler', 'ff_styler_html'),
                'computed_depends_on' => array(
                    'form_id',
                ),
            ),
        );
    }

    public function get_advanced_fields_config()
    {

        $advanced_fields                    = array();
        $advanced_fields['text']            = array();
        $advanced_fields['fonts']           = array();
        $advanced_fields['text_shadow']     = array();
        $advanced_fields['link_options']    = array();

        // Text
        $advanced_fields['fonts']['input_label'] = array(
            'label'       => esc_html__('Label', 'torque-forms-styler'),
            'css'         => array(
                'main' => '
                %%order_class%% .tfs-ff-styler .fluentform .ff-el-form-control, 
                %%order_class%% .tfs-ff-styler .fluentform .ff-el-input--label label, 
                %%order_class%% .tfs-ff-styler  .fluentform .ff-el-form-check-input + span, 
                %%order_class%% .tfs-ff-styler .fluentform .ff-el-section-title
            '
            ),
            'toggle_slug' => 'form_input_style',
            'tab_slug'    => 'advanced',
            'sub_toggle'  => 'label',
        );

        $advanced_fields['fonts']['input_field'] = array(
            'label'       => esc_html__('Field', 'torque-forms-styler'),
            'css'         => array(
                'main' => '
                    %%order_class%% .tfs-ff-styler .fluentform .ff-el-form-control::-webkit-input-placeholder, 
                    %%order_class%% .tfs-ff-styler .fluentform .ff-el-form-control, 
                    %%order_class%% .tfs-ff-styler .fluentform input[type=checkbox]:checked:before, 
                    %%order_class%% .tfs-ff-styler .fluentform .ff-el-net-label span'
            ),
            'toggle_slug' => 'form_input_style',
            'tab_slug'    => 'advanced',
            'sub_toggle'  => 'field',
        );

        $advanced_fields['fonts']['error'] = array(
            'css'         => array(
                'main' => '%%order_class%% .tfs-ff-styler .fluentform .ff-el-is-error .error'
            ),
            'toggle_slug' => 'form_error_style',
            'tab_slug'    => 'advanced',
            'sub_toggle'  => 'error',
        );

        $advanced_fields['fonts']['success'] = array(
            'css'         => array(
                'main' => '%%order_class%% .tfs-ff-styler .fluentform .ff-message-success'
            ),
            'toggle_slug' => 'form_error_style',
            'tab_slug'    => 'advanced',
            'sub_toggle'  => 'success',
        );

        // Borders
        $advanced_fields['borders']['input_field'] = array(
            'label_prefix' => esc_html__('Field', 'torque-forms-styler'),
            'css' => array(
                'main'      => array(
                    'border_radii'  => ('
                        %%order_class%% .tfs-ff-styler .fluentform .ff-el-form-control, 
                        %%order_class%% .tfs-ff-styler .fluentform .fluentform input[type=checkbox], 
                        %%order_class%% .tfs-ff-styler .fluentform .select2-selection
                    '),
                    'border_styles' => (' 
                        %%order_class%% .tfs-ff-styler .fluentform .ff-el-form-control, 
                        %%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input, 
                        %%order_class%% .tfs-ff-styler .fluentform .select2-selection
                    '),
                ),
                'important' => 'all',
            ),
            'toggle_slug' => 'form_input_style',
            'tab_slug'    => 'advanced',
            'sub_toggle'  => 'common',
        );

        $advanced_fields['borders']['radio_check'] = array(
            'css' => array(
                'main'      => array(
                    'border_radii'  => ('
                        %%order_class%% .tfs-ff-styler .fluentform input[type=checkbox]'),
                    'border_styles' => ('
                        %%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input'),
                ),
                'important' => 'all',
            ),
            'toggle_slug' => 'form_radio_check',
            'tab_slug'    => 'advanced',
        );

        $advanced_fields['borders']['error'] = array(
            'css' => array(
                'main'      => array(
                    'border_radii'  => ('%%order_class%% .tfs-ff-styler .fluentform .ff-message-error'),
                    'border_styles' => ('%%order_class%% .tfs-ff-styler .fluentform .ff-message-error'),
                ),
                'important' => 'all',
            ),
            'toggle_slug' => 'form_error_style',
            'tab_slug'    => 'advanced',
            'sub_toggle'  => 'error',
        );

        $advanced_fields['borders']['success'] = array(
            'css' => array(
                'main'      => array(
                    'border_radii'  => ('%%order_class%% .tfs-ff-styler .fluentform .ff-message-success'),
                    'border_styles' => ('%%order_class%% .tfs-ff-styler .fluentform .ff-message-success'),
                ),
                'important' => 'all',
            ),
            'toggle_slug' => 'form_error_style',
            'tab_slug'    => 'advanced',
            'sub_toggle'  => 'success',
        );

        // Button
        $advanced_fields['button']['submit_button'] = array(
            'label'          => esc_html__('Button', 'torque-forms-styler'),
            'css'            => array(
                'main'      => '%%order_class%% .tfs-ff-styler .fluentform .ff_submit_btn_wrapper button.ff-btn-submit, %%order_class%% .tfs-ff-styler .fluentform .step-nav button.ff-btn-secondary',
                'important' => 'all',
            ),
            'box_shadow'     => array(
                'css' => array(
                    'main' => '%%order_class%% .tfs-ff-styler .fluentform .ff_submit_btn_wrapper button.ff-btn-submit, %%order_class%% .tfs-ff-styler .fluentform .step-nav button.ff-btn-secondary',
                ),
            ),
            'margin_padding' => array(
                'css' => array(
                    'main'      => '%%order_class%% .tfs-ff-styler .fluentform .ff_submit_btn_wrapper button.ff-btn-submit, %%order_class%% .tfs-ff-styler .fluentform .step-nav button.ff-btn-secondary',
                    'important' => 'all',
                ),
            ),
            'hide_icon'      => true,
            'toggle_slug' => 'form_button',
            'tab_slug'    => 'advanced',
        );

        return $advanced_fields;
    }

    public static function ff_styler_html($args = array(), $conditional_tags = array(), $current_page = array())
    {
        $form_id = $args['form_id'];
        if (!self::is_fluent_form_plugin_active()) {
            return esc_html__('Please install Fluent Forms plugin.', 'torque-forms-styler');
        }

        ob_start();
        echo self::generate_form_output($form_id);
        return ob_get_clean();
    }

    public function render($attrs, $content, $render_slug)
    {

        $this->dt_generate_styles($render_slug);

        $form_id = $this->props['form_id'];

        if (!self::is_fluent_form_plugin_active()) {
            return esc_html__('Please install Fluent Forms plugin.', 'torque-forms-styler');
        }

        $output = '<div class="tfs-ff-styler">';
        $output .= self::generate_form_output($form_id);
        $output .= '</div>';

        return $output;
    }

    private static function is_fluent_form_plugin_active()
    {
        return function_exists('wpFluentForm');
    }

    private static function generate_form_output($form_id)
    {
        if ('0' !== $form_id && $form_id) {
            return do_shortcode(sprintf('[fluentform id="%1$s"]', absint($form_id)));
        }
        return esc_html__('Please select a Fluent Form.', 'torque-forms-styler');
    }

    public function dt_generate_styles($render_slug)
    {

        $this->generate_styles([
            'hover'          => false,
            'base_attr_name' => 'form_input_padding',
            'selector'       => 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-control, div%%order_class%% .tfs-ff-styler .fluentform textarea',
            'css_property'   => 'padding',
            'render_slug'    => $render_slug,
        ]);

        $this->generate_styles([
            'hover'          => false,
            'base_attr_name' => 'form_input_padding',
            'selector'       => 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input',
            'css_property'   => 'height',
            'render_slug'    => $render_slug,
        ]);

        $this->generate_styles([
            'hover'          => false,
            'base_attr_name' => 'form_input_padding',
            'selector'       => 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input',
            'css_property'   => 'width',
            'render_slug'    => $render_slug,
        ]);

        $this->generate_styles([
            'hover'          => false,
            'base_attr_name' => 'form_input_bgcolor',
            'selector'       => 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-control, div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input, div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-select',
            'css_property'   => 'background-color',
            'render_slug'    => $render_slug,
        ]);

        $this->generate_styles([
            'hover'          => false,
            'base_attr_name' => 'form_required_color',
            'selector'       => 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-input--label.ff-el-is-required.asterisk-right label:after',
            'css_property'   => 'color',
            'render_slug'    => $render_slug,
        ]);

        $this->generate_styles([
            'hover'          => false,
            'base_attr_name' => 'ff_radio_check_size',
            'selector'       => 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input',
            'css_property'   => 'width',
            'render_slug'    => $render_slug,
            'important'      => true,
        ]);

        $this->generate_styles([
            'hover'          => false,
            'base_attr_name' => 'ff_radio_check_size',
            'selector'       => 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input',
            'css_property'   => 'height',
            'render_slug'    => $render_slug,
            'important'      => true,
        ]);

        $this->generate_styles([
            'hover'          => false,
            'base_attr_name' => 'ff_radio_check_bgcolor',
            'selector'       => 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input',
            'css_property'   => 'background-color',
            'render_slug'    => $render_slug,
        ]);

        $this->generate_styles([
            'hover'          => false,
            'base_attr_name' => 'ff_selected_color',
            'selector'       => 'div%%order_class%% .tfs-ff-styler .fluentform input[type=checkbox]:checked:before',
            'css_property'   => 'color',
            'render_slug'    => $render_slug,
        ]);

        $this->generate_styles([
            'hover'          => false,
            'base_attr_name' => 'ff_selected_color',
            'selector'       => 'div%%order_class%% .tfs-ff-styler .fluentform input[type=radio]:checked:before',
            'css_property'   => 'background-color',
            'render_slug'    => $render_slug,
        ]);

        $this->generate_styles([
            'hover'          => false,
            'base_attr_name' => 'ff_select_color',
            'selector'       => 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input + span, div%%order_class%% .tfs-ff-styler .fluentform .ff_tc_checkbox +  div.ff_t_c',
            'css_property'   => 'color',
            'render_slug'    => $render_slug,
        ]);

        if ($this->props['form_error_padding']) {
            $value = explode('|', $this->props['form_error_padding']);
            $this->props['form_error_padding'] = ($value[0] ? $value[0] : 0) . ' ' . ($value[1] ? $value[1] : 0) . ' ' . ($value[2] ? $value[2] : 0) . ' ' . ($value[3] ? $value[3] : 0);
        }

        if ($this->props['form_valid_padding']) {
            $value = explode('|', $this->props['form_valid_padding']);
            $this->props['form_valid_padding'] = ($value[0] ? $value[0] : 0) . ' ' . ($value[1] ? $value[1] : 0) . ' ' . ($value[2] ? $value[2] : 0) . ' ' . ($value[3] ? $value[3] : 0);
        }

        $this->generate_styles([
            'hover'          => false,
            'base_attr_name' => 'form_error_padding',
            'selector'       => 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-is-error .error',
            'css_property'   => 'padding',
            'type'           => 'custom_margin',
            'render_slug'    => $render_slug,
        ]);

        $this->generate_styles([
            'hover'          => false,
            'base_attr_name' => 'form_error_bgcolor',
            'selector'       => 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-is-error .error',
            'css_property'   => 'background-color',
            'render_slug'    => $render_slug,
        ]);

        $this->generate_styles([
            'hover'          => false,
            'base_attr_name' => 'form_valid_padding',
            'selector'       => 'div%%order_class%% .tfs-ff-styler .fluentform .ff-message-success',
            'css_property'   => 'padding',
            'type'           => 'custom_margin',
            'render_slug'    => $render_slug,
        ]);

        $this->generate_styles([
            'hover'          => false,
            'base_attr_name' => 'form_valid_bgcolor',
            'selector'       => 'div%%order_class%% .tfs-ff-styler .fluentform .ff-message-success',
            'css_property'   => 'background-color',
            'render_slug'    => $render_slug,
        ]);
    }
}

new TFS_FFStyler();
