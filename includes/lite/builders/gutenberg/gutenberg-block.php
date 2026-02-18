<?php

if (!defined('ABSPATH')) {
    exit;
}

function cf7m_gutenberg_render_callback($attrs, $content = '', $block = null)
{
    $form_id  = isset($attrs['formId']) ? (int) $attrs['formId'] : 0;
    $block_id = isset($attrs['blockId']) && $attrs['blockId'] ? sanitize_html_class($attrs['blockId']) : '';

    if ($form_id <= 0 || !$block_id) {
        return '';
    }

    $s = '#' . $block_id; // CSS scope prefix

    // ── CSS ─────────────────────────────────────────────────────────────────

    $css = cf7m_gb_build_css($attrs, $s);

    // ── Form Header ──────────────────────────────────────────────────────────

    $form_header_html = '';
    $use_form_header  = !empty($attrs['useFormHeader']);

    if ($use_form_header) {
        $use_icon        = !empty($attrs['useIcon']);
        $icon_image_html = '';

        if ($use_icon && !empty($attrs['headerIconClass'])) {
            $icon_class      = esc_attr($attrs['headerIconClass']);
            $icon_image_html = '<div class="cf7m-form-header-icon"><i class="' . $icon_class . '"></i></div>';
        } elseif (!empty($attrs['headerImageUrl'])) {
            $icon_image_html = '<div class="cf7m-form-header-image"><img src="' . esc_url($attrs['headerImageUrl']) . '" alt="" /></div>';
        }

        $title_html = '';
        if (!empty($attrs['formHeaderTitle'])) {
            $title_html = '<h2 class="cf7m-form-header-title">' . esc_html($attrs['formHeaderTitle']) . '</h2>';
        }

        $text_html = '';
        if (!empty($attrs['formHeaderText'])) {
            $text_html = '<div class="cf7m-form-header-text">' . esc_html($attrs['formHeaderText']) . '</div>';
        }

        $header_info = '';
        if ($title_html || $text_html) {
            $header_info = '<div class="cf7m-form-header-info">' . $title_html . $text_html . '</div>';
        }

        $form_header_html = '<div class="cf7m-form-header-container"><div class="cf7m-form-header">' . $icon_image_html . $header_info . '</div></div>';
    }

    // ── Classes & Shortcode ──────────────────────────────────────────────────

    $fullwidth_class = !empty($attrs['fullwidthButton']) ? ' cf7m-button-fullwidth' : '';
    $cr_class        = !empty($attrs['crCustomStyles']) ? ' dipe-cf7-cr' : '';

    $shortcode = do_shortcode(sprintf('[contact-form-7 id="%d"]', $form_id));
    if (strpos($shortcode, '[cf7m-presets') !== false || strpos($shortcode, '[/cf7m-presets]') !== false) {
        $shortcode = preg_replace('/\[cf7m-presets[^\]]*\]|\[\/cf7m-presets\]/i', '', $shortcode);
    }

    // ── Output ───────────────────────────────────────────────────────────────

    $style_tag = $css ? '<style>' . $css . '</style>' : '';

    $html  = $style_tag;
    $html .= '<div id="' . esc_attr($block_id) . '" class="cf7m-gutenberg-block' . esc_attr($fullwidth_class) . '">';
    $html .= $form_header_html; // Built from escaped parts
    $html .= '<div class="dipe-cf7 dipe-cf7-styler' . esc_attr($cr_class) . '">';
    $html .= $shortcode; // CF7 shortcode output
    $html .= '</div>';
    $html .= '</div>';

    return $html;
}


function cf7m_gb_build_css($a, $s)
{
    $rules = [];

    $field_sel   = $s . ' .dipe-cf7-styler .wpcf7 input:not([type=submit]):not([type=checkbox]):not([type=radio]),' .
        $s . ' .dipe-cf7-styler .wpcf7 select,' .
        $s . ' .dipe-cf7-styler .wpcf7 textarea';
    $button_sel  = $s . ' .dipe-cf7-styler .wpcf7-form input[type=submit]';

    // ── Form Header ──────────────────────────────────────────────────────────
    $header_props = [];
    if (cf7m_gb_val($a, 'formHeaderBg')) {
        $header_props[] = 'background-color:' . esc_attr($a['formHeaderBg']);
    }
    cf7m_gb_padding($a, 'formHeaderPadding', $header_props);
    if (cf7m_gb_val($a, 'formHeaderBottomSpacing')) {
        $header_props[] = 'margin-bottom:' . esc_attr($a['formHeaderBottomSpacing']);
    }
    if ($header_props) {
        $rules[] = $s . ' .cf7m-form-header-container{' . implode(';', $header_props) . '}';
    }

    $hicon_props = [];
    if (cf7m_gb_val($a, 'formHeaderImgBg')) {
        $hicon_props[] = 'background-color:' . esc_attr($a['formHeaderImgBg']);
    }
    if ($hicon_props) {
        $rules[] = $s . ' .cf7m-form-header-icon,' . $s . ' .cf7m-form-header-image{' . implode(';', $hicon_props) . '}';
    }
    if (cf7m_gb_val($a, 'formHeaderIconColor')) {
        $rules[] = $s . ' .cf7m-form-header-icon i{color:' . esc_attr($a['formHeaderIconColor']) . '}';
        $rules[] = $s . ' .cf7m-form-header-icon svg{fill:' . esc_attr($a['formHeaderIconColor']) . '}';
    }

    // ── Form Common ──────────────────────────────────────────────────────────
    $form_props = [];
    if (cf7m_gb_val($a, 'formBg')) {
        $form_props[] = 'background-color:' . esc_attr($a['formBg']);
    }
    cf7m_gb_padding($a, 'formPadding', $form_props);
    if (cf7m_gb_val($a, 'formBorderRadius')) {
        $form_props[] = 'border-radius:' . esc_attr($a['formBorderRadius']);
    }
    if ($form_props) {
        $rules[] = $s . ' .dipe-cf7-styler{' . implode(';', $form_props) . '}';
    }

    // Fullwidth button
    if (!empty($a['fullwidthButton'])) {
        $rules[] = $s . ' .cf7m-button-fullwidth .wpcf7-form input[type=submit]{width:100%}';
    }

    // Button alignment
    if (!empty($a['buttonAlignment']) && $a['buttonAlignment'] !== 'left' && empty($a['fullwidthButton'])) {
        $rules[] = $s . ' .cf7m-gutenberg-block .wpcf7-form p:last-of-type{text-align:' . esc_attr($a['buttonAlignment']) . '}';
    }

    // ── Fields ───────────────────────────────────────────────────────────────
    $field_props = [];
    if (cf7m_gb_val($a, 'fieldBgColor')) {
        $field_props[] = 'background-color:' . esc_attr($a['fieldBgColor']);
    }
    if (cf7m_gb_val($a, 'fieldTextColor')) {
        $field_props[] = 'color:' . esc_attr($a['fieldTextColor']);
    }
    if (cf7m_gb_val($a, 'fieldHeight')) {
        $height_sel = $s . ' .dipe-cf7-styler .wpcf7 input:not([type=submit]):not([type=checkbox]):not([type=radio]),' .
            $s . ' .dipe-cf7-styler .wpcf7 select';
        $rules[]    = $height_sel . '{height:' . esc_attr($a['fieldHeight']) . '}';
    }
    cf7m_gb_padding($a, 'fieldPadding', $field_props);
    if (cf7m_gb_val($a, 'fieldBorderWidth')) {
        $border_style  = cf7m_gb_val($a, 'fieldBorderStyle') ? $a['fieldBorderStyle'] : 'solid';
        $border_color  = cf7m_gb_val($a, 'fieldBorderColor') ? $a['fieldBorderColor'] : '';
        $field_props[] = 'border:' . esc_attr($a['fieldBorderWidth']) . ' ' . esc_attr($border_style) . ($border_color ? ' ' . esc_attr($border_color) : '');
    }
    if (cf7m_gb_val($a, 'fieldBorderRadius')) {
        $field_props[] = 'border-radius:' . esc_attr($a['fieldBorderRadius']);
    }
    if ($field_props) {
        $rules[] = $field_sel . '{' . implode(';', $field_props) . '}';
    }
    if (cf7m_gb_val($a, 'fieldFocusBorderColor')) {
        $focus_sel = $s . ' .dipe-cf7-styler .wpcf7 input:not([type=submit]):focus,' .
            $s . ' .dipe-cf7-styler .wpcf7 select:focus,' .
            $s . ' .dipe-cf7-styler .wpcf7 textarea:focus';
        $rules[]   = $focus_sel . '{border-color:' . esc_attr($a['fieldFocusBorderColor']) . '}';
    }
    if (cf7m_gb_val($a, 'fieldSpacing')) {
        $spacing_sel = $s . ' .dipe-cf7-styler .wpcf7 form > p,' .
            $s . ' .dipe-cf7-styler .wpcf7 form > div,' .
            $s . ' .dipe-cf7-styler .wpcf7 form > label';
        $rules[]     = $spacing_sel . '{margin-bottom:' . esc_attr($a['fieldSpacing']) . '}';
    }

    // ── Labels ───────────────────────────────────────────────────────────────
    $label_props = [];
    if (cf7m_gb_val($a, 'labelColor')) {
        $label_props[] = 'color:' . esc_attr($a['labelColor']);
    }
    if ($label_props) {
        $rules[] = $s . ' .dipe-cf7-styler .wpcf7 label{' . implode(';', $label_props) . '}';
    }
    if (cf7m_gb_val($a, 'labelSpacing')) {
        $rules[] = $s . ' .dipe-cf7-styler .wpcf7 .wpcf7-form-control:not(.wpcf7-submit){margin-top:' . esc_attr($a['labelSpacing']) . '}';
    }

    // ── Placeholder ───────────────────────────────────────────────────────────
    if (cf7m_gb_val($a, 'placeholderColor')) {
        $ph_sel  = $s . ' .dipe-cf7-styler .wpcf7 input::placeholder,' .
            $s . ' .dipe-cf7-styler .wpcf7 textarea::placeholder';
        $rules[] = $ph_sel . '{color:' . esc_attr($a['placeholderColor']) . '}';
    }

    // ── Radio & Checkbox ──────────────────────────────────────────────────────
    if (!empty($a['crCustomStyles'])) {
        $cr_before = $s . ' .dipe-cf7-cr .wpcf7-checkbox input[type=checkbox] + span:before,' .
            $s . ' .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox] + span:before,' .
            $s . ' .dipe-cf7-cr .wpcf7-radio input[type=radio] + span:before';

        if (cf7m_gb_val($a, 'crSize')) {
            $rules[] = $cr_before . '{width:' . esc_attr($a['crSize']) . ';height:' . esc_attr($a['crSize']) . '}';
        }
        if (cf7m_gb_val($a, 'crBgColor')) {
            $rules[] = $s . ' .dipe-cf7-cr .wpcf7-checkbox input[type=checkbox] + span:before,' .
                $s . ' .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox] + span:before,' .
                $s . ' .dipe-cf7-cr .wpcf7-radio input[type=radio]:not(:checked) + span:before' .
                '{background-color:' . esc_attr($a['crBgColor']) . '}';
        }
        if (cf7m_gb_val($a, 'crSelectedColor')) {
            $rules[] = $s . ' .dipe-cf7-cr .wpcf7-checkbox input[type=checkbox]:checked + span:before,' .
                $s . ' .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox]:checked + span:before' .
                '{color:' . esc_attr($a['crSelectedColor']) . '}';
            $rules[] = $s . ' .dipe-cf7-cr .wpcf7-radio input[type=radio]:checked + span:before{background-color:' . esc_attr($a['crSelectedColor']) . '}';
        }
        if (cf7m_gb_val($a, 'crBorderColor')) {
            $rules[] = $cr_before . '{border-color:' . esc_attr($a['crBorderColor']) . '}';
        }
        if (cf7m_gb_val($a, 'crBorderSize')) {
            $rules[] = $cr_before . '{border-width:' . esc_attr($a['crBorderSize']) . '}';
        }
        if (cf7m_gb_val($a, 'crLabelColor')) {
            $rules[] = $s . ' .dipe-cf7-cr .wpcf7-checkbox label,' . $s . ' .dipe-cf7-cr .wpcf7-radio label{color:' . esc_attr($a['crLabelColor']) . '}';
        }
    }

    // ── Button ───────────────────────────────────────────────────────────────
    $btn_normal = [];
    if (cf7m_gb_val($a, 'buttonTextColor')) {
        $btn_normal[] = 'color:' . esc_attr($a['buttonTextColor']);
    }
    if (cf7m_gb_val($a, 'buttonBgColor')) {
        $btn_normal[] = 'background-color:' . esc_attr($a['buttonBgColor']);
    }
    cf7m_gb_padding($a, 'buttonPadding', $btn_normal);
    if (cf7m_gb_val($a, 'buttonBorderRadius')) {
        $btn_normal[] = 'border-radius:' . esc_attr($a['buttonBorderRadius']);
    }
    if ($btn_normal) {
        $rules[] = $button_sel . '{' . implode(';', $btn_normal) . '}';
    }

    $btn_hover = [];
    if (cf7m_gb_val($a, 'buttonTextColorHover')) {
        $btn_hover[] = 'color:' . esc_attr($a['buttonTextColorHover']);
    }
    if (cf7m_gb_val($a, 'buttonBgColorHover')) {
        $btn_hover[] = 'background-color:' . esc_attr($a['buttonBgColorHover']);
    }
    if (cf7m_gb_val($a, 'buttonBorderColorHover')) {
        $btn_hover[] = 'border-color:' . esc_attr($a['buttonBorderColorHover']);
    }
    if ($btn_hover) {
        $rules[] = $button_sel . ':hover{' . implode(';', $btn_hover) . '}';
    }

    // ── Messages (validation) ─────────────────────────────────────────────────
    $msg_sel   = $s . ' .dipe-cf7-styler span.wpcf7-not-valid-tip';
    $msg_props = [];
    if (cf7m_gb_val($a, 'msgColor')) {
        $msg_props[] = 'color:' . esc_attr($a['msgColor']);
    }
    if (cf7m_gb_val($a, 'msgBgColor')) {
        $msg_props[] = 'background-color:' . esc_attr($a['msgBgColor']);
    }
    if (cf7m_gb_val($a, 'msgBorderColor')) {
        $msg_props[] = 'border:2px solid ' . esc_attr($a['msgBorderColor']);
    }
    if (cf7m_gb_val($a, 'msgPadding')) {
        $msg_props[] = 'padding:' . esc_attr($a['msgPadding']);
    }
    if (cf7m_gb_val($a, 'msgMarginTop')) {
        $msg_props[] = 'margin-top:' . esc_attr($a['msgMarginTop']);
    }
    if ($msg_props) {
        $rules[] = $msg_sel . '{' . implode(';', $msg_props) . '}';
    }
    if (cf7m_gb_val($a, 'msgAlignment')) {
        $align_sel = $s . ' .dipe-cf7-styler .wpcf7 form .wpcf7-response-output,' . $msg_sel;
        $rules[]   = $align_sel . '{text-align:' . esc_attr($a['msgAlignment']) . '}';
    }

    // ── Success message ───────────────────────────────────────────────────────
    $success_sel   = $s . ' .dipe-cf7-styler .wpcf7 form.sent .wpcf7-response-output';
    $success_props = [];
    if (cf7m_gb_val($a, 'successMsgColor')) {
        $success_props[] = 'color:' . esc_attr($a['successMsgColor']);
    }
    if (cf7m_gb_val($a, 'successMsgBgColor')) {
        $success_props[] = 'background-color:' . esc_attr($a['successMsgBgColor']);
    }
    if (cf7m_gb_val($a, 'successBorderColor')) {
        $success_props[] = 'border-color:' . esc_attr($a['successBorderColor']);
    }
    if ($success_props) {
        $rules[] = $success_sel . '{' . implode(';', $success_props) . '}';
    }

    // ── Error message ─────────────────────────────────────────────────────────
    $error_sel   = $s . ' .dipe-cf7-styler .wpcf7 form .wpcf7-response-output';
    $error_props = [];
    if (cf7m_gb_val($a, 'errorMsgColor')) {
        $error_props[] = 'color:' . esc_attr($a['errorMsgColor']);
    }
    if (cf7m_gb_val($a, 'errorMsgBgColor')) {
        $error_props[] = 'background-color:' . esc_attr($a['errorMsgBgColor']);
    }
    if (cf7m_gb_val($a, 'errorBorderColor')) {
        $error_props[] = 'border-color:' . esc_attr($a['errorBorderColor']);
    }
    if ($error_props) {
        $rules[] = $error_sel . '{' . implode(';', $error_props) . '}';
    }

    return implode("\n", $rules);
}

/**
 * Returns true if the attribute key exists and has a non-empty string value.
 */
function cf7m_gb_val($attrs, $key)
{
    return isset($attrs[$key]) && '' !== $attrs[$key];
}

/**
 * Appends padding shorthand to a CSS properties array when any padding side is set.
 * Prefix: e.g. 'formPadding' → reads formPaddingTop/Right/Bottom/Left.
 */
function cf7m_gb_padding($attrs, $prefix, &$props)
{
    $t = isset($attrs[$prefix . 'Top'])    ? $attrs[$prefix . 'Top']    : '';
    $r = isset($attrs[$prefix . 'Right'])  ? $attrs[$prefix . 'Right']  : '';
    $b = isset($attrs[$prefix . 'Bottom']) ? $attrs[$prefix . 'Bottom'] : '';
    $l = isset($attrs[$prefix . 'Left'])   ? $attrs[$prefix . 'Left']   : '';

    if ($t !== '' || $r !== '' || $b !== '' || $l !== '') {
        $t = $t ?: '0';
        $r = $r ?: '0';
        $b = $b ?: '0';
        $l = $l ?: '0';
        $props[] = 'padding:' . esc_attr($t) . ' ' . esc_attr($r) . ' ' . esc_attr($b) . ' ' . esc_attr($l);
    }
}
