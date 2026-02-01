<?php

/**
 * AI Form Generator Module.
 *
 * Adds AI-powered form generation to Contact Form 7 editor.
 *
 * @package CF7_Mate\Features\AI_Form_Generator
 * @since   3.0.0
 */

namespace CF7_Mate\Features\AI_Form_Generator;

use CF7_Mate\Pro\Pro_Feature_Base;
use CF7_Mate\Pro\Traits\Singleton;

if (! defined('ABSPATH')) {
	exit;
}

// Load dependencies.
require_once __DIR__ . '/prompt.php';
require_once __DIR__ . '/settings.php';
require_once __DIR__ . '/api-handler.php';

/**
 * Class AI_Form_Generator
 *
 * @since 3.0.0
 */
class AI_Form_Generator extends Pro_Feature_Base
{

	use Singleton;

	/**
	 * Constructor.
	 *
	 * @since 3.0.0
	 */
	protected function __construct()
	{
		parent::__construct();
	}

	/**
	 * Initialize the feature.
	 *
	 * @since  3.0.0
	 * @return void
	 */
	protected function init()
	{
		AI_Settings::instance();

		add_action('admin_enqueue_scripts', array($this, 'enqueue_assets'));
		add_action('rest_api_init', array($this, 'register_routes'));
		add_action('admin_footer', array($this, 'render_button'));
	}

	/**
	 * Render AI button in CF7 editor.
	 *
	 * @since  3.0.0
	 * @return void
	 */
	public function render_button()
	{
		$screen = get_current_screen();

		if (! $screen || false === strpos($screen->id, 'wpcf7')) {
			return;
		}

		$text = esc_js(__('AI Generate', 'cf7-styler-for-divi'));
?>
		<script>
			(function() {
				// Prefer next to page title (Edit Contact Form) for visibility.
				var targets = [
					'.wrap.contact-form-editor h1',
					'#wpcf7-contact-form-editor .wrap h1',
					'.wrap h1.wp-heading-inline',
					'#wpcf7-form-editor-tabs',
					'#tag-generator-list',
					'.wpcf7-tag-generator-wrap'
				];
				var container = null;
				var insertAfter = false;
				for (var i = 0; i < targets.length; i++) {
					container = document.querySelector(targets[i]);
					if (container) {
						insertAfter = container.tagName === 'H1';
						break;
					}
				}
				if (!container) {
					container = document.querySelector('#wpcf7-form');
					if (!container) return;
				}
				if (document.getElementById('cf7m-ai-btn')) return;

				var b = document.createElement('button');
				b.type = 'button';
				b.id = 'cf7m-ai-btn';
				b.className = 'cf7m-ai-btn cf7m-ai-btn-premium button';
				b.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> <?php echo $text; ?>';
				if (insertAfter && container.parentNode) {
					container.parentNode.insertBefore(b, container.nextSibling);
				} else {
					container.parentNode.insertBefore(b, container);
				}
			})();
		</script>
<?php
	}

	/**
	 * Enqueue modal assets.
	 *
	 * @since  3.0.0
	 * @return void
	 */
	public function enqueue_assets()
	{
		$screen = get_current_screen();

		if (! $screen || false === strpos($screen->id, 'wpcf7')) {
			return;
		}

		wp_enqueue_style(
			'cf7m-ai-generator',
			CF7M_PLUGIN_URL . 'assets/pro/css/cf7m-ai-generator.css',
			array(),
			CF7M_VERSION
		);

		wp_enqueue_script(
			'cf7m-ai-generator',
			CF7M_PLUGIN_URL . 'assets/pro/js/cf7m-ai-generator.js',
			array('jquery'),
			CF7M_VERSION,
			true
		);

		$settings = AI_Settings::get_all_settings();
		$provider = $settings['provider'];
		$has_key  = ! empty($settings[$provider . '_key']);
		$providers = AI_Settings::get_providers();

		// Get presets for one-click generation.
		$presets = function_exists('cf7m_get_ai_presets') ? cf7m_get_ai_presets() : array();

		wp_localize_script(
			'cf7m-ai-generator',
			'cf7mAI',
			array(
				'generateUrl' => esc_url_raw(rest_url('cf7-styler/v1/ai-generate')),
				'settingsUrl' => esc_url(admin_url('admin.php?page=cf7-mate-ai-provider')),
				'nonce'       => wp_create_nonce('wp_rest'),
				'hasApiKey'   => $has_key,
				'provider'    => $providers[$provider]['name'] ?? 'AI',
				'presets'     => $presets,
				'strings'     => array(
					'title'       => __('AI Form Generator', 'cf7-styler-for-divi'),
					'presets'     => __('Quick Presets', 'cf7-styler-for-divi'),
					'custom'      => __('Custom Prompt', 'cf7-styler-for-divi'),
					'generate'    => __('Generate', 'cf7-styler-for-divi'),
					'insert'      => __('Insert', 'cf7-styler-for-divi'),
					'copy'        => __('Copy', 'cf7-styler-for-divi'),
					'generating'  => __('Generating...', 'cf7-styler-for-divi'),
					'error'       => __('Error generating form.', 'cf7-styler-for-divi'),
					'copied'      => __('Copied!', 'cf7-styler-for-divi'),
					'configure'   => __('Configure', 'cf7-styler-for-divi'),
					'noKey'       => __('Configure AI provider first.', 'cf7-styler-for-divi'),
					'or'          => __('or describe your form', 'cf7-styler-for-divi'),
				),
			)
		);
	}

	/**
	 * Register REST API routes.
	 *
	 * @since  3.0.0
	 * @return void
	 */
	public function register_routes()
	{
		register_rest_route(
			'cf7-styler/v1',
			'/ai-generate',
			array(
				'methods'             => 'POST',
				'callback'            => array($this, 'handle_generate'),
				'permission_callback' => function () {
					return current_user_can('wpcf7_edit_contact_forms');
				},
			)
		);
	}


	public function handle_generate(\WP_REST_Request $request)
	{
		$prompt = sanitize_textarea_field($request->get_param('prompt'));

		if (empty($prompt)) {
			return new \WP_Error(
				'empty_prompt',
				__('Please describe the form.', 'cf7-styler-for-divi'),
				array('status' => 400)
			);
		}

		$handler = new AI_API_Handler();
		$result  = $handler->generate($prompt);

		if (is_wp_error($result)) {
			return $result;
		}

		$form = $this->clean_response($result);

		return rest_ensure_response(
			array(
				'success' => true,
				'form'    => $form,
			)
		);
	}

	/**
	 * Clean AI response to extract form code.
	 *
	 * @since  3.0.0
	 * @param  string $response Raw AI response.
	 * @return string Cleaned form code.
	 */
	private function clean_response($response)
	{
		// Remove markdown code blocks.
		$response = preg_replace('/^```[a-z]*\n?/m', '', $response);
		$response = preg_replace('/\n?```$/m', '', $response);

		return trim($response);
	}
}
