<?php

namespace DiviCF7Styler\Modules\CF7Styler\CF7StylerTraits;

trait RenderStylesTrait {
    public function render_styles($attrs) {
        $styles = [];
        
        if (isset($attrs['advanced']['common']['form_bg']) && !empty($attrs['advanced']['common']['form_bg'])) {
            $styles[] = [
                'selector' => '%%order_class%% .dipe-cf7',
                'declaration' => sprintf('background-color: %s;', $attrs['advanced']['common']['form_bg']),
            ];
        }
        
        if (isset($attrs['advanced']['form_header']['form_header_bg']) && !empty($attrs['advanced']['form_header']['form_header_bg'])) {
            $styles[] = [
                'selector' => '%%order_class%% .dipe-form-header-container',
                'declaration' => sprintf('background-color: %s;', $attrs['advanced']['form_header']['form_header_bg']),
            ];
        }
        
        if (isset($attrs['advanced']['form_header']['form_header_bottom']) && !empty($attrs['advanced']['form_header']['form_header_bottom'])) {
            $styles[] = [
                'selector' => '%%order_class%% .dipe-form-header-container',
                'declaration' => sprintf('margin-bottom: %s;', $attrs['advanced']['form_header']['form_header_bottom']),
            ];
        }
        
        if (isset($attrs['advanced']['form_header']['form_header_icon_color']) && !empty($attrs['advanced']['form_header']['form_header_icon_color'])) {
            $styles[] = [
                'selector' => '%%order_class%% .dipe-form-header-icon span',
                'declaration' => sprintf('color: %s;', $attrs['advanced']['form_header']['form_header_icon_color']),
            ];
        }
        
        if (isset($attrs['content']['use_form_button_fullwidth']) && $attrs['content']['use_form_button_fullwidth']) {
            $styles[] = [
                'selector' => '%%order_class%% .dipe-cf7 .wpcf7 input[type=submit], %%order_class%% .dipe-cf7 .wpcf7 button[type=submit]',
                'declaration' => 'width: 100%;',
            ];
        } else if (isset($attrs['content']['button_alignment'])) {
            $alignment = $attrs['content']['button_alignment'];
            $styles[] = [
                'selector' => '%%order_class%% .dipe-cf7 .wpcf7 form .wpcf7-form-control-wrap',
                'declaration' => sprintf('text-align: %s;', $alignment),
            ];
        }
        
        return $styles;
    }
}
