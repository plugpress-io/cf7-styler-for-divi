<?php
/**
 * Entries Save – capture CF7 submission and save to CPT.
 *
 * @package CF7_Mate\Features\Entries
 * @since 3.0.0
 */

namespace CF7_Mate\Features\Entries;

if (!defined('ABSPATH')) {
    exit;
}

class Entries_Save
{
    public function __construct()
    {
        add_action('wpcf7_before_send_mail', [$this, 'capture_submission'], 5);
    }

    /**
     * Capture submission and save as entry.
     *
     * @param \WPCF7_ContactForm $contact_form
     */
    public function capture_submission($contact_form)
    {
        $submission = \WPCF7_Submission::get_instance();
        if (!$submission) {
            return;
        }

        if (!post_type_exists(Entries_CPT::POST_TYPE)) {
            return;
        }

        $data = $submission->get_posted_data();
        unset(
            $data['_wpcf7'],
            $data['_wpcf7_version'],
            $data['_wpcf7_locale'],
            $data['_wpcf7_unit_tag'],
            $data['_wpcf7_container_post']
        );

        $status = $this->is_spam($submission) ? 'spam' : 'new';

        $title = sprintf(
            /* translators: 1: form title, 2: date */
            __('%1$s — %2$s', 'cf7-styler-for-divi'),
            $contact_form->title(),
            current_time('Y-m-d H:i:s')
        );

        $entry_id = wp_insert_post([
            'post_type'   => Entries_CPT::POST_TYPE,
            'post_status' => 'publish',
            'post_title'  => $title,
        ]);

        if (!$entry_id || is_wp_error($entry_id)) {
            return;
        }

        update_post_meta($entry_id, '_cf7m_form_id', $contact_form->id());
        update_post_meta($entry_id, '_cf7m_form_title', $contact_form->title());
        update_post_meta($entry_id, '_cf7m_status', $status);
        update_post_meta($entry_id, '_cf7m_data', wp_json_encode($data));
        update_post_meta($entry_id, '_cf7m_created', current_time('mysql'));
        update_post_meta($entry_id, '_cf7m_ip', $this->get_client_ip());
        update_post_meta($entry_id, '_cf7m_ua', $this->get_user_agent());
    }

    private function is_spam($submission)
    {
        if (method_exists($submission, 'get_status') && $submission->get_status() === 'spam') {
            return true;
        }
        if (method_exists($submission, 'is_spam') && $submission->is_spam()) {
            return true;
        }
        return false;
    }

    private function get_client_ip()
    {
        $keys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
        foreach ($keys as $key) {
            if (!empty($_SERVER[$key])) {
                $ip = is_array($_SERVER[$key]) ? reset($_SERVER[$key]) : $_SERVER[$key];
                $ip = trim(explode(',', $ip)[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP)) {
                    return sanitize_text_field(wp_unslash($ip));
                }
            }
        }
        return '';
    }

    private function get_user_agent()
    {
        return isset($_SERVER['HTTP_USER_AGENT'])
            ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT']))
            : '';
    }
}
