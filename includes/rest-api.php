<?php

namespace Divi_CF7_Styler\API;

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
            'is_pro' => defined('DCS_PRO_VERSION') || defined('CF7M_PRO_VERSION'),
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
