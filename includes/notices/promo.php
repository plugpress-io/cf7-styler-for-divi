<?php

namespace CF7_Mate;

if (!defined('ABSPATH')) {
    exit;
}

class Admin_Promo_Notice
{
    private static $instance = null;

    const NOTICE_ID        = 'cf7m_promo_notice_new2026';
    const DISMISSED_OPTION = 'cf7m_promo_notice_new2026_dismissed';
    const PROMO_CODE       = 'NEW2026';
    const EXPIRY_DATE      = '2026-03-31'; // Campaign ends

    public static function instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        add_action('admin_notices', [$this, 'display_notice']);
        add_action('wp_ajax_cf7m_dismiss_promo_notice', [$this, 'dismiss_notice']);
    }

    public function display_notice()
    {
        // Only admins.
        if (!current_user_can('manage_options')) {
            return;
        }

        // Hide for Pro users – they already have a license.
        if (function_exists('cf7m_can_use_premium') && cf7m_can_use_premium()) {
            return;
        }

        // Campaign expired.
        if (time() > strtotime(self::EXPIRY_DATE)) {
            return;
        }

        // Already dismissed by this user.
        if (get_user_meta(get_current_user_id(), self::DISMISSED_OPTION, true) === '1') {
            return;
        }

        // Only show to new installs (v3.0.0+, installed on or after 2026-01-01).
        $install_date = (int) get_option('cf7m_install_date', 0);
        if (!$install_date || $install_date < strtotime('2026-01-01')) {
            return;
        }

        // Show only after 4 days from install date.
        if ((time() - $install_date) < 4 * DAY_IN_SECONDS) {
            return;
        }

        // Don't show on CF7 Mate's own pages (promo info is already shown there).
        $page = isset($_GET['page']) ? sanitize_text_field(wp_unslash($_GET['page'])) : '';
        $cf7m_pages = ['cf7-mate', 'cf7-mate-dashboard', 'cf7-mate-features', 'cf7-mate-pricing', 'cf7-mate-free-vs-pro'];
        if (in_array($page, $cf7m_pages, true)) {
            return;
        }

        $pricing_url = esc_url(cf7m_get_pricing_url(self::PROMO_CODE));
        $dismiss_nonce = wp_create_nonce('cf7m_dismiss_promo_notice');
        $notice_id = esc_attr(self::NOTICE_ID);
        $promo_code = esc_html(self::PROMO_CODE);
?>
        <div id="<?php echo $notice_id; ?>" class="cf7m-promo-notice notice notice-info is-dismissible" style="display:flex;">
            <div class="cf7m-promo-notice-inner">
                <div class="cf7m-promo-badge">🎉 50% OFF</div>
                <div class="cf7m-promo-content">
                    <strong><?php esc_html_e('Limited-Time Lifetime Deal – CF7 Mate Pro', 'cf7-styler-for-divi'); ?></strong>
                    <span class="cf7m-promo-sep">·</span>
                    <?php
                    printf(
                        /* translators: %s: promo code */
                        esc_html__('Use code %s at checkout and save 50%% on a lifetime license. One-time payment, updates forever.', 'cf7-styler-for-divi'),
                        '<strong class="cf7m-promo-code">' . $promo_code . '</strong>'
                    );
                    ?>
                    <span class="cf7m-promo-sep">·</span>
                    <a href="<?php echo $pricing_url; ?>" class="cf7m-promo-cta">
                        <?php esc_html_e('Claim Discount →', 'cf7-styler-for-divi'); ?>
                    </a>
                </div>
            </div>
        </div>

        <style>
            #<?php echo $notice_id; ?> {
                align-items: center;
                border-left-color: #3044D7;
                padding: 10px 40px 10px 16px;
                gap: 0;
            }

            .cf7m-promo-notice-inner {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 10px;
                font-size: 13px;
                line-height: 1.5;
            }

            .cf7m-promo-badge {
                display: inline-flex;
                align-items: center;
                background: #3044D7;
                color: #fff;
                font-weight: 700;
                font-size: 12px;
                padding: 3px 10px;
                border-radius: 20px;
                white-space: nowrap;
                letter-spacing: 0.03em;
            }

            .cf7m-promo-content {
                color: #374151;
            }

            .cf7m-promo-sep {
                color: #9ca3af;
                margin: 0 4px;
            }

            .cf7m-promo-code {
                background: #f3f4f6;
                border: 1px dashed #3044D7;
                color: #3044D7;
                padding: 1px 7px;
                border-radius: 4px;
                font-family: monospace;
                font-size: 13px;
                letter-spacing: 0.04em;
            }

            .cf7m-promo-cta {
                color: #3044D7;
                font-weight: 600;
                text-decoration: none;
                white-space: nowrap;
            }

            .cf7m-promo-cta:hover {
                text-decoration: underline;
            }
        </style>

        <script type="text/javascript">
            jQuery(document).ready(function($) {
                // When WP's native "×" dismiss button is clicked, save to DB.
                $('#<?php echo esc_js(self::NOTICE_ID); ?>').on('click', '.notice-dismiss', function() {
                    $.post(ajaxurl, {
                        action: 'cf7m_dismiss_promo_notice',
                        nonce: '<?php echo esc_js($dismiss_nonce); ?>'
                    });
                });
            });
        </script>
<?php
    }

    public function dismiss_notice()
    {
        $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';

        if (!$nonce || !wp_verify_nonce($nonce, 'cf7m_dismiss_promo_notice')) {
            wp_send_json_error(['message' => 'Security check failed']);
        }

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Insufficient permissions']);
        }

        update_user_meta(get_current_user_id(), self::DISMISSED_OPTION, '1');

        wp_send_json_success();
    }
}
