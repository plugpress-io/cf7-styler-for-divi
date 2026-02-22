<?php

namespace CF7_Mate\Modules\CF7Styler;

if (!defined('ABSPATH')) {
    exit;
}

require_once ABSPATH . 'wp-content/themes/Divi/includes/builder-5/server/Framework/DependencyManagement/Interfaces/DependencyInterface.php';


use ET\Builder\Framework\DependencyManagement\Interfaces\DependencyInterface;

class CF7Styler implements DependencyInterface
{
    private static function get_attr_value(array $attrs, array $path, string $breakpoint = 'desktop'): string
    {
        $node = $attrs;
        foreach ($path as $key) {
            if (!is_array($node) || !array_key_exists($key, $node)) {
                return '';
            }
            $node = $node[$key];
        }

        if (!is_array($node) || !isset($node[$breakpoint]['value'])) {
            return '';
        }

        $value = $node[$breakpoint]['value'];
        if (is_bool($value)) {
            return $value ? 'on' : 'off';
        }
        if (is_scalar($value)) {
            return (string) $value;
        }

        return '';
    }

    private static function get_effective_value(array $attrs, $preset, array $path, string $preset_key, string $breakpoint = 'desktop'): string
    {
        $value = self::get_attr_value($attrs, $path, $breakpoint);
        if ($value !== '' && $value !== '0' && $value !== '0px') {
            return $value;
        }
        if ($preset && isset($preset['styles'][$preset_key])) {
            $p = $preset['styles'][$preset_key];
            return is_scalar($p) ? (string) $p : '';
        }
        return $value;
    }

    private static function sanitize_css_color(string $value): string
    {
        $value = trim(wp_strip_all_tags($value));
        if ($value === '') {
            return '';
        }
        if (preg_match('/^var\(--[A-Za-z0-9\-_]+\)$/', $value)) {
            return $value;
        }
        if (in_array($value, ['transparent', 'currentColor', 'inherit', 'initial', 'unset'], true)) {
            return $value;
        }
        if (preg_match('/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/', $value)) {
            return $value;
        }
        if (preg_match('/^(rgb|rgba|hsl|hsla)\([0-9,\s.%]+\)$/', $value)) {
            return $value;
        }
        return '';
    }

    private static function sanitize_css_length(string $value): string
    {
        $value = trim(wp_strip_all_tags($value));
        if ($value === '' || $value === '0' || $value === '0px') {
            return $value === '' ? '' : '0';
        }
        // Support negative values (e.g., -5px for letter-spacing) and unitless values (e.g., 1.5 for line-height)
        if (preg_match('/^-?[0-9.]+(px|em|rem|%|vh|vw|vmin|vmax|ch|ex)?$/', $value)) {
            return $value;
        }
        if (in_array($value, ['initial', 'inherit', 'unset'], true)) {
            return $value;
        }
        return '';
    }

    private static function sanitize_font_weight(string $value): string
    {
        $value = trim(wp_strip_all_tags($value));
        $valid_weights = ['300', '400', '500', '600', '700', '800'];
        if (in_array($value, $valid_weights, true)) {
            return $value;
        }
        return '';
    }

    private static function sanitize_text_transform(string $value): string
    {
        $value = trim(wp_strip_all_tags($value));
        $valid_transforms = ['none', 'uppercase', 'lowercase', 'capitalize'];
        if (in_array($value, $valid_transforms, true)) {
            return $value;
        }
        return '';
    }

    private static function padding_pipe_to_css(string $value): string
    {
        $value = trim((string) $value);
        if ($value === '') {
            return '';
        }
        if (strpos($value, '|') === false) {
            return $value;
        }
        $parts = array_map('trim', explode('|', $value));
        $parts = array_pad($parts, 4, '0');
        return implode(' ', array_slice($parts, 0, 4));
    }

    public function load()
    {
        $module_json_folder_path = CF7M_MODULES_JSON_PATH . 'cf7-styler/';

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

    public static function render_callback($attrs)
    {
        // Fallback: ensure styles are enqueued even if wp_enqueue_scripts ran too early.
        if (!wp_style_is('cf7-styler-for-divi-d5-frontend-style', 'enqueued')) {
            wp_enqueue_style(
                'cf7-styler-for-divi-d5-frontend-style',
                CF7M_PLUGIN_URL . 'dist/css/bundle.css',
                [],
                CF7M_VERSION
            );
        }
        if (function_exists('wpcf7_enqueue_styles')) {
            wpcf7_enqueue_styles();
        }

        $attrs = is_array($attrs) ? $attrs : [];

        // Backward compat: merge old cf7.advanced.* into module.advanced.* for
        // modules converted before the attribute restructuring.
        if (isset($attrs['cf7']['advanced']) && is_array($attrs['cf7']['advanced'])) {
            if (!isset($attrs['module']['advanced']) || !is_array($attrs['module']['advanced'])) {
                $attrs['module']['advanced'] = [];
            }
            $attrs['module']['advanced'] += $attrs['cf7']['advanced'];
        }

        $scope_id = function_exists('wp_unique_id') ? wp_unique_id('cf7m-cf7-styler-') : ('cf7m-cf7-styler-' . uniqid());

        $design_preset_slug = self::get_attr_value($attrs, ['module', 'advanced', 'designPreset'], 'desktop');
        $design_preset = function_exists('cf7m_get_design_preset_by_slug') && $design_preset_slug !== ''
            ? cf7m_get_design_preset_by_slug($design_preset_slug)
            : null;

        $form_id = self::get_attr_value($attrs, ['module', 'advanced', 'formId'], 'desktop');
        if ($form_id === '') {
            $form_id = '0';
        }

        $use_form_header = self::get_attr_value($attrs, ['module', 'advanced', 'useFormHeader'], 'desktop') === 'on';
        $header_title = self::get_attr_value($attrs, ['module', 'advanced', 'formHeaderTitle'], 'desktop');
        $header_text = self::get_attr_value($attrs, ['module', 'advanced', 'formHeaderText'], 'desktop');
        $use_icon = self::get_attr_value($attrs, ['module', 'advanced', 'useIcon'], 'desktop') === 'on';
        $header_image = self::get_attr_value($attrs, ['module', 'advanced', 'headerImage'], 'desktop');
        $header_icon = self::get_attr_value($attrs, ['module', 'advanced', 'headerIcon'], 'desktop');
        $button_alignment = self::get_attr_value($attrs, ['module', 'advanced', 'buttonAlignment'], 'desktop') ?: 'left';
        $use_form_button_fullwide = self::get_attr_value($attrs, ['module', 'advanced', 'useFormButtonFullwidth'], 'desktop') ?: 'off';
        $cr_custom_styles = self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'crCustomStyles'], 'crCustomStyles') ?: 'off';

        $button_class = 'on' !== $use_form_button_fullwide ? $button_alignment : 'fullwidth';
        $cr_custom_class = 'on' === $cr_custom_styles ? 'dipe-cf7-cr cf7m-cf7-cr' : '';

        $form_header = '';
        if ($use_form_header && (! empty($header_title) || ! empty($header_text))) {
            $media_html = '';

            if ($use_icon && $header_icon !== '') {
                $icon_processed = function_exists('et_pb_process_font_icon') ? et_pb_process_font_icon($header_icon) : $header_icon;
                $icon_processed = esc_html($icon_processed);

                if (function_exists('cf7m_inject_fa_icons')) {
                    cf7m_inject_fa_icons($header_icon);
                }

                $media_html = sprintf(
                    '<div class="dipe-form-header-icon cf7m-form-header-icon"><span class="et-pb-icon">%1$s</span></div>',
                    $icon_processed
                );
            } elseif (!$use_icon && $header_image !== '') {
                $media_html = sprintf(
                    '<div class="dipe-form-header-image cf7m-form-header-image"><img src="%1$s" alt="" /></div>',
                    esc_url($header_image)
                );
            }

            $title_html = !empty($header_title) ? sprintf(
                '<h2 class="dipe-form-header-title cf7m-form-header-title">%1$s</h2>',
                esc_html($header_title)
            ) : '';
            $text_html = !empty($header_text) ? sprintf(
                '<div class="dipe-form-header-text cf7m-form-header-text">%1$s</div>',
                esc_html($header_text)
            ) : '';
            $info_html = ($title_html || $text_html) ? sprintf(
                '<div class="dipe-form-header-info cf7m-form-header-info">%1$s%2$s</div>',
                $title_html,
                $text_html
            ) : '';

            $form_header = sprintf(
                '<div class="dipe-form-header-container cf7m-form-header-container">
                    <div class="dipe-form-header cf7m-form-header">
                        %1$s%2$s
                    </div>
                </div>',
                $media_html,
                $info_html
            );
        }

        if ($form_id === '0' || empty($form_id)) {
            $form_html = '<p class="cf7m-cf7-styler__placeholder">' . esc_html__('Please select a Contact Form 7 form.', 'cf7-styler-for-divi') . '</p>';
        } else {
            $form_html = do_shortcode(sprintf('[contact-form-7 id="%1$s"]', esc_attr($form_id)));
        }

        $css = '';
        $form_header_bg = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formHeaderBg'], 'formHeaderBg'));
        $form_header_img_bg     = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formHeaderImgBg'], 'formHeaderImgBg'));
        $form_header_icon_color = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formHeaderIconColor'], 'formHeaderIconColor'));
        $form_header_bottom     = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formHeaderBottom'], 'formHeaderBottom'));
        $form_header_padding    = self::padding_pipe_to_css(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formHeaderPadding'], 'formHeaderPadding'));

        if ($form_header_bg !== '') {
            $css .= "#{$scope_id} .dipe-form-header-container{background-color:{$form_header_bg};}";
        }
        if ($form_header_bottom !== '') {
            $css .= "#{$scope_id} .dipe-form-header-container{margin-bottom:{$form_header_bottom};}";
        }
        if ($form_header_padding !== '') {
            $css .= "#{$scope_id} .dipe-form-header-container{padding:{$form_header_padding};}";
        }
        if ($form_header_img_bg !== '') {
            $css .= "#{$scope_id} .dipe-form-header-icon,#{$scope_id} .dipe-form-header-image{background-color:{$form_header_img_bg};}";
        }
        if ($form_header_icon_color !== '') {
            $css .= "#{$scope_id} .dipe-form-header-icon span{color:{$form_header_icon_color};}";
        }

        $form_bg = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formBg'], 'formBg'));
        $form_padding = self::padding_pipe_to_css(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formPadding'], 'formPadding'));
        if ($form_bg !== '') {
            $css .= "#{$scope_id} .dipe-cf7-styler{background-color:{$form_bg};}";
        }
        if ($form_padding !== '') {
            $css .= "#{$scope_id} .dipe-cf7-styler{padding:{$form_padding};}";
        }

        $field_bg = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formBackgroundColor'], 'formBackgroundColor'));
        $field_active   = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formFieldActiveColor'], 'formFieldActiveColor'));
        $field_height   = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formFieldHeight'], 'formFieldHeight'));
        $field_padding  = self::padding_pipe_to_css(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formFieldPadding'], 'formFieldPadding'));
        $field_spacing  = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formFieldSpacing'], 'formFieldSpacing'));
        $label_spacing  = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formLabelSpacing'], 'formLabelSpacing'));

        $field_selector = "#{$scope_id} .cf7m-cf7-styler input:not([type=submit]),#{$scope_id} .cf7m-cf7-styler select,#{$scope_id} .cf7m-cf7-styler textarea,#{$scope_id} .dipe-cf7 input:not([type=submit]),#{$scope_id} .dipe-cf7 select,#{$scope_id} .dipe-cf7 textarea";
        if ($field_bg !== '') {
            $css .= "{$field_selector}{background-color:{$field_bg} !important;}";
        }
        if ($field_padding !== '') {
            $css .= "{$field_selector}{padding:{$field_padding} !important;}";
        }
        if ($field_active !== '') {
            $css .= "#{$scope_id} .dipe-cf7 .wpcf7 input:not([type=submit]):focus,#{$scope_id} .dipe-cf7 .wpcf7 select:focus,#{$scope_id} .dipe-cf7 .wpcf7 textarea:focus{border-color:{$field_active} !important;}";
        }
        if ($field_height !== '') {
            $css .= "#{$scope_id} .wpcf7-form-control-wrap select,#{$scope_id} .wpcf7-form-control-wrap input[type=text],#{$scope_id} .wpcf7-form-control-wrap input[type=email],#{$scope_id} .wpcf7-form-control-wrap input[type=number],#{$scope_id} .wpcf7-form-control-wrap input[type=tel]{height:{$field_height} !important;}";
        }
        if ($field_spacing !== '') {
            $css .= "#{$scope_id} .dipe-cf7 .wpcf7 form>p,#{$scope_id} .dipe-cf7 .wpcf7 form>div,#{$scope_id} .dipe-cf7 .wpcf7 form>label,#{$scope_id} .dipe-cf7 .wpcf7 form .dp-col>p,#{$scope_id} .dipe-cf7 .wpcf7 form .dp-col>div,#{$scope_id} .dipe-cf7 .wpcf7 form .dp-col>label{margin-bottom:{$field_spacing} !important;}";
        }
        if ($label_spacing !== '') {
            // Field container (wrap) gets margin-top so label and input block are spaced.
            $css .= "#{$scope_id} .dipe-cf7-container .wpcf7-form-control-wrap{margin-top:{$label_spacing} !important;}";
        }

        if ($cr_custom_styles === 'on') {
            $cr_size        = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'crSize'], 'crSize'));
            $cr_border_size = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'crBorderSize'], 'crBorderSize'));
            $cr_bg          = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'crBackgroundColor'], 'crBackgroundColor'));
            $cr_selected    = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'crSelectedColor'], 'crSelectedColor'));
            $cr_border      = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'crBorderColor'], 'crBorderColor'));
            $cr_label       = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'crLabelColor'], 'crLabelColor'));

            if ($cr_size !== '' || $cr_border_size !== '') {
                $w = $cr_size !== '' ? $cr_size : '14px';
                $b = $cr_border_size !== '' ? $cr_border_size : '1px';
                $css .= "#{$scope_id} .dipe-cf7.dipe-cf7-cr .wpcf7-checkbox input[type=\"checkbox\"] + span:before,#{$scope_id} .dipe-cf7.dipe-cf7-cr .wpcf7-acceptance input[type=\"checkbox\"] + span:before,#{$scope_id} .dipe-cf7.dipe-cf7-cr .wpcf7-radio input[type=\"radio\"] + span:before{width:{$w} !important;height:{$w} !important;border-width:{$b} !important;}";
            }
            if ($cr_bg !== '') {
                $css .= "#{$scope_id} .dipe-cf7.dipe-cf7-cr .wpcf7-checkbox input[type=\"checkbox\"] + span:before,#{$scope_id} .dipe-cf7.dipe-cf7-cr .wpcf7-acceptance input[type=\"checkbox\"] + span:before,#{$scope_id} .dipe-cf7.dipe-cf7-cr .wpcf7-radio input[type=\"radio\"]:not(:checked) + span:before{background-color:{$cr_bg} !important;}";
                $css .= "#{$scope_id} .dipe-cf7.dipe-cf7-cr .wpcf7-radio input[type=\"radio\"]:checked + span:before{box-shadow:inset 0 0 0 4px {$cr_bg} !important;}";
            }
            if ($cr_selected !== '') {
                $css .= "#{$scope_id} .dipe-cf7.dipe-cf7-cr .wpcf7-checkbox input[type=\"checkbox\"]:checked + span:before,#{$scope_id} .dipe-cf7.dipe-cf7-cr .wpcf7-acceptance input[type=\"checkbox\"]:checked + span:before{color:{$cr_selected} !important;}";
                $css .= "#{$scope_id} .dipe-cf7.dipe-cf7-cr .wpcf7-radio input[type=\"radio\"]:checked + span:before{background-color:{$cr_selected} !important;}";
            }
            if ($cr_border !== '') {
                $css .= "#{$scope_id} .dipe-cf7.dipe-cf7-cr .wpcf7-checkbox input[type=\"checkbox\"] + span:before,#{$scope_id} .dipe-cf7.dipe-cf7-cr .wpcf7-radio input[type=\"radio\"] + span:before,#{$scope_id} .dipe-cf7.dipe-cf7-cr .wpcf7-acceptance input[type=\"checkbox\"] + span:before{border-color:{$cr_border} !important;}";
            }
            if ($cr_label !== '') {
                $css .= "#{$scope_id} .dipe-cf7.dipe-cf7-cr .wpcf7-checkbox label,#{$scope_id} .dipe-cf7.dipe-cf7-cr .wpcf7-radio label{color:{$cr_label} !important;}";
            }
        }

        $msg_padding = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'cf7MessagePadding'], 'cf7MessagePadding'));
        $msg_margin_top    = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'cf7MessageMarginTop'], 'cf7MessageMarginTop'));
        $msg_align         = self::get_attr_value($attrs, ['module', 'advanced', 'cf7MessageAlignment'], 'desktop') ?: 'left';
        $msg_color         = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'cf7MessageColor'], 'cf7MessageColor'));
        $msg_bg            = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'cf7MessageBgColor'], 'cf7MessageBgColor'));
        $msg_border_hl     = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'cf7BorderHighlightColor'], 'cf7BorderHighlightColor'));
        $success_color     = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'cf7SuccessMessageColor'], 'cf7SuccessMessageColor'));
        $success_bg        = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'cf7SuccessMessageBgColor'], 'cf7SuccessMessageBgColor'));
        $success_border    = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'cf7SuccessBorderColor'], 'cf7SuccessBorderColor'));
        $error_color       = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'cf7ErrorMessageColor'], 'cf7ErrorMessageColor'));
        $error_bg          = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'cf7ErrorMessageBgColor'], 'cf7ErrorMessageBgColor'));
        $error_border      = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'cf7ErrorBorderColor'], 'cf7ErrorBorderColor'));

        $css .= "#{$scope_id} .wpcf7 form .wpcf7-response-output,#{$scope_id} .wpcf7 form span.wpcf7-not-valid-tip{text-align:" . esc_attr($msg_align) . ";}";
        if ($msg_color !== '') {
            $css .= "#{$scope_id} .dipe-cf7 span.wpcf7-not-valid-tip{color:{$msg_color} !important;}";
        }
        if ($msg_bg !== '') {
            $css .= "#{$scope_id} .dipe-cf7 span.wpcf7-not-valid-tip{background-color:{$msg_bg} !important;}";
        }
        if ($msg_border_hl !== '') {
            $css .= "#{$scope_id} .dipe-cf7 span.wpcf7-not-valid-tip{border:2px solid {$msg_border_hl} !important;}";
        }
        if ($success_color !== '') {
            $css .= "#{$scope_id} .dipe-cf7 .wpcf7-mail-sent-ok{color:{$success_color} !important;}";
        }
        if ($success_bg !== '') {
            $css .= "#{$scope_id} .wpcf7 form.sent .wpcf7-response-output{background-color:{$success_bg} !important;}";
        }
        if ($success_border !== '') {
            $css .= "#{$scope_id} .wpcf7 form.sent .wpcf7-response-output{border-color:{$success_border} !important;}";
        }
        if ($error_color !== '') {
            $css .= "#{$scope_id} .wpcf7 form .wpcf7-response-output{color:{$error_color} !important;}";
        }
        if ($error_bg !== '') {
            $css .= "#{$scope_id} .wpcf7 form .wpcf7-response-output{background-color:{$error_bg} !important;}";
        }
        if ($error_border !== '') {
            $css .= "#{$scope_id} .wpcf7 form .wpcf7-response-output{border-color:{$error_border} !important;}";
        }
        if ($msg_padding !== '') {
            $css .= "#{$scope_id} span.wpcf7-not-valid-tip{padding:{$msg_padding} !important;}";
        }
        if ($msg_margin_top !== '') {
            $css .= "#{$scope_id} span.wpcf7-not-valid-tip{margin-top:{$msg_margin_top} !important;}";
        }

        $field_border_color = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formFieldBorderColor'], 'formFieldBorderColor'));
        $field_border_width  = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formFieldBorderWidth'], 'formFieldBorderWidth'));
        $field_border_radius = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formFieldBorderRadius'], 'formFieldBorderRadius'));
        $field_text_color    = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formFieldTextColor'], 'formFieldTextColor'));

        if ($field_border_color !== '') {
            $css .= "{$field_selector}{border-color:{$field_border_color} !important;}";
        }
        if ($field_border_width !== '' && $field_border_width !== '0' && $field_border_width !== '0px') {
            $css .= "{$field_selector}{border-width:{$field_border_width} !important;border-style:solid;}";
        }
        if ($field_border_radius !== '' && $field_border_radius !== '0') {
            $css .= "{$field_selector}{border-radius:{$field_border_radius} !important;}";
        }
        if ($field_text_color !== '') {
            $css .= "{$field_selector}{color:{$field_text_color} !important;}";
        }

        $label_color = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'formLabelColor'], 'formLabelColor'));
        if ($label_color !== '') {
            $css .= "#{$scope_id} .dipe-cf7 label,#{$scope_id} .cf7m-cf7-styler label{color:{$label_color} !important;}";
        }

        // Field Font Styles
        $field_font_size = self::sanitize_css_length(self::get_attr_value($attrs, ['module', 'advanced', 'fieldFontSize'], 'desktop'));
        $field_font_weight = self::sanitize_font_weight(self::get_attr_value($attrs, ['module', 'advanced', 'fieldFontWeight'], 'desktop'));
        $field_line_height = self::sanitize_css_length(self::get_attr_value($attrs, ['module', 'advanced', 'fieldLineHeight'], 'desktop'));
        $field_letter_spacing = self::sanitize_css_length(self::get_attr_value($attrs, ['module', 'advanced', 'fieldLetterSpacing'], 'desktop'));
        $field_text_transform = self::sanitize_text_transform(self::get_attr_value($attrs, ['module', 'advanced', 'fieldTextTransform'], 'desktop'));

        if ($field_font_size !== '') {
            $css .= "{$field_selector}{font-size:{$field_font_size} !important;}";
        }
        if ($field_font_weight !== '') {
            $css .= "{$field_selector}{font-weight:{$field_font_weight} !important;}";
        }
        if ($field_line_height !== '') {
            $css .= "{$field_selector}{line-height:{$field_line_height} !important;}";
        }
        if ($field_letter_spacing !== '') {
            $css .= "{$field_selector}{letter-spacing:{$field_letter_spacing} !important;}";
        }
        if ($field_text_transform !== '' && $field_text_transform !== 'none') {
            $css .= "{$field_selector}{text-transform:{$field_text_transform} !important;}";
        }

        // Label Font Styles
        $label_selector = "#{$scope_id} .dipe-cf7 label,#{$scope_id} .cf7m-cf7-styler label";
        $label_font_size = self::sanitize_css_length(self::get_attr_value($attrs, ['module', 'advanced', 'labelFontSize'], 'desktop'));
        $label_font_weight = self::sanitize_font_weight(self::get_attr_value($attrs, ['module', 'advanced', 'labelFontWeight'], 'desktop'));
        $label_line_height = self::sanitize_css_length(self::get_attr_value($attrs, ['module', 'advanced', 'labelLineHeight'], 'desktop'));
        $label_letter_spacing = self::sanitize_css_length(self::get_attr_value($attrs, ['module', 'advanced', 'labelLetterSpacing'], 'desktop'));
        $label_text_transform = self::sanitize_text_transform(self::get_attr_value($attrs, ['module', 'advanced', 'labelTextTransform'], 'desktop'));

        if ($label_font_size !== '') {
            $css .= "{$label_selector}{font-size:{$label_font_size} !important;}";
        }
        if ($label_font_weight !== '') {
            $css .= "{$label_selector}{font-weight:{$label_font_weight} !important;}";
        }
        if ($label_line_height !== '') {
            $css .= "{$label_selector}{line-height:{$label_line_height} !important;}";
        }
        if ($label_letter_spacing !== '') {
            $css .= "{$label_selector}{letter-spacing:{$label_letter_spacing} !important;}";
        }
        if ($label_text_transform !== '' && $label_text_transform !== 'none') {
            $css .= "{$label_selector}{text-transform:{$label_text_transform} !important;}";
        }

        // Placeholder Color
        $placeholder_color = self::sanitize_css_color(self::get_attr_value($attrs, ['module', 'advanced', 'placeholderColor'], 'desktop'));
        if ($placeholder_color !== '') {
            $css .= "#{$scope_id} .dipe-cf7 input::placeholder,#{$scope_id} .dipe-cf7 textarea::placeholder,#{$scope_id} .cf7m-cf7-styler input::placeholder,#{$scope_id} .cf7m-cf7-styler textarea::placeholder{color:{$placeholder_color} !important;}";
        }

        // Header Title Font Styles
        $header_title_selector = "#{$scope_id} .dipe-form-header-title,#{$scope_id} .cf7m-form-header-title";
        $header_title_font_size = self::sanitize_css_length(self::get_attr_value($attrs, ['module', 'advanced', 'headerTitleFontSize'], 'desktop'));
        $header_title_font_weight = self::sanitize_font_weight(self::get_attr_value($attrs, ['module', 'advanced', 'headerTitleFontWeight'], 'desktop'));
        $header_title_line_height = self::sanitize_css_length(self::get_attr_value($attrs, ['module', 'advanced', 'headerTitleLineHeight'], 'desktop'));
        $header_title_letter_spacing = self::sanitize_css_length(self::get_attr_value($attrs, ['module', 'advanced', 'headerTitleLetterSpacing'], 'desktop'));
        $header_title_text_transform = self::sanitize_text_transform(self::get_attr_value($attrs, ['module', 'advanced', 'headerTitleTextTransform'], 'desktop'));
        $header_title_text_color = self::sanitize_css_color(self::get_attr_value($attrs, ['module', 'advanced', 'headerTitleTextColor'], 'desktop'));

        if ($header_title_font_size !== '') {
            $css .= "{$header_title_selector}{font-size:{$header_title_font_size} !important;}";
        }
        if ($header_title_font_weight !== '') {
            $css .= "{$header_title_selector}{font-weight:{$header_title_font_weight} !important;}";
        }
        if ($header_title_line_height !== '') {
            $css .= "{$header_title_selector}{line-height:{$header_title_line_height} !important;}";
        }
        if ($header_title_letter_spacing !== '') {
            $css .= "{$header_title_selector}{letter-spacing:{$header_title_letter_spacing} !important;}";
        }
        if ($header_title_text_transform !== '' && $header_title_text_transform !== 'none') {
            $css .= "{$header_title_selector}{text-transform:{$header_title_text_transform} !important;}";
        }
        if ($header_title_text_color !== '') {
            $css .= "{$header_title_selector}{color:{$header_title_text_color} !important;}";
        }

        // Header Text Font Styles
        $header_text_selector = "#{$scope_id} .dipe-form-header-text,#{$scope_id} .cf7m-form-header-text";
        $header_text_font_size = self::sanitize_css_length(self::get_attr_value($attrs, ['module', 'advanced', 'headerTextFontSize'], 'desktop'));
        $header_text_font_weight = self::sanitize_font_weight(self::get_attr_value($attrs, ['module', 'advanced', 'headerTextFontWeight'], 'desktop'));
        $header_text_line_height = self::sanitize_css_length(self::get_attr_value($attrs, ['module', 'advanced', 'headerTextLineHeight'], 'desktop'));
        $header_text_letter_spacing = self::sanitize_css_length(self::get_attr_value($attrs, ['module', 'advanced', 'headerTextLetterSpacing'], 'desktop'));
        $header_text_text_transform = self::sanitize_text_transform(self::get_attr_value($attrs, ['module', 'advanced', 'headerTextTextTransform'], 'desktop'));
        $header_text_text_color = self::sanitize_css_color(self::get_attr_value($attrs, ['module', 'advanced', 'headerTextTextColor'], 'desktop'));

        if ($header_text_font_size !== '') {
            $css .= "{$header_text_selector}{font-size:{$header_text_font_size} !important;}";
        }
        if ($header_text_font_weight !== '') {
            $css .= "{$header_text_selector}{font-weight:{$header_text_font_weight} !important;}";
        }
        if ($header_text_line_height !== '') {
            $css .= "{$header_text_selector}{line-height:{$header_text_line_height} !important;}";
        }
        if ($header_text_letter_spacing !== '') {
            $css .= "{$header_text_selector}{letter-spacing:{$header_text_letter_spacing} !important;}";
        }
        if ($header_text_text_transform !== '' && $header_text_text_transform !== 'none') {
            $css .= "{$header_text_selector}{text-transform:{$header_text_text_transform} !important;}";
        }
        if ($header_text_text_color !== '') {
            $css .= "{$header_text_selector}{color:{$header_text_text_color} !important;}";
        }

        $button_bg = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'buttonBg'], 'buttonBg'));
        $button_color        = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'buttonColor'], 'buttonColor'));
        $button_padding      = self::padding_pipe_to_css(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'buttonPadding'], 'buttonPadding'));
        $button_border_color = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'buttonBorderColor'], 'buttonBorderColor'));
        $button_border_width = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'buttonBorderWidth'], 'buttonBorderWidth'));
        $button_border_radius = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['module', 'advanced', 'buttonBorderRadius'], 'buttonBorderRadius'));

        $button_selector = "#{$scope_id} .dipe-cf7 input[type=submit],#{$scope_id} .cf7m-cf7-styler input[type=submit],#{$scope_id} .dipe-cf7 .cf7m-button,#{$scope_id} .cf7m-cf7-styler .cf7m-button";

        if ($button_bg !== '') {
            $css .= "{$button_selector}{background-color:{$button_bg} !important;}";
        }
        if ($button_color !== '') {
            $css .= "{$button_selector}{color:{$button_color} !important;}";
        }
        if ($button_padding !== '' && $button_padding !== '0 0 0 0') {
            $css .= "{$button_selector}{padding:{$button_padding} !important;}";
        }
        if ($button_border_color !== '') {
            $css .= "{$button_selector}{border-color:{$button_border_color} !important;}";
        }
        if ($button_border_width !== '' && $button_border_width !== '0' && $button_border_width !== '0px') {
            $css .= "{$button_selector}{border-width:{$button_border_width} !important;border-style:solid;}";
        }
        if ($button_border_radius !== '' && $button_border_radius !== '0') {
            $css .= "{$button_selector}{border-radius:{$button_border_radius} !important;}";
        }
        if ($use_form_button_fullwide === 'on') {
            $css .= "{$button_selector}{width:100% !important;}";
        }

        // Button Font Styles
        $button_font_size = self::sanitize_css_length(self::get_attr_value($attrs, ['module', 'advanced', 'buttonFontSize'], 'desktop'));
        $button_font_weight = self::sanitize_font_weight(self::get_attr_value($attrs, ['module', 'advanced', 'buttonFontWeight'], 'desktop'));
        $button_line_height = self::sanitize_css_length(self::get_attr_value($attrs, ['module', 'advanced', 'buttonLineHeight'], 'desktop'));
        $button_letter_spacing = self::sanitize_css_length(self::get_attr_value($attrs, ['module', 'advanced', 'buttonLetterSpacing'], 'desktop'));
        $button_text_transform = self::sanitize_text_transform(self::get_attr_value($attrs, ['module', 'advanced', 'buttonTextTransform'], 'desktop'));

        if ($button_font_size !== '') {
            $css .= "{$button_selector}{font-size:{$button_font_size} !important;}";
        }
        if ($button_font_weight !== '') {
            $css .= "{$button_selector}{font-weight:{$button_font_weight} !important;}";
        }
        if ($button_line_height !== '') {
            $css .= "{$button_selector}{line-height:{$button_line_height} !important;}";
        }
        if ($button_letter_spacing !== '') {
            $css .= "{$button_selector}{letter-spacing:{$button_letter_spacing} !important;}";
        }
        if ($button_text_transform !== '' && $button_text_transform !== 'none') {
            $css .= "{$button_selector}{text-transform:{$button_text_transform} !important;}";
        }

        $container_classes = sprintf(
            'dipe-cf7-container dipe-cf7-button-%1$s cf7m-cf7-container cf7m-cf7-button-%1$s',
            esc_attr($button_class)
        );

        $wrapper_classes = sprintf(
            'dipe-cf7 dipe-cf7-styler cf7m-cf7 cf7m-cf7-styler %s',
            esc_attr($cr_custom_class)
        );

        $output  = '<div id="' . esc_attr($scope_id) . '" class="' . $container_classes . '">';
        if ($css !== '') {
            $output .= '<style>' . $css . '</style>';
        }
        $output .= $form_header;
        $output .= '<div class="' . $wrapper_classes . '">';
        $output .= $form_html;
        $output .= '</div>';
        $output .= '</div>';

        return $output;
    }
}
