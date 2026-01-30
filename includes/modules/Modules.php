<?php

namespace CF7_Mate\Modules;

if (!defined('ABSPATH')) {
    die('Direct access forbidden.');
}

// Load module class files
require_once __DIR__ . '/CF7Styler/CF7Styler.php';

use CF7_Mate\Modules\CF7Styler\CF7Styler;

// Register Divi 5 module with high priority to ensure it loads early
add_action(
    'divi_module_library_modules_dependency_tree',
    function ($dependency_tree) {
        $module = new CF7Styler();
        $dependency_tree->add_dependency($module);
    },
    5 // High priority to load early
);
