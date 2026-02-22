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

$cf7m_base = __DIR__ . '/Base/Base.php';
if (file_exists($cf7m_base)) {
    require_once $cf7m_base;
}
