<?php

namespace DiviCF7Styler\Modules\CF7Styler\CF7StylerTraits;

trait ScriptDataTrait {
    public function get_script_data($attrs) {
        return [
            'cf7_id' => isset($attrs['content']['cf7']) ? $attrs['content']['cf7'] : 0,
        ];
    }
}
