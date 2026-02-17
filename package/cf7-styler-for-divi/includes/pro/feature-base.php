<?php
/**
 * Base class for Pro features. Subclasses use Singleton and call parent::__construct().
 *
 * @package CF7_Mate\Pro
 * @since 3.0.0
 */

namespace CF7_Mate\Pro;

if (!defined('ABSPATH')) {
    exit;
}

abstract class Pro_Feature_Base
{
    protected function __construct()
    {
        $this->init();
    }

    abstract protected function init();

    public static function page_has_cf7_form(): bool
    {
        if (function_exists('et_core_is_fb_enabled') && et_core_is_fb_enabled()) {
            return true;
        }
        global $post;
        if (!$post || !is_singular()) {
            return false;
        }
        if (has_shortcode($post->post_content, 'contact-form-7')) {
            return true;
        }
        if (strpos($post->post_content, 'dvppl_cf7_styler') !== false) {
            return true;
        }
        if (strpos($post->post_content, 'cf7-styler-for-divi/cf7-styler') !== false) {
            return true;
        }
        return false;
    }
}
