<?php

namespace CF7_Mate\Features\AI_Form_Generator;

if (! defined('ABSPATH')) {
	exit;
}

class AI_Settings
{

	const OPTION_KEY = 'cf7m_ai_settings';

	const MENU_SLUG = 'cf7-mate-ai-provider';

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
		add_action('admin_menu', array($this, 'add_menu_page'), 99);
		add_action('admin_enqueue_scripts', array($this, 'enqueue_assets'));
		add_action('rest_api_init', array($this, 'register_routes'));
		add_filter('cf7m_admin_app_localize', array($this, 'filter_admin_localize'), 10, 2);
	}

	public function add_menu_page()
	{
		// Register under CF7 Mate dashboard (like features page).
		add_submenu_page(
			'cf7-mate-dashboard',
			__('AI Provider', 'cf7-styler-for-divi'),
			__('AI Provider', 'cf7-styler-for-divi'),
			'manage_options',
			self::MENU_SLUG,
			array($this, 'render_page')
		);
	}

	public function render_page()
	{
		if (! current_user_can('manage_options')) {
			wp_die(esc_html__('Unauthorized access.', 'cf7-styler-for-divi'));
		}
		// Use main admin app root so AI Settings is a view inside the same React app.
		\CF7_Mate\Admin::get_instance()->render_app_root(array('current_page' => 'ai-settings'));
	}

	/**
	 * Inject AI provider config when main admin app is rendered for AI Settings page.
	 *
	 * @param array $localize Existing localize data.
	 * @param array $options  Options passed to render_app_root (e.g. current_page).
	 * @return array
	 */
	public function filter_admin_localize($localize, $options)
	{
		if (isset($options['current_page']) && $options['current_page'] === 'ai-settings') {
			$localize['aiProviders'] = self::get_providers();
		}
		return $localize;
	}

	public function enqueue_assets($hook)
	{
		if (false === strpos($hook, self::MENU_SLUG)) {
			return;
		}

		if (! current_user_can('manage_options')) {
			return;
		}

		// Main app script is enqueued by render_app_root in the page callback.
		// Enqueue main admin CSS here so it's in the head; then AI-specific CSS.
		wp_enqueue_style(
			'dcs-admin',
			CF7M_PLUGIN_URL . 'dist/css/admin.css',
			array(),
			CF7M_VERSION
		);
		wp_enqueue_style(
			'cf7m-ai-settings',
			CF7M_PLUGIN_URL . 'assets/pro/css/cf7m-ai-settings.css',
			array('dcs-admin'),
			CF7M_VERSION
		);
	}

	/**
	 * Register REST routes.
	 *
	 * @since  3.0.0
	 * @return void
	 */
	public function register_routes()
	{
		register_rest_route(
			'cf7-styler/v1',
			'/ai-settings',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array($this, 'get_settings'),
					'permission_callback' => array($this, 'check_permission'),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array($this, 'save_settings'),
					'permission_callback' => array($this, 'check_permission'),
				),
			)
		);

		register_rest_route(
			'cf7-styler/v1',
			'/ai-settings/test',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array($this, 'test_connection'),
				'permission_callback' => array($this, 'check_permission'),
			)
		);
	}

	/**
	 * Check user permission.
	 *
	 * @since  3.0.0
	 * @return bool
	 */
	public function check_permission()
	{
		return current_user_can('manage_options');
	}

	/**
	 * Get settings via REST.
	 *
	 * @since  3.0.0
	 * @return \WP_REST_Response
	 */
	public function get_settings()
	{
		$settings = self::get_all_settings();

		// Mask API keys for security - never expose full keys.
		$key_fields = array('openai_key', 'anthropic_key', 'kimi_key', 'grok_key');
		foreach ($key_fields as $key) {
			if (! empty($settings[$key])) {
				$settings[$key . '_masked'] = $this->mask_key($settings[$key]);
				$settings[$key . '_set']    = true;
			} else {
				$settings[$key . '_set'] = false;
			}
			unset($settings[$key]);
		}

		return rest_ensure_response($settings);
	}

	/**
	 * Save settings via REST.
	 *
	 * @since  3.0.0
	 * @param  \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function save_settings(\WP_REST_Request $request)
	{
		$current = self::get_all_settings();
		$params  = $request->get_json_params();

		// Validate provider.
		$valid_providers = array_keys(self::get_providers());
		$provider        = sanitize_key($params['provider'] ?? $current['provider']);
		if (! in_array($provider, $valid_providers, true)) {
			$provider = 'openai';
		}

		$settings = array(
			'provider'        => $provider,
			'openai_model'    => sanitize_text_field($params['openai_model'] ?? $current['openai_model']),
			'anthropic_model' => sanitize_text_field($params['anthropic_model'] ?? $current['anthropic_model']),
			'kimi_model'      => sanitize_text_field($params['kimi_model'] ?? $current['kimi_model']),
			'grok_model'      => sanitize_text_field($params['grok_model'] ?? $current['grok_model']),
		);

		// Process API keys - only update if new value provided (not masked).
		$key_fields = array('openai_key', 'anthropic_key', 'kimi_key', 'grok_key');
		foreach ($key_fields as $key) {
			$new_value = $params[$key] ?? '';
			if (! empty($new_value) && false === strpos($new_value, '••')) {
				$settings[$key] = $this->encrypt_key(sanitize_text_field($new_value));
			} else {
				$settings[$key] = $current[$key];
			}
		}

		update_option(self::OPTION_KEY, $settings, false);

		return rest_ensure_response(array('success' => true));
	}

	/**
	 * Test API connection.
	 *
	 * @since  3.0.0
	 * @param  \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function test_connection(\WP_REST_Request $request)
	{
		$provider = sanitize_key($request->get_param('provider'));
		$settings = self::get_all_settings();

		$handler = new AI_API_Handler($settings);
		$result  = $handler->test_connection($provider);

		return rest_ensure_response($result);
	}

	public static function get_all_settings()
	{
		$defaults = array(
			'provider'        => 'openai',
			'openai_key'      => '',
			'openai_model'    => 'gpt-4o-mini',           // Fast, accurate, cost-effective.
			'anthropic_key'   => '',
			'anthropic_model' => 'claude-sonnet-4-20250514', // Best structured output.
			'kimi_key'        => '',
			'kimi_model'      => 'moonshot-v1-32k',       // Good balance for Kimi.
			'grok_key'        => '',
			'grok_model'      => 'grok-3-mini',           // Fast and capable.
		);

		$saved = get_option(self::OPTION_KEY, array());

		// Decrypt stored keys.
		$settings = wp_parse_args($saved, $defaults);
		$instance = self::instance();

		foreach (array('openai_key', 'anthropic_key', 'kimi_key', 'grok_key') as $key) {
			if (! empty($settings[$key])) {
				$settings[$key] = $instance->decrypt_key($settings[$key]);
			}
		}

		return $settings;
	}

	/**
	 * Get available AI providers and models.
	 *
	 * Model Selection Rationale for Form Generation:
	 * ------------------------------------------------
	 * Form generation requires: precise instruction-following, valid shortcode syntax,
	 * fast response times, and cost-effectiveness. We avoid reasoning models (o1, o3)
	 * as they're slow and overkill for structured output tasks.
	 *
	 * @since  3.0.0
	 * @return array
	 */
	public static function get_providers()
	{
		return array(
			'openai'    => array(
				'name'            => 'OpenAI',
				'models'          => array(
					// Best: Fast, excellent instruction-following, cost-effective.
					'gpt-4o-mini'   => 'GPT-4o Mini (Recommended)',
					// Premium: Higher quality for complex multi-step forms.
					'gpt-4o'        => 'GPT-4o',
					// Budget: Fastest and cheapest, good for simple forms.
					'gpt-4o-mini-2024-07-18' => 'GPT-4o Mini (Stable)',
				),
				'key_placeholder' => 'sk-...',
				'key_url'         => 'https://platform.openai.com/api-keys',
			),
			'anthropic' => array(
				'name'            => 'Claude',
				'models'          => array(
					// Best: Excellent at structured output, follows templates precisely.
					'claude-sonnet-4-20250514'   => 'Claude Sonnet 4 (Recommended)',
					// Premium: Highest quality, best for complex calculator forms.
					'claude-opus-4-20250514'     => 'Claude Opus 4',
					// Budget: Fast and accurate for standard forms.
					'claude-3-5-haiku-20241022'  => 'Claude 3.5 Haiku (Fast)',
				),
				'key_placeholder' => 'sk-ant-...',
				'key_url'         => 'https://console.anthropic.com/settings/keys',
			),
			'grok'      => array(
				'name'            => 'Grok (xAI)',
				'models'          => array(
					// Best: Good balance of speed and quality.
					'grok-3-mini'  => 'Grok 3 Mini (Recommended)',
					// Premium: Full capability for complex forms.
					'grok-3'       => 'Grok 3',
					// Budget: Fastest option.
					'grok-3-fast'  => 'Grok 3 Fast',
				),
				'key_placeholder' => 'xai-...',
				'key_url'         => 'https://console.x.ai/',
			),
			'kimi'      => array(
				'name'            => 'Kimi',
				'models'          => array(
					// Best: Good for Chinese users, solid instruction-following.
					'moonshot-v1-32k'  => 'Moonshot 32K (Recommended)',
					// Premium: Handles very long form templates.
					'moonshot-v1-128k' => 'Moonshot 128K',
					// Budget: Fast for simple forms.
					'moonshot-v1-8k'   => 'Moonshot 8K (Fast)',
				),
				'key_placeholder' => 'sk-...',
				'key_url'         => 'https://platform.moonshot.cn/console/api-keys',
			),
		);
	}

	private function encrypt_key($key)
	{
		if (empty($key)) {
			return '';
		}

		$salt = wp_salt('auth');

		// Use OpenSSL if available.
		if (function_exists('openssl_encrypt')) {
			$iv     = substr(hash('sha256', $salt), 0, 16);
			$cipher = openssl_encrypt($key, 'AES-256-CBC', $salt, 0, $iv);
			return base64_encode('v1:' . $cipher);
		}

		// Fallback: simple encoding (not secure, but better than plain text).
		return base64_encode('v0:' . $key);
	}

	private function decrypt_key($encrypted)
	{
		if (empty($encrypted)) {
			return '';
		}

		$decoded = base64_decode($encrypted);

		// Check version prefix.
		if (0 === strpos($decoded, 'v1:') && function_exists('openssl_decrypt')) {
			$salt   = wp_salt('auth');
			$iv     = substr(hash('sha256', $salt), 0, 16);
			$cipher = substr($decoded, 3);
			$key    = openssl_decrypt($cipher, 'AES-256-CBC', $salt, 0, $iv);
			return false !== $key ? $key : '';
		}

		if (0 === strpos($decoded, 'v0:')) {
			return substr($decoded, 3);
		}

		// Legacy: unencrypted value.
		return $encrypted;
	}

	private function mask_key($key)
	{
		$len = strlen($key);
		if ($len <= 8) {
			return str_repeat('•', 8);
		}
		return substr($key, 0, 4) . str_repeat('•', 8) . substr($key, -4);
	}
}
