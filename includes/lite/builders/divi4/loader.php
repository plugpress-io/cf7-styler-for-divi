<?php
/**
 * Divi 4 builder: load base and module classes.
 * Called from Plugin::load_modules() on et_builder_ready.
 *
 * @package CF7_Mate\Lite\Builders\Divi4
 */

if (!defined('ABSPATH')) {
    exit;
}

$base = __DIR__ . '/Base/Base.php';
if (file_exists($base)) {
    require_once $base;
}
