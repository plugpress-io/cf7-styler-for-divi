<?php

namespace CF7_Mate\API;

if (!defined('ABSPATH')) {
    exit;
}

class Rest_API
{
    private static $instance = null;

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
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    /**
     * Register REST API routes.
     *
     * @since 3.0.0
     */
    public function register_routes()
    {
        register_rest_route(
            'cf7-styler/v1',
            '/forms',
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_cf7_forms'],
                'permission_callback' => [$this, 'check_permissions'],
            ]
        );

        register_rest_route(
            'cf7-styler/v1',
            '/onboarding/status',
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_onboarding_status'],
                'permission_callback' => [$this, 'check_permissions'],
            ]
        );

        register_rest_route(
            'cf7-styler/v1',
            '/onboarding/complete',
            [
                'methods' => 'POST',
                'callback' => [$this, 'complete_onboarding'],
                'permission_callback' => [$this, 'check_permissions'],
            ]
        );

        // Features settings
        register_rest_route(
            'cf7-styler/v1',
            '/settings/features',
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_features'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ]
        );

        register_rest_route(
            'cf7-styler/v1',
            '/settings/features',
            [
                'methods' => 'POST',
                'callback' => [$this, 'save_features'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ]
        );

        register_rest_route(
            'cf7-styler/v1',
            '/dashboard-stats',
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_dashboard_stats'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ]
        );

        register_rest_route(
            'cf7-styler/v1',
            '/form-preview',
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_form_preview'],
                'permission_callback' => [$this, 'check_permissions'],
                'args' => [
                    'id' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'absint',
                    ],
                ],
            ]
        );
    }

    /**
     * Check if user has permission to access the API.
     *
     * @since 3.0.0
     * @return bool
     */
    public function check_permissions()
    {
        return current_user_can('edit_posts');
    }

    /**
     * Check if user has admin permission.
     *
     * @since 3.0.0
     * @return bool
     */
    public function check_admin_permissions()
    {
        return current_user_can('manage_options');
    }

    /**
     * Get features settings.
     *
     * @since 3.0.0
     * @return \WP_REST_Response
     */
    public function get_features()
    {
        $defaults = self::get_default_features();
        $saved = get_option('cf7m_features', []);
        $features = wp_parse_args($saved, $defaults);

        return rest_ensure_response([
            'features' => $features,
            'is_pro'   => function_exists('cf7m_can_use_premium') && cf7m_can_use_premium(),
        ]);
    }

    /**
     * Save features settings.
     *
     * @since 3.0.0
     * @param \WP_REST_Request $request Request object.
     * @return \WP_REST_Response
     */
    public function save_features($request)
    {
        $features = $request->get_param('features');

        if (!is_array($features)) {
            return new \WP_Error(
                'invalid_data',
                __('Invalid features data.', 'cf7-styler-for-divi'),
                ['status' => 400]
            );
        }

        $defaults = self::get_default_features();
        $sanitized = [];

        foreach ($defaults as $key => $default) {
            $sanitized[$key] = isset($features[$key]) ? (bool) $features[$key] : $default;
        }

        update_option('cf7m_features', $sanitized);

        return rest_ensure_response([
            'success' => true,
            'features' => $sanitized,
        ]);
    }

    /**
     * Get dashboard stats (entries, forms, features count).
     *
     * @since 3.0.0
     * @return \WP_REST_Response
     */
    public function get_dashboard_stats()
    {
        $total_entries = 0;
        $new_today = 0;

        if (post_type_exists('cf7m_entry')) {
            $total_query = new \WP_Query([
                'post_type'      => 'cf7m_entry',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'fields'         => 'ids',
            ]);
            $total_entries = (int) $total_query->found_posts;
            wp_reset_postdata();

            $today_start = gmdate('Y-m-d 00:00:00', strtotime('today'));
            $today_end   = gmdate('Y-m-d 23:59:59', strtotime('today'));
            $new_query   = new \WP_Query([
                'post_type'      => 'cf7m_entry',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'date_query'     => [
                    [
                        'after'  => $today_start,
                        'before' => $today_end,
                        'inclusive' => true,
                    ],
                ],
                'fields' => 'ids',
            ]);
            $new_today = (int) $new_query->found_posts;
            wp_reset_postdata();
        }

        $total_forms = 0;
        if (post_type_exists('wpcf7_contact_form')) {
            $forms_query = new \WP_Query([
                'post_type'      => 'wpcf7_contact_form',
                'post_status'    => 'publish',
                'posts_per_page' => -1,
                'fields'         => 'ids',
            ]);
            $total_forms = (int) $forms_query->found_posts;
            wp_reset_postdata();
        }

        $defaults = self::get_default_features();
        $saved    = get_option('cf7m_features', []);
        $features = wp_parse_args($saved, $defaults);
        $enabled_features = 0;
        foreach ($features as $enabled) {
            if ($enabled) {
                $enabled_features++;
            }
        }

        return rest_ensure_response([
            'total_entries'     => $total_entries,
            'new_today'         => $new_today,
            'total_forms'       => $total_forms,
            'enabled_features'  => $enabled_features,
        ]);
    }

    /**
     * Get rendered form HTML for Visual Builder preview (includes [cf7m-row], [cf7m-step], etc.).
     *
     * @since 3.0.0
     * @param \WP_REST_Request $request Request object with 'id' (form ID).
     * @return \WP_REST_Response|\WP_Error
     */
    public function get_form_preview($request)
    {
        $form_id = $request->get_param('id');
        if (!$form_id) {
            return new \WP_Error(
                'missing_id',
                __('Form ID is required.', 'cf7-styler-for-divi'),
                ['status' => 400]
            );
        }

        $form_id = absint($form_id);
        if (!$form_id) {
            return new \WP_Error(
                'invalid_id',
                __('Invalid form ID.', 'cf7-styler-for-divi'),
                ['status' => 400]
            );
        }

        $html = do_shortcode(sprintf('[contact-form-7 id="%d"]', $form_id));

        return rest_ensure_response([
            'html' => $html,
        ]);
    }

    /**
     * Get default features.
     *
     * @since 3.0.0
     * @return array
     */
    public static function get_default_features()
    {
        return [
            'cf7_module' => true,
            'grid_layout' => true,
            'multi_column' => true,
            'multi_step' => true,
            'star_rating' => true,
            'database_entries' => true,
            'range_slider' => true,
            'separator' => true,
            'heading' => true,
            'image' => true,
            'icon' => true,
        ];
    }

    /**
     * Check if a feature is enabled.
     *
     * @since 3.0.0
     * @param string $feature Feature key.
     * @return bool
     */
    public static function is_feature_enabled($feature)
    {
        $defaults = self::get_default_features();
        $saved = get_option('cf7m_features', []);
        $features = wp_parse_args($saved, $defaults);

        return isset($features[$feature]) ? (bool) $features[$feature] : false;
    }

    /**
     * Get list of Contact Form 7 forms.
     *
     * @since 3.0.0
     * @param \WP_REST_Request $request Request object.
     * @return \WP_REST_Response|\WP_Error
     */
    public function get_cf7_forms($request)
    {
        if (!function_exists('wpcf7_contact_form')) {
            return new \WP_Error(
                'cf7_not_installed',
                __('Contact Form 7 is not installed.', 'cf7-styler-for-divi'),
                ['status' => 404]
            );
        }

        $forms = get_posts([
            'post_type' => 'wpcf7_contact_form',
            'posts_per_page' => -1,
            'post_status' => 'publish',
            'orderby' => 'title',
            'order' => 'ASC',
        ]);

        $form_list = [
            [
                'value' => '0',
                'label' => __('Select a form', 'cf7-styler-for-divi'),
            ],
        ];

        foreach ($forms as $form) {
            $form_list[] = [
                'value' => (string) $form->ID,
                'label' => $form->post_title ? $form->post_title : sprintf(__('Form #%d', 'cf7-styler-for-divi'), $form->ID),
            ];
        }

        return rest_ensure_response($form_list);
    }

    /**
     * Get onboarding status.
     *
     * @since 3.0.0
     * @param \WP_REST_Request $request Request object.
     * @return \WP_REST_Response|\WP_Error
     */
    public function get_onboarding_status($request)
    {
        $is_completed = get_option('cf7m_onboarding_completed', false) === '1';
        $is_skipped = get_option('cf7m_onboarding_skipped', false) === '1';
        $should_show = !$is_completed && $is_skipped;

        return rest_ensure_response([
            'is_completed' => $is_completed,
            'is_skipped' => $is_skipped,
            'should_show_notice' => $should_show,
        ]);
    }

    /**
     * Complete onboarding.
     *
     * @since 3.0.0
     * @param \WP_REST_Request $request Request object.
     * @return \WP_REST_Response|\WP_Error
     */
    public function complete_onboarding($request)
    {
        // Reset onboarding to show it again
        delete_option('cf7m_onboarding_skipped');
        delete_option('cf7m_onboarding_completed');
        update_option('cf7m_onboarding_step', 1);

        return rest_ensure_response([
            'success' => true,
            'message' => __('Onboarding reset successfully.', 'cf7-styler-for-divi'),
        ]);
    }
}

Rest_API::instance();
