<?php
/**
 * Singleton trait for Pro features.
 *
 * @package CF7_Mate\Pro\Traits
 * @since 3.0.0
 */

namespace CF7_Mate\Pro\Traits;

if (!defined('ABSPATH')) {
    exit;
}

trait Singleton
{
    /** @var static|null */
    private static $instance = null;

    /**
     * Get the singleton instance.
     *
     * @return static
     */
    public static function instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
}
