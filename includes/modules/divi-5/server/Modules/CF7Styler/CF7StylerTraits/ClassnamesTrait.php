<?php

namespace DiviCF7Styler\Modules\CF7Styler\CF7StylerTraits;

trait ClassnamesTrait {
    public function get_classnames($attrs) {
        $classnames = ['dipe-cf7-styler'];
        
        if (isset($attrs['content']['use_form_button_fullwidth']) && $attrs['content']['use_form_button_fullwidth']) {
            $classnames[] = 'dipe-cf7-button-full-width';
        }
        
        if (isset($attrs['content']['button_alignment']) && !$attrs['content']['use_form_button_fullwidth']) {
            $classnames[] = 'dipe-cf7-button-' . $attrs['content']['button_alignment'];
        }
        
        if (isset($attrs['advanced']['form_header']['use_form_header']) && $attrs['advanced']['form_header']['use_form_header']) {
            $classnames[] = 'dipe-cf7-has-header';
        }
        
        return $classnames;
    }
}
