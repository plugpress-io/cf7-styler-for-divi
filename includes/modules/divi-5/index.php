<?php
namespace DiviCF7Styler;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

add_action('et_builder_modules_loaded', function() {
    ET_Builder_Module_Registration::get_instance()->register_module([
        'file_path' => __DIR__ . '/server/Modules/CF7Styler/CF7StylerTraits',
        'module_slug' => 'dvppl_cf7_styler',
        'group_slug' => 'divi-cf7-styler',
        'group_label' => __('CF7 Styler', 'cf7-styler-for-divi'),
    ]);
});
