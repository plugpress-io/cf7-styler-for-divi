<?php

/**
 * Entries Module – load CPT, save, API; add Pro dashboard Entries submenu.
 *
 * @package CF7_Mate\Features\Entries
 * @since 3.0.0
 */

namespace CF7_Mate\Features\Entries;

use CF7_Mate\Premium_Loader;
use CF7_Mate\Pro\Pro_Feature_Base;
use CF7_Mate\Pro\Traits\Singleton;

if (!defined('ABSPATH')) {
    exit;
}

class Entries extends Pro_Feature_Base
{
    use Singleton;

    protected function __construct()
    {
        parent::__construct();
    }

    protected function init()
    {
        $this->load_components();
        add_action('admin_menu', [$this, 'add_entries_menu'], 21);
    }

    private function load_components()
    {
        $dir = __DIR__ . '/';
        if (file_exists($dir . 'cpt.php')) {
            require_once $dir . 'cpt.php';
            new Entries_CPT();
        }
        if (file_exists($dir . 'save.php')) {
            require_once $dir . 'save.php';
            new Entries_Save();
        }
        if (file_exists($dir . 'api.php')) {
            require_once $dir . 'api.php';
            new Entries_API();
        }
    }

    /**
     * Add Entries submenu under Contact Form 7 (Pro + database_entries only).
     * Renders the Entries UI on admin.php?page=cf7-mate-entries for better navigation.
     */
    public function add_entries_menu()
    {
        if (!function_exists('cf7m_can_use_premium') || !cf7m_can_use_premium()) {
            return;
        }
        if (!class_exists(Premium_Loader::class) || !Premium_Loader::is_feature_enabled('database_entries')) {
            return;
        }
        if (!current_user_can('manage_options')) {
            return;
        }

        add_submenu_page(
            'wpcf7',
            __('Form Entries', 'cf7-styler-for-divi'),
            __('Entries', 'cf7-styler-for-divi'),
            'manage_options',
            'cf7-mate-entries',
            [$this, 'render_entries_page']
        );
    }

    /**
     * Render the Entries view on this page (same app, entries-only mode).
     */
    public function render_entries_page()
    {
        \CF7_Mate\Admin::get_instance()->render_app_root(['entries_only' => true]);
    }
}
