<?php

namespace CF7_Mate;

if (!defined('ABSPATH')) {
    exit;
}

class Onboarding
{
    private static $instance = null;

    const ONBOARDING_COMPLETED_OPTION = 'cf7m_onboarding_completed';
    const ONBOARDING_SKIPPED_OPTION = 'cf7m_onboarding_skipped';
    const ONBOARDING_STEP_OPTION = 'cf7m_onboarding_step';
    const REBRAND_SEEN_OPTION = 'cf7m_rebrand_seen';
    const REBRAND_VERSION = '3.0.0';

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
        add_action('admin_init', [$this, 'maybe_restart_guided_setup'], 5);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_action('admin_footer', [$this, 'render_onboarding_root']);
        add_action('wp_ajax_cf7m_check_onboarding_status', [$this, 'check_onboarding_status']);
        add_action('wp_ajax_cf7m_complete_onboarding', [$this, 'complete_onboarding']);
        add_action('wp_ajax_cf7m_skip_onboarding', [$this, 'skip_onboarding']);
        add_action('wp_ajax_cf7m_next_onboarding_step', [$this, 'next_step']);
        add_action('wp_ajax_cf7m_dismiss_rebrand', [$this, 'dismiss_rebrand']);
    }

    /**
     * If user clicks "Guided Setup" from Quick Access (skipped state), reset onboarding and redirect so modal shows.
     */
    public function maybe_restart_guided_setup()
    {
        if (!current_user_can('manage_options')) {
            return;
        }
        $param = isset($_GET['cf7m_guided_setup']) ? sanitize_text_field(wp_unslash($_GET['cf7m_guided_setup'])) : '';
        if ($param !== '1') {
            return;
        }
        self::reset_onboarding();
        wp_safe_redirect(admin_url('admin.php?page=cf7-mate-dashboard'));
        exit;
    }

    public function enqueue_scripts($hook)
    {
        // Gate on ?page= directly — more reliable than hook name which Freemius can alter.
        // Match any CF7 Mate admin page (cf7-mate, cf7-mate-dashboard, cf7-mate-account, etc.)
        // so onboarding shows regardless of which page Freemius redirects to after opt-in.
        $page = isset($_GET['page']) ? sanitize_key(wp_unslash($_GET['page'])) : ''; // phpcs:ignore WordPress.Security.NonceVerification
        if (strpos($page, 'cf7-mate') !== 0) {
            return;
        }

        // On the top-level cf7-mate page Freemius shows its own opt-in modal.
        // Suppress onboarding there while opt-in is still pending to avoid two modals at once.
        if ($page === 'cf7-mate' && function_exists('cf7m_fs')) {
            $fs = cf7m_fs();
            if (!$fs->is_registered() && !$fs->is_anonymous()) {
                return;
            }
        }

        // Only show full-screen onboarding for new users (not yet completed/skipped).
        // Rebrand is handled by the subtle dashboard banner (V3Banner), not part of onboarding.
        $onboarding_done = $this->is_onboarding_completed() || $this->is_onboarding_skipped();
        if ($onboarding_done) {
            return;
        }

        $onboarding_js = CF7M_PLUGIN_PATH . 'dist/js/onboarding.js';
        wp_enqueue_script(
            'cf7m-onboarding',
            CF7M_PLUGIN_URL . 'dist/js/onboarding.js',
            ['react', 'wp-element', 'wp-i18n', 'wp-dom-ready'],
            CF7M_VERSION . (file_exists($onboarding_js) ? '.' . filemtime($onboarding_js) : ''),
            true
        );

        $onboarding_css = CF7M_PLUGIN_PATH . 'dist/css/onboarding.css';
        if (file_exists($onboarding_css)) {
            wp_enqueue_style(
                'cf7m-onboarding',
                CF7M_PLUGIN_URL . 'dist/css/onboarding.css',
                [],
                CF7M_VERSION . '.' . filemtime($onboarding_css)
            );
        }

        wp_localize_script('cf7m-onboarding', 'dcsOnboarding', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('cf7m_onboarding_nonce'),
            'current_step' => $this->get_current_step(),
            'create_page_url' => admin_url('post-new.php?post_type=page'),
            'cf7_admin_url' => admin_url('admin.php?page=wpcf7'),
            'dashboard_url' => admin_url('admin.php?page=cf7-mate-dashboard'),
            'pricing_url' => function_exists('cf7m_get_pricing_url') ? cf7m_get_pricing_url('NEW2026') : CF7M_URL_PRICING,
            'is_pro' => function_exists('cf7m_can_use_premium') && cf7m_can_use_premium(),
            'rebrand_seen' => $this->is_rebrand_seen(),
            'onboarding_completed' => $this->is_onboarding_completed(),
            'version' => defined('CF7M_VERSION') ? CF7M_VERSION : '3.0.0',
        ]);
    }

    public function render_onboarding_root()
    {
        // Only render onboarding root for new users (rebrand is not part of onboarding)
        $onboarding_done = $this->is_onboarding_completed() || $this->is_onboarding_skipped();
        if ($onboarding_done) {
            return;
        }

        // Only on CF7 Mate pages — same broad match as enqueue_scripts.
        $page = isset($_GET['page']) ? sanitize_key(wp_unslash($_GET['page'])) : ''; // phpcs:ignore WordPress.Security.NonceVerification
        if (strpos($page, 'cf7-mate') !== 0) {
            return;
        }

        echo '<div id="cf7m-onboarding-root"></div>';
    }

    public function check_onboarding_status()
    {
        $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
        if (!$nonce || !wp_verify_nonce($nonce, 'cf7m_onboarding_nonce')) {
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
        if (!$nonce || !wp_verify_nonce($nonce, 'cf7m_onboarding_nonce')) {
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
        if (!$nonce || !wp_verify_nonce($nonce, 'cf7m_onboarding_nonce')) {
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
        if (!$nonce || !wp_verify_nonce($nonce, 'cf7m_onboarding_nonce')) {
            wp_send_json_error(['message' => 'Security check failed']);
        }

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Insufficient permissions']);
        }

        // Save feature settings if provided
        if (isset($_POST['features'])) {
            $features_json = sanitize_text_field(wp_unslash($_POST['features']));
            $features = json_decode($features_json, true);

            if (is_array($features)) {
                $defaults = [
                    'cf7_module' => true,
                    'bricks_module' => true,
                    'elementor_module' => true,
                    'gutenberg_module' => true,
                    'grid_layout' => true,
                    'multi_column' => true,
                    'multi_step' => true,
                    'star_rating' => true,
                    'database_entries' => true,
                    'range_slider' => true,
                    'separator' => true,
                    'image' => true,
                    'icon' => true,
                ];

                $sanitized = [];
                foreach ($defaults as $key => $default) {
                    $sanitized[$key] = isset($features[$key]) ? (bool) $features[$key] : $default;
                }

                update_option('cf7m_features', $sanitized);
            }
        }

        update_option(self::ONBOARDING_COMPLETED_OPTION, '1');
        delete_option(self::ONBOARDING_STEP_OPTION);
        delete_option(self::ONBOARDING_SKIPPED_OPTION);

        wp_send_json_success();
    }

    /**
     * Dismiss rebrand notification.
     *
     * @since 3.0.0
     */
    public function dismiss_rebrand()
    {
        $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
        if (!$nonce || !wp_verify_nonce($nonce, 'cf7m_onboarding_nonce')) {
            wp_send_json_error(['message' => 'Security check failed']);
        }

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Insufficient permissions']);
        }

        update_option(self::REBRAND_SEEN_OPTION, '1');

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

    /**
     * Check if rebrand notification has been seen.
     *
     * @since 3.0.0
     * @return bool
     */
    private function is_rebrand_seen()
    {
        return get_option(self::REBRAND_SEEN_OPTION, false) === '1';
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
