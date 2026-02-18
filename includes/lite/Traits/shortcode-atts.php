<?php

namespace CF7_Mate\Lite\Traits;

if (!defined('ABSPATH')) {
    exit;
}

trait Shortcode_Atts_Trait
{
    protected function parse_atts(string $text): array
    {
        $atts = [];
        if (preg_match_all('/(\w+):(?:"([^"]+)"|\'([^\']+)\'|([^\s\]]+))/', $text, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $atts[$match[1]] = !empty($match[2]) ? $match[2] : (!empty($match[3]) ? $match[3] : $match[4]);
            }
        }
        return $atts;
    }
}
