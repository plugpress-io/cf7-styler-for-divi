<?php
/**
 * Divi 5 builder: register CF7 Styler module with the dependency tree.
 *
 * @package CF7_Mate\Lite\Builders\Divi5
 */

if (!defined('ABSPATH')) {
    exit;
}

$dependency_interface = ABSPATH . 'wp-content/themes/Divi/includes/builder-5/server/Framework/DependencyManagement/Interfaces/DependencyInterface.php';
if (!file_exists($dependency_interface)) {
    return;
}

require_once __DIR__ . '/CF7Styler/CF7Styler.php';

use CF7_Mate\Modules\CF7Styler\CF7Styler;

add_action(
    'divi_module_library_modules_dependency_tree',
    function ($dependency_tree) {
        $module = new CF7Styler();
        $dependency_tree->add_dependency($module);
    },
    5
);
