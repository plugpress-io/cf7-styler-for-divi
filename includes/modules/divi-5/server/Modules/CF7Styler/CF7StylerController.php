<?php

namespace DiviCF7Styler\Modules\CF7Styler;

class CF7StylerController {
    public function get_form_content($attrs) {
        $cf7_id = isset($attrs['content']['cf7']) ? $attrs['content']['cf7'] : 0;
        
        if (0 === $cf7_id) {
            return 'Please select a Contact Form 7.';
        } else {
            return do_shortcode(sprintf('[contact-form-7 id="%1$s"]', $cf7_id));
        }
    }
}
