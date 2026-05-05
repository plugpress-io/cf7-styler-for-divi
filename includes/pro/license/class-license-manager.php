<?php

namespace CF7_Mate\License;

if (!defined('ABSPATH')) {
    exit;
}

class License_Manager {
    use \CF7_Mate\Pro\Traits\Singleton;

    const LS_API_BASE       = 'https://api.lemonsqueezy.com/v1/licenses';
    const OPT_LICENSE_KEY   = 'cf7m_license_key';
    const OPT_INSTANCE_ID   = 'cf7m_license_instance_id';
    const OPT_STATUS        = 'cf7m_license_status';
    const OPT_EXPIRES_AT    = 'cf7m_license_expires_at';
    const TRANSIENT_VALID   = 'cf7m_license_valid';
    const CRON_HOOK         = 'cf7m_daily_license_check';
    const REQUEST_TIMEOUT   = 15;

    private function __construct() {
        add_action(self::CRON_HOOK, [$this, 'validate']);
    }

    /**
     * Activate a license key.
     *
     * @param string $license_key The license key to activate.
     * @return array||\WP_Error Array with activation data or error.
     */
    public function activate(string $license_key) {
        $license_key = sanitize_text_field($license_key);

        if (empty(trim($license_key))) {
            return new \WP_Error('invalid_key', __('License key cannot be empty.', 'cf7-styler-for-divi'));
        }

        $instance_name = home_url();

        $response = wp_remote_post(
            self::LS_API_BASE . '/activate',
            [
                'timeout'     => self::REQUEST_TIMEOUT,
                'httpversion' => '1.1',
                'headers'     => [
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/x-www-form-urlencoded',
                ],
                'body' => http_build_query([
                    'license_key'   => $license_key,
                    'instance_name' => $instance_name,
                ]),
            ]
        );

        if (is_wp_error($response)) {
            return new \WP_Error(
                'connection_failed',
                sprintf(
                    __('Connection to Lemon Squeezy failed: %s', 'cf7-styler-for-divi'),
                    $response->get_error_message()
                )
            );
        }

        $code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if ($code >= 400) {
            $message = isset($data['error']) ? $data['error'] : __('Activation failed. Check your license key.', 'cf7-styler-for-divi');
            return new \WP_Error('activation_failed', $message, ['status' => $code]);
        }

        if (empty($data['activated']) || !$data['activated']) {
            return new \WP_Error('activation_failed', __('License activation was not successful.', 'cf7-styler-for-divi'));
        }

        // Store encrypted key
        update_option(self::OPT_LICENSE_KEY, $this->encrypt($license_key), false);

        // Store instance ID
        $instance_id = isset($data['instance']['id']) ? sanitize_text_field($data['instance']['id']) : '';
        update_option(self::OPT_INSTANCE_ID, $instance_id, false);

        // Store status and expiry from license data
        $license_data = isset($data['license_key']) ? $data['license_key'] : [];
        $status       = isset($license_data['status']) ? sanitize_text_field($license_data['status']) : 'active';
        $expires_at   = isset($license_data['expires_at']) ? sanitize_text_field($license_data['expires_at']) : '';

        update_option(self::OPT_STATUS, $status, false);
        update_option(self::OPT_EXPIRES_AT, $expires_at, false);

        // Set transient
        set_transient(self::TRANSIENT_VALID, true, \DAY_IN_SECONDS);

        // Schedule cron if not already scheduled
        if (!wp_next_scheduled(self::CRON_HOOK)) {
            wp_schedule_event(time() + \DAY_IN_SECONDS, 'daily', self::CRON_HOOK);
        }

        return [
            'activated'  => true,
            'status'     => $status,
            'expires_at' => $expires_at,
            'masked_key' => $this->get_masked_key(),
        ];
    }

    /**
     * Deactivate the current license.
     *
     * @return array||\WP_Error Success array or error.
     */
    public function deactivate() {
        $encrypted_key = get_option(self::OPT_LICENSE_KEY, '');
        $instance_id   = get_option(self::OPT_INSTANCE_ID, '');

        if (empty($encrypted_key) || empty($instance_id)) {
            return new \WP_Error('not_activated', __('No active license to deactivate.', 'cf7-styler-for-divi'));
        }

        $license_key = $this->decrypt($encrypted_key);

        if (!$license_key) {
            return new \WP_Error('decrypt_failed', __('Could not decrypt license key.', 'cf7-styler-for-divi'));
        }

        // Try to deactivate on LS side, but don't fail if it fails
        wp_remote_post(
            self::LS_API_BASE . '/deactivate',
            [
                'timeout'     => self::REQUEST_TIMEOUT,
                'httpversion' => '1.1',
                'headers'     => [
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/x-www-form-urlencoded',
                ],
                'body' => http_build_query([
                    'license_key' => $license_key,
                    'instance_id' => $instance_id,
                ]),
            ]
        );

        // Clear local data regardless of LS response
        delete_option(self::OPT_LICENSE_KEY);
        delete_option(self::OPT_INSTANCE_ID);
        delete_option(self::OPT_STATUS);
        delete_option(self::OPT_EXPIRES_AT);
        delete_transient(self::TRANSIENT_VALID);

        // Unschedule cron
        wp_clear_scheduled_hook(self::CRON_HOOK);

        return ['deactivated' => true];
    }

    /**
     * Validate the current license with Lemon Squeezy.
     *
     * This is the cron callback and can also be called directly.
     *
     * @return bool True if valid, false otherwise.
     */
    public function validate(): bool {
        $encrypted_key = get_option(self::OPT_LICENSE_KEY, '');
        $instance_id   = get_option(self::OPT_INSTANCE_ID, '');

        if (empty($encrypted_key) || empty($instance_id)) {
            set_transient(self::TRANSIENT_VALID, false, \DAY_IN_SECONDS);
            return false;
        }

        $license_key = $this->decrypt($encrypted_key);

        if (!$license_key) {
            set_transient(self::TRANSIENT_VALID, false, \DAY_IN_SECONDS);
            return false;
        }

        $response = wp_remote_post(
            self::LS_API_BASE . '/validate',
            [
                'timeout'     => self::REQUEST_TIMEOUT,
                'httpversion' => '1.1',
                'headers'     => [
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/x-www-form-urlencoded',
                ],
                'body' => http_build_query([
                    'license_key' => $license_key,
                    'instance_id' => $instance_id,
                ]),
            ]
        );

        if (is_wp_error($response)) {
            // Network error - don't touch the transient, let it expire naturally
            // This prevents false deactivations due to temporary network issues
            return $this->is_valid();
        }

        $code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if ($code >= 400) {
            // LS error - mark as invalid
            set_transient(self::TRANSIENT_VALID, false, \DAY_IN_SECONDS);
            update_option(self::OPT_STATUS, 'invalid', false);
            return false;
        }

        $is_valid = isset($data['valid']) && $data['valid'];
        $license  = isset($data['license_key']) ? $data['license_key'] : [];
        $status   = isset($license['status']) ? sanitize_text_field($license['status']) : '';

        if ($is_valid && $status === 'active') {
            $expires_at = isset($license['expires_at']) ? sanitize_text_field($license['expires_at']) : '';
            update_option(self::OPT_STATUS, 'active', false);
            update_option(self::OPT_EXPIRES_AT, $expires_at, false);
            set_transient(self::TRANSIENT_VALID, true, \DAY_IN_SECONDS);
            return true;
        }

        // Invalid or not active
        update_option(self::OPT_STATUS, $status ?: 'inactive', false);
        set_transient(self::TRANSIENT_VALID, false, \DAY_IN_SECONDS);
        return false;
    }

    /**
     * Check if license is valid. This is fast - no HTTP calls.
     *
     * Called from cf7m_is_pro() on every request, must be efficient.
     *
     * @return bool True if license is valid, false otherwise.
     */
    public function is_valid(): bool {
        $cached = get_transient(self::TRANSIENT_VALID);
        if ($cached !== false) {
            return (bool) $cached;
        }

        // Transient expired - check locally
        $status = get_option(self::OPT_STATUS, '');
        if ($status !== 'active') {
            return false;
        }

        // Check expiry
        $expires = get_option(self::OPT_EXPIRES_AT, '');
        if ($expires && strtotime($expires) < time()) {
            update_option(self::OPT_STATUS, 'expired', false);
            return false;
        }

        // Restore transient - will be revalidated by cron
        set_transient(self::TRANSIENT_VALID, true, \DAY_IN_SECONDS);
        return true;
    }

    /**
     * Get current license status (display-safe data).
     *
     * @return array License status data.
     */
    public function get_status(): array {
        return [
            'status'     => get_option(self::OPT_STATUS, ''),
            'expires_at' => get_option(self::OPT_EXPIRES_AT, ''),
            'masked_key' => $this->get_masked_key(),
            'is_valid'   => $this->is_valid(),
            'has_key'    => !empty(get_option(self::OPT_LICENSE_KEY, '')),
        ];
    }

    /**
     * Get masked license key for display.
     *
     * @return string Masked key like "XXXX-XXXX-XXXX-XXXX-Ab12" or empty.
     */
    public function get_masked_key(): string {
        $encrypted = get_option(self::OPT_LICENSE_KEY, '');
        if (empty($encrypted)) {
            return '';
        }

        $key = $this->decrypt($encrypted);
        if (!$key) {
            return '';
        }

        $parts = explode('-', $key);
        if (empty($parts)) {
            return '';
        }

        $last = array_pop($parts);
        $mask = array_fill(0, count($parts), 'XXXX');

        return implode('-', $mask) . '-' . substr($last, -4);
    }

    /**
     * Encrypt a string using AES-256-CBC.
     *
     * @param string $value Value to encrypt.
     * @return string Encrypted and base64-encoded value, or original if OpenSSL unavailable.
     */
    private function encrypt(string $value): string {
        if (!function_exists('openssl_encrypt')) {
            // Fallback: store as-is (still in DB only, not exposed to frontend)
            return $value;
        }

        $key = wp_hash_password(wp_salt('secure_auth_key'));
        $key = hash('sha256', $key, true);

        $iv       = openssl_random_pseudo_bytes(16);
        $cipher   = openssl_encrypt($value, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
        $encrypted = base64_encode($iv . $cipher);

        return $encrypted;
    }

    /**
     * Decrypt a string encrypted with encrypt().
     *
     * @param string $value Encrypted value.
     * @return string|false Decrypted value or false on failure.
     */
    private function decrypt(string $value) {
        if (!function_exists('openssl_decrypt')) {
            // Fallback: return as-is if OpenSSL not available
            return $value;
        }

        $key = wp_hash_password(wp_salt('secure_auth_key'));
        $key = hash('sha256', $key, true);

        $data = base64_decode($value, true);
        if (!$data || strlen($data) < 16) {
            return false;
        }

        $iv     = substr($data, 0, 16);
        $cipher = substr($data, 16);

        return openssl_decrypt($cipher, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
    }

    /**
     * Hook the localize filter to inject license data into the admin app.
     */
    public function filter_localize(array $localize, array $options): array {
        $status = $this->get_status();
        $localize['license'] = [
            'status'     => $status['status'],
            'expires_at' => $status['expires_at'],
            'masked_key' => $status['masked_key'],
            'is_valid'   => $status['is_valid'],
            'has_key'    => $status['has_key'],
        ];

        return $localize;
    }
}
