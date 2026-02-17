<?php

namespace CF7_Mate\Modules\CF7Styler;

if (!defined('ABSPATH')) {
    exit;
}

require_once ABSPATH . 'wp-content/themes/Divi/includes/builder-5/server/Framework/DependencyManagement/Interfaces/DependencyInterface.php';

if (defined('CF7M_PLUGIN_PATH')) {
    require_once CF7M_PLUGIN_PATH . 'includes/pro/design-presets.php';
}

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

    /**
     * Get effective value: attr value if set, otherwise preset style.
     *
     * @param array<string, mixed> $attrs Module attributes.
     * @param array{styles?: array<string, string>}|null $preset Design preset or null.
     * @param array<int, string> $path Attribute path (e.g. ['cf7', 'advanced', 'formBg']).
     * @param string $preset_key Key in preset['styles'] (e.g. 'formBg').
     */
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
        if (preg_match('/^[0-9.]+(px|em|rem|%|vh|vw|vmin|vmax|ch|ex)$/', $value)) {
            return $value;
        }
        if (in_array($value, ['initial', 'inherit', 'unset'], true)) {
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
        $attrs = is_array($attrs) ? $attrs : [];
        $scope_id = function_exists('wp_unique_id') ? wp_unique_id('cf7m-cf7-styler-') : ('cf7m-cf7-styler-' . uniqid());

        $design_preset_slug = self::get_attr_value($attrs, ['cf7', 'advanced', 'designPreset'], 'desktop');
        $design_preset = function_exists('cf7m_get_design_preset_by_slug') && $design_preset_slug !== ''
            ? cf7m_get_design_preset_by_slug($design_preset_slug)
            : null;

        $form_id = self::get_attr_value($attrs, ['cf7', 'advanced', 'formId'], 'desktop');
        if ($form_id === '') {
            $form_id = '0';
        }

        $use_form_header = self::get_attr_value($attrs, ['cf7', 'advanced', 'useFormHeader'], 'desktop') === 'on';
        $header_title = self::get_attr_value($attrs, ['cf7', 'advanced', 'formHeaderTitle'], 'desktop');
        $header_text = self::get_attr_value($attrs, ['cf7', 'advanced', 'formHeaderText'], 'desktop');
        $use_icon = self::get_attr_value($attrs, ['cf7', 'advanced', 'useIcon'], 'desktop') === 'on';
        $header_image = self::get_attr_value($attrs, ['cf7', 'advanced', 'headerImage'], 'desktop');
        $header_icon = self::get_attr_value($attrs, ['cf7', 'advanced', 'headerIcon'], 'desktop');
        $button_alignment = self::get_attr_value($attrs, ['cf7', 'advanced', 'buttonAlignment'], 'desktop') ?: 'left';
        $use_form_button_fullwide = self::get_attr_value($attrs, ['cf7', 'advanced', 'useFormButtonFullwidth'], 'desktop') ?: 'off';
        $cr_custom_styles = self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'crCustomStyles'], 'crCustomStyles') ?: 'off';

        $button_class = 'on' !== $use_form_button_fullwide ? $button_alignment : 'fullwidth';
        $cr_custom_class = 'on' === $cr_custom_styles ? 'dipe-cf7-cr cf7m-cf7-cr' : '';

        $form_header = '';
        if ($use_form_header && (! empty($header_title) || ! empty($header_text))) {
            $media_html = '';

            if ($use_icon && $header_icon !== '') {
                $icon_processed = function_exists('et_pb_process_font_icon') ? et_pb_process_font_icon($header_icon) : $header_icon;
                $icon_processed = esc_html($icon_processed);

                if (function_exists('dcs_inject_fa_icons')) {
                    dcs_inject_fa_icons($header_icon);
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
        $form_header_bg = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formHeaderBg'], 'formHeaderBg'));
        $form_header_img_bg     = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formHeaderImgBg'], 'formHeaderImgBg'));
        $form_header_icon_color = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formHeaderIconColor'], 'formHeaderIconColor'));
        $form_header_bottom     = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formHeaderBottom'], 'formHeaderBottom'));
        $form_header_padding    = self::padding_pipe_to_css(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formHeaderPadding'], 'formHeaderPadding'));

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

        $form_bg = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formBg'], 'formBg'));
        $form_padding = self::padding_pipe_to_css(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formPadding'], 'formPadding'));
        if ($form_bg !== '') {
            $css .= "#{$scope_id} .dipe-cf7-styler{background-color:{$form_bg};}";
        }
        if ($form_padding !== '') {
            $css .= "#{$scope_id} .dipe-cf7-styler{padding:{$form_padding};}";
        }

        $field_bg = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formBackgroundColor'], 'formBackgroundColor'));
        $field_active   = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formFieldActiveColor'], 'formFieldActiveColor'));
        $field_height   = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formFieldHeight'], 'formFieldHeight'));
        $field_padding  = self::padding_pipe_to_css(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formFieldPadding'], 'formFieldPadding'));
        $field_spacing  = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formFieldSpacing'], 'formFieldSpacing'));
        $label_spacing  = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formLabelSpacing'], 'formLabelSpacing'));

        $field_selector = "#{$scope_id} .dipe-cf7 input:not([type=submit]),#{$scope_id} .dipe-cf7 select,#{$scope_id} .dipe-cf7 textarea";
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
            $cr_size        = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'crSize'], 'crSize'));
            $cr_border_size = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'crBorderSize'], 'crBorderSize'));
            $cr_bg          = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'crBackgroundColor'], 'crBackgroundColor'));
            $cr_selected    = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'crSelectedColor'], 'crSelectedColor'));
            $cr_border      = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'crBorderColor'], 'crBorderColor'));
            $cr_label       = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'crLabelColor'], 'crLabelColor'));

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

        $msg_padding = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'cf7MessagePadding'], 'cf7MessagePadding'));
        $msg_margin_top    = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'cf7MessageMarginTop'], 'cf7MessageMarginTop'));
        $msg_align         = self::get_attr_value($attrs, ['cf7', 'advanced', 'cf7MessageAlignment'], 'desktop') ?: 'left';
        $msg_color         = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'cf7MessageColor'], 'cf7MessageColor'));
        $msg_bg            = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'cf7MessageBgColor'], 'cf7MessageBgColor'));
        $msg_border_hl     = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'cf7BorderHighlightColor'], 'cf7BorderHighlightColor'));
        $success_color     = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'cf7SuccessMessageColor'], 'cf7SuccessMessageColor'));
        $success_bg        = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'cf7SuccessMessageBgColor'], 'cf7SuccessMessageBgColor'));
        $success_border    = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'cf7SuccessBorderColor'], 'cf7SuccessBorderColor'));
        $error_color       = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'cf7ErrorMessageColor'], 'cf7ErrorMessageColor'));
        $error_bg          = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'cf7ErrorMessageBgColor'], 'cf7ErrorMessageBgColor'));
        $error_border      = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'cf7ErrorBorderColor'], 'cf7ErrorBorderColor'));

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

        $field_border_color = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formFieldBorderColor'], 'formFieldBorderColor'));
        $field_border_width  = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formFieldBorderWidth'], 'formFieldBorderWidth'));
        $field_border_radius = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formFieldBorderRadius'], 'formFieldBorderRadius'));
        $field_text_color    = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formFieldTextColor'], 'formFieldTextColor'));

        if ($field_border_color !== '') {
            $css .= "{$field_selector}{border-color:{$field_border_color} !important;}";
        }
        // Only output border-width when non-zero; presets use "0px" for borderless fields – skip so we don't override.
        if ($field_border_width !== '' && $field_border_width !== '0' && $field_border_width !== '0px') {
            $css .= "{$field_selector}{border-width:{$field_border_width} !important;border-style:solid;}";
        }
        if ($field_border_radius !== '' && $field_border_radius !== '0') {
            $css .= "{$field_selector}{border-radius:{$field_border_radius} !important;}";
        }
        if ($field_text_color !== '') {
            $css .= "{$field_selector}{color:{$field_text_color} !important;}";
        }

        $label_color = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'formLabelColor'], 'formLabelColor'));
        if ($label_color !== '') {
            $css .= "#{$scope_id} .dipe-cf7 label,#{$scope_id} .cf7m-cf7-styler label{color:{$label_color} !important;}";
        }

        $button_bg = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'buttonBg'], 'buttonBg'));
        $button_color        = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'buttonColor'], 'buttonColor'));
        $button_padding      = self::padding_pipe_to_css(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'buttonPadding'], 'buttonPadding'));
        $button_border_color = self::sanitize_css_color(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'buttonBorderColor'], 'buttonBorderColor'));
        $button_border_width = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'buttonBorderWidth'], 'buttonBorderWidth'));
        $button_border_radius = self::sanitize_css_length(self::get_effective_value($attrs, $design_preset, ['cf7', 'advanced', 'buttonBorderRadius'], 'buttonBorderRadius'));

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
