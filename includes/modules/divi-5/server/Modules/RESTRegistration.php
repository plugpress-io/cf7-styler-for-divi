<?php

namespace DiviCF7Styler\Modules;

use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;

class RESTRegistration {
    public function register_routes() {
        register_rest_route(
            'divi-cf7-styler/v1',
            '/get-forms',
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_cf7_forms'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        
        register_rest_route(
            'divi-cf7-styler/v1',
            '/get-form-content',
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_form_content'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
    }
    
    public function get_cf7_forms() {
        $options = array();
        
        if (function_exists('wpcf7')) {
            $args = array(
                'post_type'      => 'wpcf7_contact_form',
                'posts_per_page' => -1,
            );
            
            $contact_forms = get_posts($args);
            
            if (!empty($contact_forms) && !is_wp_error($contact_forms)) {
                $options[] = array(
                    'value' => 0,
                    'label' => esc_html__('Select a Contact form', 'cf7-styler-for-divi')
                );
                
                foreach ($contact_forms as $post) {
                    $options[] = array(
                        'value' => $post->ID,
                        'label' => $post->post_title
                    );
                }
            }
        }
        
        return rest_ensure_response($options);
    }
    
    public function get_form_content(WP_REST_Request $request) {
        $form_id = $request->get_param('form_id');
        
        if (empty($form_id) || $form_id == 0) {
            return rest_ensure_response(array(
                'content' => 'Please select a Contact Form 7.'
            ));
        }
        
        $shortcode = sprintf('[contact-form-7 id="%1$s"]', $form_id);
        $content = do_shortcode($shortcode);
        
        return rest_ensure_response(array(
            'content' => $content
        ));
    }
}
