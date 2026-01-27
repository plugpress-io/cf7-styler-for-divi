<?php

namespace Divi_CF7_Styler\Modules\CF7Styler;

if (!defined('ABSPATH')) {
    die('Direct access forbidden.');
}

require_once ABSPATH . 'wp-content/themes/Divi/includes/builder-5/server/Framework/DependencyManagement/Interfaces/DependencyInterface.php';

use ET\Builder\Framework\DependencyManagement\Interfaces\DependencyInterface;

class CF7Styler implements DependencyInterface
{
    public function load()
    {
        $module_json_folder_path = DCS_MODULES_JSON_PATH . 'cf7-styler/';

        add_action(
            'init',
            function () use ($module_json_folder_path) {
                if (!class_exists('\ET\Builder\Packages\ModuleLibrary\ModuleRegistration')) {
                    return;
                }

                \ET\Builder\Packages\ModuleLibrary\ModuleRegistration::register_module(
                    $module_json_folder_path,
                    array(
                        'render_callback' => array(CF7Styler::class, 'render_callback'),
                    )
                );
            },
            5 // High priority to register early
        );
    }

    /**
     * Render callback for the module.
     *
     * @since 3.0.0
     */
    public static function render_callback($attrs)
    {
        // Get form ID from attributes (new structure: cf7.advanced.formId)
        $form_id = $attrs['cf7']['advanced']['formId']['desktop']['value'] ?? '0';

        // Get header settings
        $use_form_header = ($attrs['cf7']['advanced']['useFormHeader']['desktop']['value'] ?? 'off') === 'on';
        $header_title    = $attrs['cf7']['advanced']['formHeaderTitle']['desktop']['value'] ?? '';
        $header_text     = $attrs['cf7']['advanced']['formHeaderText']['desktop']['value'] ?? '';

        // Button alignment & custom radio/checkbox styles – mirror Divi 4 behavior.
        $button_alignment         = $attrs['cf7']['advanced']['buttonAlignment']['desktop']['value'] ?? 'left';
        $use_form_button_fullwide = $attrs['cf7']['advanced']['useFormButtonFullwidth']['desktop']['value'] ?? 'off';
        $cr_custom_styles         = $attrs['cf7']['advanced']['crCustomStyles']['desktop']['value'] ?? 'off';

        $button_class    = 'on' !== $use_form_button_fullwide ? $button_alignment : 'fullwidth';
        $cr_custom_class = 'on' === $cr_custom_styles ? 'dipe-cf7-cr dcs-cf7-cr' : '';

        // Build header HTML (keeps new dcs-* prefix, works for both Divi 4 & 5).
        $form_header = '';
        if ($use_form_header && (! empty($header_title) || ! empty($header_text))) {
            $form_header .= '<div class="dcs-cf7-header">';
            if (! empty($header_title)) {
                $form_header .= '<h3 class="dcs-cf7-header__title">' . esc_html($header_title) . '</h3>';
            }
            if (! empty($header_text)) {
                $form_header .= '<p class="dcs-cf7-header__text">' . esc_html($header_text) . '</p>';
            }
            $form_header .= '</div>';
        }

        // Build form HTML or placeholder.
        if ($form_id === '0' || empty($form_id)) {
            $form_html = '<p class="dcs-cf7-styler__placeholder">' . esc_html__('Please select a Contact Form 7 form.', 'cf7-styler-for-divi') . '</p>';
        } else {
            $form_html = do_shortcode(sprintf('[contact-form-7 id="%1$s"]', esc_attr($form_id)));
        }

        // Wrap output to mirror Divi 4 structure, but with both old and new prefixes:
        // - dipe-cf7*, dipe-cf7-styler (backwards-compatible with existing CSS)
        // - dcs-cf7*,  dcs-cf7-styler (new, clearer prefix for Divi 5)
        $container_classes = sprintf(
            'dipe-cf7-container dipe-cf7-button-%1$s dcs-cf7-container dcs-cf7-button-%1$s',
            esc_attr($button_class)
        );

        $wrapper_classes = sprintf(
            'dipe-cf7 dipe-cf7-styler dcs-cf7 dcs-cf7-styler %s',
            esc_attr($cr_custom_class)
        );

        $output  = '<div class="' . $container_classes . '">';
        $output .= $form_header;
        $output .= '<div class="' . $wrapper_classes . '">';
        $output .= $form_html;
        $output .= '</div>';
        $output .= '</div>';

        return $output;
    }
}
