<?php

namespace CF7_Mate;

class Admin_Review_Notice
{
    private static $instance = null;

    const NOTICE_ID = 'dcs_review_notice';
    const DISMISSED_OPTION = 'dcs_review_notice_dismissed';
    const INSTALL_DATE_OPTION = 'divi_cf7_styler_install_date';
    const REVIEW_DELAY = 7 * 24 * 60 * 60; // 7 days in seconds

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
        // Don't load on CF7 Mate admin pages
        if ($this->is_cf7_mate_page()) {
            return;
        }

        // Only load on admin pages
        if (!in_array($hook, ['index.php', 'plugins.php', 'edit.php', 'post.php', 'post-new.php'])) {
            return;
        }

        wp_enqueue_script(
            'dcs-admin-notice',
            CF7M_PLUGIN_URL . 'dist/js/admin-notice.js',
            ['jquery'],
            CF7M_VERSION,
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
        // Don't show on CF7 Mate admin pages
        if ($this->is_cf7_mate_page()) {
            return;
        }

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

    /**
     * Check if current page is a CF7 Mate admin page.
     */
    private function is_cf7_mate_page()
    {
        $page = isset($_GET['page']) ? sanitize_text_field(wp_unslash($_GET['page'])) : '';
        return in_array($page, ['cf7-mate-dashboard', 'cf7-mate-features', 'cf7-mate', 'cf7-mate-pricing'], true);
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
        <div id="<?php echo esc_attr(self::NOTICE_ID); ?>" class="dcs-admin-notice dcs-review-notice notice is-dismissible">
            <div class="dcs-notice-inner">
                <div class="dcs-notice-icon">
                    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="24" r="24" fill="#5733FF" fill-opacity="0.1"/>
                        <path d="M24 16l2.472 7.61h8.004l-6.476 4.708 2.472 7.61L24 31.22l-6.472 4.708 2.472-7.61-6.476-4.708h8.004L24 16z" fill="#5733FF"/>
                    </svg>
                </div>
                <div class="dcs-notice-content">
                    <h3 class="dcs-notice-title">
                        <?php esc_html_e('🎉 You\'re creating amazing forms!', 'cf7-styler-for-divi'); ?>
                    </h3>
                    <p class="dcs-notice-description">
                        <?php 
                        printf(
                            /* translators: %s: plugin name */
                            esc_html__('It looks like you\'ve been using %s for a while now. That\'s awesome! If you\'re enjoying it, would you mind sharing the love with a quick 5-star review? It takes just 30 seconds and helps us grow! 💜', 'cf7-styler-for-divi'),
                            '<strong>' . esc_html__('CF7 Mate', 'cf7-styler-for-divi') . '</strong>'
                        );
                        ?>
                    </p>
                    <div class="dcs-notice-actions">
                        <a href="https://wordpress.org/support/plugin/cf7-styler-for-divi/reviews/?filter=5#new-post" target="_blank" class="dcs-review-button dcs-review-button--primary" data-action="review">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                            </svg>
                            <?php esc_html_e('Sure! I\'ll leave a review', 'cf7-styler-for-divi'); ?>
                        </a>
                        <button type="button" class="dcs-review-button dcs-review-button--secondary" data-action="dismiss">
                            <?php esc_html_e('Maybe later', 'cf7-styler-for-divi'); ?>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .dcs-review-notice {
                position: relative !important;
                padding: 0 !important;
                border: none !important;
                background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%) !important;
                border-radius: 12px !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
                margin: 16px 20px 16px 0 !important;
                overflow: hidden !important;
                border-left: 4px solid #5733FF !important;
            }

            .dcs-review-notice::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 100%;
                background: linear-gradient(135deg, rgba(87, 51, 255, 0.03) 0%, transparent 50%);
                pointer-events: none;
            }

            .dcs-review-notice .notice-dismiss {
                top: 16px !important;
                right: 16px !important;
                width: 28px !important;
                height: 28px !important;
                border-radius: 6px !important;
                color: #9ca3af !important;
                transition: all 0.2s ease !important;
                z-index: 10 !important;
            }

            .dcs-review-notice .notice-dismiss:hover {
                background: rgba(87, 51, 255, 0.1) !important;
                color: #5733FF !important;
            }

            .dcs-review-notice .notice-dismiss::before {
                width: 28px !important;
                height: 28px !important;
                font-size: 18px !important;
            }

            .dcs-notice-inner {
                display: flex;
                gap: 20px;
                padding: 24px 60px 24px 24px;
                position: relative;
                z-index: 2;
            }

            .dcs-notice-icon {
                flex-shrink: 0;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: dcs-notice-pulse 2s ease-in-out infinite;
            }

            @keyframes dcs-notice-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            .dcs-notice-content {
                flex: 1;
                min-width: 0;
            }

            .dcs-notice-title {
                margin: 0 0 8px 0 !important;
                font-size: 18px !important;
                font-weight: 600 !important;
                color: #111827 !important;
                line-height: 1.4 !important;
                letter-spacing: -0.02em !important;
            }

            .dcs-notice-description {
                margin: 0 0 16px 0 !important;
                font-size: 14px !important;
                color: #4b5563 !important;
                line-height: 1.6 !important;
                font-weight: 400 !important;
            }

            .dcs-notice-description strong {
                color: #5733FF;
                font-weight: 600;
            }

            .dcs-notice-actions {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }

            .dcs-review-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 10px 20px !important;
                border-radius: 8px !important;
                font-weight: 500 !important;
                font-size: 14px !important;
                transition: all 0.2s ease !important;
                cursor: pointer !important;
                text-decoration: none !important;
                border: none !important;
                font-family: inherit !important;
                line-height: 1.4 !important;
            }

            .dcs-review-button--primary {
                background: linear-gradient(135deg, #5733FF 0%, #4520e6 100%) !important;
                color: #ffffff !important;
                box-shadow: 0 2px 8px rgba(87, 51, 255, 0.25) !important;
            }

            .dcs-review-button--primary:hover {
                background: linear-gradient(135deg, #4520e6 0%, #3a1bc9 100%) !important;
                color: #ffffff !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(87, 51, 255, 0.35) !important;
            }

            .dcs-review-button--primary:active {
                transform: translateY(0) !important;
                box-shadow: 0 2px 6px rgba(87, 51, 255, 0.3) !important;
            }

            .dcs-review-button--secondary {
                background: transparent !important;
                color: #6b7280 !important;
                border: 1px solid #d1d5db !important;
            }

            .dcs-review-button--secondary:hover {
                background: #f3f4f6 !important;
                color: #374151 !important;
                border-color: #9ca3af !important;
            }

            @media (max-width: 768px) {
                .dcs-notice-inner {
                    flex-direction: column;
                    gap: 16px;
                    padding: 20px 50px 20px 20px;
                }

                .dcs-notice-icon {
                    width: 40px;
                    height: 40px;
                }

                .dcs-notice-icon svg {
                    width: 32px;
                    height: 32px;
                }

                .dcs-notice-actions {
                    flex-direction: column;
                }

                .dcs-review-button {
                    width: 100%;
                    justify-content: center;
                }

                .dcs-review-notice .notice-dismiss {
                    top: 12px !important;
                    right: 12px !important;
                }
            }
        </style>

        <script type="text/javascript">
            jQuery(document).ready(function($) {
                // Handle review button click
                $('.dcs-review-button[data-action="review"]').on('click', function(e) {
                    // Dismiss the notice when user clicks review
                    $.ajax({
                        url: dcs_admin_notice.ajax_url,
                        type: 'POST',
                        data: {
                            action: 'dcs_dismiss_review_notice',
                            nonce: dcs_admin_notice.nonce
                        }
                    });
                });

                // Handle "Maybe later" button
                $('.dcs-review-button[data-action="dismiss"]').on('click', function(e) {
                    e.preventDefault();
                    $('#<?php echo esc_js(self::NOTICE_ID); ?>').fadeOut(300, function() {
                        $(this).remove();
                    });
                    
                    $.ajax({
                        url: dcs_admin_notice.ajax_url,
                        type: 'POST',
                        data: {
                            action: 'dcs_dismiss_review_notice',
                            nonce: dcs_admin_notice.nonce
                        }
                    });
                });
            });
        </script>
<?php
    }

    public function dismiss_notice()
    {
        $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';

        if (!$nonce || !wp_verify_nonce($nonce, 'dcs_dismiss_notice')) {
            wp_send_json_error(['message' => 'Security check failed']);
        }

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Insufficient permissions']);
        }

        update_user_meta(get_current_user_id(), self::DISMISSED_OPTION, '1');

        wp_send_json_success();
    }
}
