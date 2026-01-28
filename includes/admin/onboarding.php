<?php

namespace Divi_CF7_Styler;

if (!defined('ABSPATH')) {
    exit;
}

class Onboarding
{
    private static $instance = null;

    const ONBOARDING_COMPLETED_OPTION = 'dcs_onboarding_completed';
    const ONBOARDING_SKIPPED_OPTION = 'dcs_onboarding_skipped';
    const ONBOARDING_STEP_OPTION = 'dcs_onboarding_step';

    public static function instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        $this->init();
    }

    private function init()
    {
        add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_action('admin_footer', [$this, 'render_onboarding_root']);
        add_action('wp_ajax_dcs_check_onboarding_status', [$this, 'check_onboarding_status']);
        add_action('wp_ajax_dcs_complete_onboarding', [$this, 'complete_onboarding']);
        add_action('wp_ajax_dcs_skip_onboarding', [$this, 'skip_onboarding']);
        add_action('wp_ajax_dcs_next_onboarding_step', [$this, 'next_step']);
    }

    public function enqueue_scripts($hook)
    {
        // Only show onboarding on plugin pages and dashboard.
        // Hook can be top-level or submenu under Divi (divi_page_cf7-styler).
        $allowed_hooks = [
            'index.php',
            'plugins.php',
            'toplevel_page_cf7-styler',
            'toplevel_page_cf7-styler-for-divi',
            'divi_page_cf7-styler',
        ];

        if (!in_array($hook, $allowed_hooks, true)) {
            return;
        }

        // Check if onboarding is already completed or skipped
        if ($this->is_onboarding_completed() || $this->is_onboarding_skipped()) {
            return;
        }

        $onboarding_js = DCS_PLUGIN_PATH . 'dist/js/onboarding.js';
        wp_enqueue_script(
            'dcs-onboarding',
            DCS_PLUGIN_URL . 'dist/js/onboarding.js',
            ['react', 'wp-element', 'wp-i18n', 'wp-dom-ready'],
            DCS_VERSION . (file_exists($onboarding_js) ? '.' . filemtime($onboarding_js) : ''),
            true
        );

        $onboarding_css = DCS_PLUGIN_PATH . 'dist/css/onboarding.css';
        if (file_exists($onboarding_css)) {
            wp_enqueue_style(
                'dcs-onboarding',
                DCS_PLUGIN_URL . 'dist/css/onboarding.css',
                [],
                DCS_VERSION . '.' . filemtime($onboarding_css)
            );
        }

        $discount_code = $this->get_discount_code();
        wp_localize_script('dcs-onboarding', 'dcsOnboarding', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('dcs_onboarding_nonce'),
            'current_step' => $this->get_current_step(),
            'discount_code' => $discount_code,
            'create_page_url' => admin_url('post-new.php?post_type=page'),
        ]);
    }

    public function render_onboarding_root()
    {
        // Check if onboarding is already completed or skipped
        if ($this->is_onboarding_completed() || $this->is_onboarding_skipped()) {
            return;
        }

        // Only show on allowed pages.
        $screen = get_current_screen();
        $allowed_screens = [
            'dashboard',
            'plugins',
            'toplevel_page_cf7-styler',
            'toplevel_page_cf7-styler-for-divi',
            'divi_page_cf7-styler',
        ];

        if (!$screen || !in_array($screen->id, $allowed_screens, true)) {
            return;
        }

        echo '<div id="dcs-onboarding-root"></div>';
    }

    public function check_onboarding_status()
    {
        $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
        if (!$nonce || !wp_verify_nonce($nonce, 'dcs_onboarding_nonce')) {
            wp_send_json_error(['message' => 'Security check failed']);
        }

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Insufficient permissions']);
        }

        $should_show = !$this->is_onboarding_completed() && !$this->is_onboarding_skipped();
        $current_step = $this->get_current_step();

        wp_send_json_success([
            'should_show' => $should_show,
            'current_step' => $current_step,
        ]);
    }

    public function skip_onboarding()
    {
        $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
        if (!$nonce || !wp_verify_nonce($nonce, 'dcs_onboarding_nonce')) {
            wp_send_json_error(['message' => 'Security check failed']);
        }

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Insufficient permissions']);
        }

        update_option(self::ONBOARDING_SKIPPED_OPTION, '1');
        delete_option(self::ONBOARDING_STEP_OPTION);

        wp_send_json_success();
    }

    public function next_step()
    {
        $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
        if (!$nonce || !wp_verify_nonce($nonce, 'dcs_onboarding_nonce')) {
            wp_send_json_error(['message' => 'Security check failed']);
        }

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Insufficient permissions']);
        }

        $step = isset($_POST['step']) ? absint(wp_unslash($_POST['step'])) : $this->get_current_step();
        update_option(self::ONBOARDING_STEP_OPTION, $step);

        wp_send_json_success([
            'step' => $step,
        ]);
    }

    public function complete_onboarding()
    {
        $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
        if (!$nonce || !wp_verify_nonce($nonce, 'dcs_onboarding_nonce')) {
            wp_send_json_error(['message' => 'Security check failed']);
        }

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Insufficient permissions']);
        }

        update_option(self::ONBOARDING_COMPLETED_OPTION, '1');
        delete_option(self::ONBOARDING_STEP_OPTION);
        delete_option(self::ONBOARDING_SKIPPED_OPTION);

        wp_send_json_success();
    }

    private function is_onboarding_completed()
    {
        return get_option(self::ONBOARDING_COMPLETED_OPTION, false) === '1';
    }

    private function is_onboarding_skipped()
    {
        return get_option(self::ONBOARDING_SKIPPED_OPTION, false) === '1';
    }

    private function get_current_step()
    {
        $step = get_option(self::ONBOARDING_STEP_OPTION, 1);
        return (int) $step;
    }

    /**
     * Get dynamic discount code based on current month.
     * Format: JAN2026, FEB2026, MAR2026, etc.
     *
     * @since 3.0.0
     * @return string
     */
    private function get_discount_code()
    {
        $month_names = [
            1 => 'JAN',
            2 => 'FEB',
            3 => 'MAR',
            4 => 'APR',
            5 => 'MAY',
            6 => 'JUN',
            7 => 'JUL',
            8 => 'AUG',
            9 => 'SEP',
            10 => 'OCT',
            11 => 'NOV',
            12 => 'DEC',
        ];

        $current_month = (int) date('n');
        $current_year = date('Y');
        $month_code = isset($month_names[$current_month]) ? $month_names[$current_month] : 'JAN';

        return $month_code . $current_year;
    }

    /**
     * Check if onboarding was skipped (for admin notice).
     *
     * @since 3.0.0
     * @return bool
     */
    public static function is_skipped()
    {
        return get_option(self::ONBOARDING_SKIPPED_OPTION, false) === '1';
    }

    /**
     * Reset onboarding (for admin notice "Complete Onboarding" button).
     *
     * @since 3.0.0
     */
    public static function reset_onboarding()
    {
        delete_option(self::ONBOARDING_SKIPPED_OPTION);
        delete_option(self::ONBOARDING_COMPLETED_OPTION);
        update_option(self::ONBOARDING_STEP_OPTION, 1);
    }
}
