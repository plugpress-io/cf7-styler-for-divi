<?php
/**
 * AI API Handler.
 *
 * @package CF7_Mate\Features\AI_Form_Generator
 * @since   3.0.0
 */

namespace CF7_Mate\Features\AI_Form_Generator;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/prompt.php';

/**
 * Class AI_API_Handler
 *
 * Handles secure API requests to AI providers.
 *
 * @since 3.0.0
 */
class AI_API_Handler {

	/**
	 * Settings.
	 *
	 * @var array
	 */
	private $settings;

	/**
	 * Request timeout in seconds.
	 *
	 * @var int
	 */
	const TIMEOUT = 60;

	/**
	 * Constructor.
	 *
	 * @since 3.0.0
	 * @param array|null $settings Settings array.
	 */
	public function __construct( $settings = null ) {
		$this->settings = $settings ?: AI_Settings::get_all_settings();
	}

	/**
	 * Generate form.
	 *
	 * @since  3.0.0
	 * @param  string      $prompt          User prompt.
	 * @param  string|null $image_base64    Optional base64-encoded image (for vision: read image, convert to form).
	 * @param  string      $image_media_type Optional MIME type, e.g. image/jpeg.
	 * @return string|\WP_Error
	 */
	public function generate( $prompt, $image_base64 = null, $image_media_type = 'image/jpeg' ) {
		$provider      = $this->settings['provider'];
		$system_prompt = cf7m_get_ai_system_prompt();

		if ( $image_base64 && ! in_array( $provider, array( 'openai', 'anthropic' ), true ) ) {
			return new \WP_Error(
				'image_unsupported',
				__( 'Image upload is supported only with OpenAI or Anthropic. Please switch provider or use a text prompt.', 'cf7-styler-for-divi' )
			);
		}

		switch ( $provider ) {
			case 'anthropic':
				return $this->call_anthropic( $system_prompt, $prompt, $image_base64, $image_media_type );

			case 'grok':
				return $this->call_grok( $system_prompt, $prompt );

			case 'kimi':
				return $this->call_kimi( $system_prompt, $prompt );

			default:
				return $this->call_openai( $system_prompt, $prompt, $image_base64, $image_media_type );
		}
	}

	/**
	 * Test connection.
	 *
	 * @since  3.0.0
	 * @param  string $provider Provider key.
	 * @return array
	 */
	public function test_connection( $provider ) {
		$test = 'Say "OK" in one word.';

		try {
			switch ( $provider ) {
				case 'anthropic':
					$result = $this->call_anthropic( 'Reply briefly.', $test );
					break;

				case 'grok':
					$result = $this->call_grok( 'Reply briefly.', $test );
					break;

				case 'kimi':
					$result = $this->call_kimi( 'Reply briefly.', $test );
					break;

				default:
					$result = $this->call_openai( 'Reply briefly.', $test );
					break;
			}

			if ( is_wp_error( $result ) ) {
				return array(
					'success' => false,
					'message' => $result->get_error_message(),
				);
			}

			return array(
				'success' => true,
				'message' => __( 'Connected!', 'cf7-styler-for-divi' ),
			);
		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => $e->getMessage(),
			);
		}
	}

	/**
	 * Call OpenAI API (text and optional image/vision).
	 *
	 * @since  3.0.0
	 * @param  string      $system System prompt.
	 * @param  string      $user   User prompt.
	 * @param  string|null $image_base64 Optional base64 image.
	 * @param  string      $image_media_type MIME type for image.
	 * @return string|\WP_Error
	 */
	private function call_openai( $system, $user, $image_base64 = null, $image_media_type = 'image/jpeg' ) {
		$key = $this->settings['openai_key'];

		if ( empty( $key ) ) {
			return new \WP_Error( 'no_key', __( 'OpenAI key not configured.', 'cf7-styler-for-divi' ) );
		}

		$user_content = $user;
		if ( ! empty( $image_base64 ) ) {
			$user_content = array(
				array(
					'type'  => 'text',
					'text'  => $user,
				),
				array(
					'type' => 'image_url',
					'image_url' => array(
						'url' => 'data:' . $image_media_type . ';base64,' . $image_base64,
					),
				),
			);
		}

		$response = wp_remote_post(
			'https://api.openai.com/v1/chat/completions',
			array(
				'timeout'     => self::TIMEOUT,
				'httpversion' => '1.1',
				'headers'     => array(
					'Authorization' => 'Bearer ' . $key,
					'Content-Type'  => 'application/json',
				),
				'body'        => wp_json_encode(
					array(
						'model'       => $this->settings['openai_model'],
						'messages'    => array(
							array(
								'role'    => 'system',
								'content' => $system,
							),
							array(
								'role'    => 'user',
								'content' => $user_content,
							),
						),
						'temperature' => 0.7,
						'max_tokens'  => 4000,
					),
					JSON_UNESCAPED_UNICODE
				),
			)
		);

		return $this->parse_openai_response( $response );
	}

	/**
	 * Call Anthropic API (text and optional image/vision).
	 *
	 * @since  3.0.0
	 * @param  string      $system System prompt.
	 * @param  string      $user   User prompt.
	 * @param  string|null $image_base64 Optional base64 image.
	 * @param  string      $image_media_type MIME type for image.
	 * @return string|\WP_Error
	 */
	private function call_anthropic( $system, $user, $image_base64 = null, $image_media_type = 'image/jpeg' ) {
		$key = $this->settings['anthropic_key'];

		if ( empty( $key ) ) {
			return new \WP_Error( 'no_key', __( 'Anthropic key not configured.', 'cf7-styler-for-divi' ) );
		}

		$user_content = array( array( 'type' => 'text', 'text' => $user ) );
		if ( ! empty( $image_base64 ) ) {
			$user_content[] = array(
				'type'   => 'image',
				'source' => array(
					'type'       => 'base64',
					'media_type' => $image_media_type,
					'data'       => $image_base64,
				),
			);
		}

		$response = wp_remote_post(
			'https://api.anthropic.com/v1/messages',
			array(
				'timeout'     => self::TIMEOUT,
				'httpversion' => '1.1',
				'headers'     => array(
					'x-api-key'         => $key,
					'anthropic-version' => '2023-06-01',
					'Content-Type'      => 'application/json',
				),
				'body'        => wp_json_encode(
					array(
						'model'      => $this->settings['anthropic_model'],
						'max_tokens' => 4000,
						'system'     => $system,
						'messages'   => array(
							array(
								'role'    => 'user',
								'content' => $user_content,
							),
						),
					),
					JSON_UNESCAPED_UNICODE
				),
			)
		);

		return $this->parse_anthropic_response( $response );
	}

	/**
	 * Call Kimi API.
	 *
	 * @since  3.0.0
	 * @param  string $system System prompt.
	 * @param  string $user   User prompt.
	 * @return string|\WP_Error
	 */
	private function call_kimi( $system, $user ) {
		$key = $this->settings['kimi_key'];

		if ( empty( $key ) ) {
			return new \WP_Error( 'no_key', __( 'Kimi key not configured.', 'cf7-styler-for-divi' ) );
		}

		$response = wp_remote_post(
			'https://api.moonshot.cn/v1/chat/completions',
			array(
				'timeout'     => self::TIMEOUT,
				'httpversion' => '1.1',
				'headers'     => array(
					'Authorization' => 'Bearer ' . $key,
					'Content-Type'  => 'application/json',
				),
				'body'        => wp_json_encode(
					array(
						'model'       => $this->settings['kimi_model'],
						'messages'    => array(
							array(
								'role'    => 'system',
								'content' => $system,
							),
							array(
								'role'    => 'user',
								'content' => $user,
							),
						),
						'temperature' => 0.7,
						'max_tokens'  => 4000,
					),
					JSON_UNESCAPED_UNICODE
				),
			)
		);

		return $this->parse_openai_response( $response );
	}

	/**
	 * Call Grok (xAI) API.
	 *
	 * @since  3.0.0
	 * @param  string $system System prompt.
	 * @param  string $user   User prompt.
	 * @return string|\WP_Error
	 */
	private function call_grok( $system, $user ) {
		$key = $this->settings['grok_key'];

		if ( empty( $key ) ) {
			return new \WP_Error( 'no_key', __( 'Grok API key not configured.', 'cf7-styler-for-divi' ) );
		}

		$response = wp_remote_post(
			'https://api.x.ai/v1/chat/completions',
			array(
				'timeout'     => self::TIMEOUT,
				'httpversion' => '1.1',
				'headers'     => array(
					'Authorization' => 'Bearer ' . $key,
					'Content-Type'  => 'application/json',
				),
				'body'        => wp_json_encode(
					array(
						'model'       => $this->settings['grok_model'],
						'messages'    => array(
							array(
								'role'    => 'system',
								'content' => $system,
							),
							array(
								'role'    => 'user',
								'content' => $user,
							),
						),
						'temperature' => 0.7,
						'max_tokens'  => 4000,
					),
					JSON_UNESCAPED_UNICODE
				),
			)
		);

		return $this->parse_openai_response( $response );
	}

	/**
	 * Parse OpenAI-style response.
	 *
	 * @since  3.0.0
	 * @param  array|\WP_Error $response Response.
	 * @return string|\WP_Error
	 */
	private function parse_openai_response( $response ) {
		if ( is_wp_error( $response ) ) {
			return new \WP_Error(
				'request_failed',
				sprintf(
					/* translators: %s: error message */
					__( 'Request failed: %s', 'cf7-styler-for-divi' ),
					$response->get_error_message()
				)
			);
		}

		$code = wp_remote_retrieve_response_code( $response );
		$body = wp_remote_retrieve_body( $response );
		$data = json_decode( $body, true );

		if ( $code >= 400 ) {
			$message = $data['error']['message'] ?? __( 'API request failed.', 'cf7-styler-for-divi' );
			return new \WP_Error( 'api_error', $message );
		}

		if ( isset( $data['choices'][0]['message']['content'] ) ) {
			return $data['choices'][0]['message']['content'];
		}

		return new \WP_Error( 'invalid_response', __( 'Invalid API response.', 'cf7-styler-for-divi' ) );
	}

	/**
	 * Parse Anthropic response.
	 *
	 * @since  3.0.0
	 * @param  array|\WP_Error $response Response.
	 * @return string|\WP_Error
	 */
	private function parse_anthropic_response( $response ) {
		if ( is_wp_error( $response ) ) {
			return new \WP_Error(
				'request_failed',
				sprintf(
					/* translators: %s: error message */
					__( 'Request failed: %s', 'cf7-styler-for-divi' ),
					$response->get_error_message()
				)
			);
		}

		$code = wp_remote_retrieve_response_code( $response );
		$body = wp_remote_retrieve_body( $response );
		$data = json_decode( $body, true );

		if ( $code >= 400 ) {
			$message = $data['error']['message'] ?? __( 'API request failed.', 'cf7-styler-for-divi' );
			return new \WP_Error( 'api_error', $message );
		}

		if ( isset( $data['content'][0]['text'] ) ) {
			return $data['content'][0]['text'];
		}

		return new \WP_Error( 'invalid_response', __( 'Invalid API response.', 'cf7-styler-for-divi' ) );
	}
}
