<?php

namespace Divi_CF7_Styler;

class Admin_Review_Notice
{
    private static $instance = null;

    const NOTICE_ID = 'dcs_review_notice';
    const DISMISSED_OPTION = 'dcs_review_notice_dismissed';
    const INSTALL_DATE_OPTION = 'divi_cf7_styler_install_date';
    const REVIEW_DELAY = 7 * 24 * 60 * 60; // 7 days in seconds
    //const REVIEW_DELAY = 60; // 1 minute in seconds

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
        add_action('admin_notices', [$this, 'display_notice']);
        add_action('wp_ajax_dcs_dismiss_review_notice', [$this, 'dismiss_notice']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);
    }

    public function enqueue_scripts($hook)
    {
        // Only load on admin pages
        if (!in_array($hook, ['index.php', 'plugins.php', 'edit.php', 'post.php', 'post-new.php'])) {
            return;
        }

        wp_enqueue_script(
            'dcs-admin-notice',
            DCS_PLUGIN_URL . 'dist/js/admin-notice.js',
            ['jquery'],
            DCS_VERSION,
            true
        );

        wp_localize_script('dcs-admin-notice', 'dcs_admin_notice', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('dcs_dismiss_notice'),
            'notice_id' => self::NOTICE_ID
        ]);
    }

    public function display_notice()
    {
        // Check if notice should be displayed
        if (!$this->should_display_notice()) {
            return;
        }

        // Check if user has dismissed the notice
        if ($this->is_notice_dismissed()) {
            return;
        }

        $this->render_notice();
    }

    private function should_display_notice()
    {
        $install_date = get_option(self::INSTALL_DATE_OPTION);

        if (!$install_date) {
            return false;
        }

        $current_time = time();
        $time_since_install = $current_time - $install_date;

        return $time_since_install >= self::REVIEW_DELAY;
    }

    private function is_notice_dismissed()
    {
        return get_user_meta(get_current_user_id(), self::DISMISSED_OPTION, true) === '1';
    }

    private function render_notice()
    {
?>
        <div id="<?php echo esc_attr(self::NOTICE_ID); ?>" class="dcs-admin-notice dcs-review-notice notice notice-info is-dismissible">
            <div class="dcs-notice-content">
                <div class="dcs-notice-text">
                    <h3 class="dcs-notice-title"><?php esc_html_e('Love CF7 Styler for Divi?', 'cf7-styler-for-divi'); ?></h3>
                    <p class="dcs-notice-description">
                        <?php esc_html_e('If you\'re enjoying our plugin, we\'d be incredibly grateful if you could take a moment to leave us a 5-star review on WordPress.org. Your feedback helps us improve and helps other users discover our plugin.', 'cf7-styler-for-divi'); ?>
                    </p>
                </div>
                <div class="dcs-notice-actions">
                    <a href="https://wordpress.org/support/plugin/cf7-styler-for-divi/reviews/?filter=5#new-post" target="_blank" class="dcs-review-button">
                        <?php esc_html_e('Leave a Review', 'cf7-styler-for-divi'); ?>
                    </a>
                </div>
            </div>
        </div>

        <style>
            .dcs-review-notice {
                color: rgb(12, 13, 14);
                box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
                background-color: rgb(255, 255, 255);
                padding: 24px 32px 24px 32px !important;
                position: relative !important;
                transition: all 0.2s ease-out !important;
                border-radius: 8px !important;
                border: 1px solid #e5e7eb !important;
                margin: 16px 0 !important;
                overflow: hidden !important;
            }

            .dcs-review-notice .notice-dismiss {
                color: #9ca3af !important;
                text-decoration: none !important;
                z-index: 10 !important;
                font-size: 16px !important;
                width: 24px !important;
                height: 24px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                border-radius: 4px !important;
                transition: all 0.15s ease !important;
                position: absolute !important;
                top: 12px !important;
                right: 12px !important;
            }

            .dcs-review-notice .notice-dismiss:hover {
                color: #6b7280 !important;
                background: #f3f4f6 !important;
            }

            .dcs-review-notice .dcs-notice-content {
                display: flex;
                flex-direction: column;
                gap: 16px;
                position: relative;
                z-index: 2;
            }

            .dcs-review-notice .dcs-notice-text {
                flex: 1;
            }

            .dcs-review-notice .dcs-notice-title {
                margin: 0 0 8px 0 !important;
                font-size: 18px !important;
                font-weight: 600 !important;
                color: #111827 !important;
                line-height: 1.3 !important;
                letter-spacing: -0.01em !important;
            }

            .dcs-review-notice .dcs-notice-description {
                margin: 0 !important;
                font-size: 14px !important;
                color: #6b7280 !important;
                line-height: 1.5 !important;
                font-weight: 400 !important;
            }

            .dcs-review-notice .dcs-notice-actions {
                align-self: flex-start;
            }

            .dcs-review-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: #f59e0b !important;
                color: #ffffff !important;
                text-decoration: none !important;
                padding: 10px 20px !important;
                border-radius: 6px !important;
                font-weight: 500 !important;
                font-size: 14px !important;
                transition: all 0.15s ease-out !important;
                border: none !important;
                position: relative !important;
            }

            .dcs-review-button:hover {
                background: #d97706 !important;
                color: #ffffff !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25) !important;
            }

            .dcs-review-button:active {
                transform: translateY(0) !important;
                box-shadow: 0 1px 4px rgba(245, 158, 11, 0.2) !important;
            }

            @media (max-width: 768px) {
                .dcs-review-notice .dcs-notice-actions {
                    width: 100%;
                }

                .dcs-review-button {
                    width: 100%;
                    text-align: center;
                }
            }
        </style>
<?php
    }

    public function dismiss_notice()
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'dcs_dismiss_notice')) {
            wp_die('Security check failed');
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        // Dismiss the notice for this user
        update_user_meta(get_current_user_id(), self::DISMISSED_OPTION, '1');

        wp_send_json_success();
    }
}
