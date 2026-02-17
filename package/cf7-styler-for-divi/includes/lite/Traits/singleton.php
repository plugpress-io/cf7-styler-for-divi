<?php
/**
 * Singleton trait for lite features.
 *
 * @package CF7_Mate\Lite\Traits
 * @since 3.0.0
 */

namespace CF7_Mate\Lite\Traits;

if (!defined('ABSPATH')) {
    exit;
}

trait Singleton
{
    private static $instance = null;

    public static function instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
}
