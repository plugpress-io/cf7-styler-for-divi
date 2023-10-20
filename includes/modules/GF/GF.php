<?php

if (!defined('ABSPATH')) exit; // Exit if accessed directly

if (!class_exists('TFS_Builder_Module')) {
    return;
}

class TFS_GFStyler extends TFS_Builder_Module
{

    public $slug = 'tfs_gravity_forms_styler';
    public $vb_support = 'on';

    public function init()
    {
        $this->name             = esc_html__('Gravity Forms', 'torque-forms-styler');
        $this->icon_path        = plugin_dir_path(__FILE__) . '';
        $this->main_css_element = '%%order_class%%';

        $this->settings_modal_toggles = array(
            'general'  => array(
                'toggles' => array(
                    'general' => esc_html__('General', 'torque-forms-styler'),
                ),
            ),
            'advanced' => array(
                'toggles' => array(
                    'common'         => esc_html__('Common', 'torque-forms-styler'),
                ),
            ),
        );
    }

    public function get_fields()
    {
        return array_merge(
            $this->get_gf_general_fields(),
            $this->get_gf_computed_fields()
        );
    }

    public function get_gf_general_fields()
    {
        return array(
            'form_id' => array(
                'label'           => esc_html__('Select Gravity Form', 'torque-forms-styler'),
                'type'            => 'select',
                'option_category' => 'basic_option',
                'options'         => self::get_gravity_forms(),
                'description'     => esc_html__('Choose the Gravity Form you want to display.', 'torque-forms-styler'),
                'computed_affects' => array(
                    '__fluent_forms',
                ),
            ),
        );
    }

    public function get_gf_computed_fields()
    {
        return array(
            '__gravity_forms'                    => array(
                'type'                => 'computed',
                'computed_callback'   => array('TFS_GFStyler', 'get_gf_html'),
                'computed_depends_on' => array(
                    'cf7',
                ),
            ),
        );
    }

    public function render($attrs, $content, $render_slug)
    {
        $form_id = $this->props['form_id'];

        $output = '<div class="tfs-gravity-forms-styler">';

        $output .= '</div>';

        return $output;
    }

    public static function get_gravity_forms()
    {
        $fieldOptions = [];

        if (!class_exists('GFForms')) {
            return ['-1' => __('You have not added any Gravity Forms yet.', 'uael')];
        }

        $forms = \RGFormsModel::get_forms(null, 'title');
        if (!is_array($forms) || empty($forms)) {
            return ['-1' => __('You have not added any Gravity Forms yet.', 'uael')];
        }

        $fieldOptions['0'] = 'Select';
        foreach ($forms as $form) {
            $fieldOptions[$form->id] = $form->title;
        }

        return $fieldOptions;
    }
}

new TFS_GFStyler();
