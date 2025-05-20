<?php

namespace DiviCF7Styler\Modules\CF7Styler\CF7StylerTraits;

trait RenderContentTrait {
    public function render_content($attrs, $content) {
        $controller = new \DiviCF7Styler\Modules\CF7Styler\CF7StylerController();
        $form_content = $controller->get_form_content($attrs);
        
        $output = '<div class="dipe-cf7">';
        
        if (isset($attrs['advanced']['form_header']['use_form_header']) && 
            $attrs['advanced']['form_header']['use_form_header']) {
            $output .= $this->render_form_header($attrs);
        }
        
        $output .= '<div class="dipe-cf7-content">' . $form_content . '</div>';
        
        $output .= '</div>';
        
        return $output;
    }
    
    protected function render_form_header($attrs) {
        $output = '<div class="dipe-form-header-container">';
        
        if (isset($attrs['advanced']['form_header']['header_icon']) && 
            !empty($attrs['advanced']['form_header']['header_icon'])) {
            $output .= '<div class="dipe-form-header-icon">';
            $output .= '<span class="et-pb-icon">' . esc_html($attrs['advanced']['form_header']['header_icon']) . '</span>';
            $output .= '</div>';
        }
        
        if (isset($attrs['advanced']['form_header']['form_header_title']) && 
            !empty($attrs['advanced']['form_header']['form_header_title'])) {
            $output .= '<h2 class="dipe-form-header-title">' . esc_html($attrs['advanced']['form_header']['form_header_title']) . '</h2>';
        }
        
        if (isset($attrs['advanced']['form_header']['form_header_text']) && 
            !empty($attrs['advanced']['form_header']['form_header_text'])) {
            $output .= '<div class="dipe-form-header-text">' . $attrs['advanced']['form_header']['form_header_text'] . '</div>';
        }
        
        $output .= '</div>';
        
        return $output;
    }
}
