<?php
/**
 * Base class for all Pro features.
 *
 * Subclasses should use Singleton trait and call parent::__construct() from their constructor.
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
    /**
     * Constructor. Subclasses use Singleton trait and call parent::__construct() so init() runs.
     */
    protected function __construct()
    {
        $this->init();
    }

    /**
     * Initialize the feature (register hooks, etc.). Implement in subclass.
     */
    abstract protected function init();

    /**
     * Whether the current page has a CF7 form (shortcode or Divi CF7 Styler module).
     * Use for conditional enqueue of Pro frontend assets.
     *
     * @return bool
     */
    public static function page_has_cf7_form(): bool
    {
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
