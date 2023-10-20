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
            $this->get_ff_general_fields(),
            $this->get_ff_computed_fields()
        );
    }

    public function get_ff_general_fields()
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
            ),
        );
    }

    public function get_ff_computed_fields()
    {
        return array(
            '__fluent_forms'                    => array(
                'type'                => 'computed',
                'computed_callback'   => array('TFS_FFStyler', 'get_ff_html'),
                'computed_depends_on' => array(
                    'cf7',
                ),
            ),
        );
    }

    public function render($attrs, $content, $render_slug)
    {
        $form_id = $this->props['form_id'];

        $output = '<div class="tfs-fluent-form-styler">';

        if ('0' !== $form_id && $form_id) {
            $output .= do_shortcode('[fluentform id="' . absint($form_id) . '"]');
        } else {
            $output .= esc_html__('Please select a Fluent Form.', 'torque-forms-styler');
        }

        $output .= '</div>';

        return $output;
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
}

new TFS_FFStyler();
