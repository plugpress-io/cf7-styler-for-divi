<?php

namespace Divi_CF7_Styler;

class Admin_Notice
{
    private static $instance = null;

    const NOTICE_ID = 'dcs_pro_notice';
    const DISMISSED_OPTION = 'dcs_pro_notice_dismissed';
    const INSTALL_DATE_OPTION = 'divi_cf7_styler_install_date';
    const NOTICE_DELAY = 24 * 60 * 60; // 24 hours in seconds
    // const NOTICE_DELAY = 60; // 1 minute in seconds

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
        add_action('wp_ajax_dcs_dismiss_pro_notice', [$this, 'dismiss_notice']);
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

        return $time_since_install >= self::NOTICE_DELAY;
    }

    private function is_notice_dismissed()
    {
        return get_user_meta(get_current_user_id(), self::DISMISSED_OPTION, true) === '1';
    }

    private function render_notice()
    {
?>
        <div id="<?php echo esc_attr(self::NOTICE_ID); ?>" class="dcs-admin-notice notice notice-info is-dismissible">
            <div class="dcs-notice-content">
                <div class="dcs-notice-text">
                    <h3 class="dcs-notice-title"><?php esc_html_e('Lean Forms Pro', 'cf7-styler-for-divi'); ?></h3>
                    <p class="dcs-notice-description">
                        <?php esc_html_e('Get multi-step forms, Google Sheets integration, and 5+ premium field types. Transform your Contact Form 7 into a powerful lead generation tool.', 'cf7-styler-for-divi'); ?>
                    </p>
                </div>
                <div class="dcs-notice-actions">
                    <a href="https://plugpress.io/lean-forms/#leanforms-pricing" target="_blank" class="dcs-upgrade-button">
                        <?php esc_html_e('Get Lean Forms Pro', 'cf7-styler-for-divi'); ?>
                    </a>
                </div>
            </div>
        </div>

        <style>
            .dcs-admin-notice {
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

            .dcs-admin-notice .notice-dismiss {
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

            .dcs-admin-notice .notice-dismiss:hover {
                color: #6b7280 !important;
                background: #f3f4f6 !important;
            }

            .dcs-notice-content {
                display: flex;
                flex-direction: column;
                gap: 16px;
                position: relative;
                z-index: 2;
            }

            .dcs-notice-text {
                flex: 1;
            }

            .dcs-notice-title {
                margin: 0 0 8px 0 !important;
                font-size: 18px !important;
                font-weight: 600 !important;
                color: #111827 !important;
                line-height: 1.3 !important;
                letter-spacing: -0.01em !important;
            }

            .dcs-notice-description {
                margin: 0 !important;
                font-size: 14px !important;
                color: #6b7280 !important;
                line-height: 1.5 !important;
                font-weight: 400 !important;
            }

            .dcs-notice-actions {
                align-self: flex-start;
            }

            .dcs-upgrade-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: #0285FF !important;
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

            .dcs-upgrade-button:hover {
                background: #0066cc !important;
                color: #ffffff !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 2px 8px rgba(2, 133, 255, 0.25) !important;
            }

            .dcs-upgrade-button:active {
                transform: translateY(0) !important;
                box-shadow: 0 1px 4px rgba(2, 133, 255, 0.2) !important;
            }

            @media (max-width: 768px) {
                .dcs-notice-actions {
                    width: 100%;
                }

                .dcs-upgrade-button {
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
