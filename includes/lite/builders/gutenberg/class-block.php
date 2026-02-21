<?php
/**
 * Gutenberg Block – CF7 Styler.
 *
 * Handles block registration (from block.json), editor asset enqueuing,
 * the custom REST preview endpoint, server-side rendering, and CSS generation.
 *
 * @package CF7_Mate\Gutenberg
 * @since   3.0.0
 */

namespace CF7_Mate\Gutenberg;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Block {

	/**
	 * Singleton instance.
	 *
	 * @var Block|null
	 */
	private static $instance = null;

	/**
	 * Get singleton.
	 *
	 * @return Block
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor – register hooks.
	 */
	private function __construct() {
		add_action( 'init', array( $this, 'register' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   Registration
	   ═══════════════════════════════════════════════════════════════════════ */

	/**
	 * Register the block type from the co-located block.json.
	 */
	public function register() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		register_block_type(
			__DIR__,
			array( 'render_callback' => array( $this, 'render' ) )
		);
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   Editor assets
	   ═══════════════════════════════════════════════════════════════════════ */

	/**
	 * Enqueue editor-only JS, CSS, and third-party stylesheets.
	 */
	public function enqueue_editor_assets() {
		$js_path  = CF7M_PLUGIN_PATH . 'dist/js/blocks.js';
		$css_path = CF7M_PLUGIN_PATH . 'dist/css/blocks.css';

		if ( ! file_exists( $js_path ) ) {
			return;
		}

		wp_enqueue_script(
			'cf7m-gutenberg-editor',
			CF7M_PLUGIN_URL . 'dist/js/blocks.js',
			array( 'wp-blocks', 'wp-block-editor', 'wp-components', 'wp-element', 'wp-i18n', 'wp-api-fetch' ),
			CF7M_VERSION,
			true
		);

		wp_localize_script(
			'cf7m-gutenberg-editor',
			'cf7mGutenbergData',
			array( 'forms' => $this->get_forms_list() )
		);

		if ( file_exists( $css_path ) ) {
			wp_enqueue_style(
				'cf7m-gutenberg-editor-style',
				CF7M_PLUGIN_URL . 'dist/css/blocks.css',
				array(),
				CF7M_VERSION
			);
		}

		// CF7 frontend CSS so the block preview is styled.
		if ( wp_style_is( 'contact-form-7', 'registered' ) ) {
			wp_enqueue_style( 'contact-form-7' );
		}

		// Pro forms CSS (multi-step, multi-column, calculator, etc.).
		$pro_css = CF7M_PLUGIN_PATH . 'assets/pro/css/cf7m-pro-forms.css';
		if ( file_exists( $pro_css ) ) {
			wp_enqueue_style(
				'cf7m-pro-forms-editor',
				CF7M_PLUGIN_URL . 'assets/pro/css/cf7m-pro-forms.css',
				array(),
				CF7M_VERSION
			);
		}
	}

	/**
	 * Build the forms dropdown list for the editor.
	 *
	 * @return array<int,array{value:string,label:string}>
	 */
	private function get_forms_list() {
		$forms = array();

		if ( function_exists( 'cf7m_get_contact_forms' ) ) {
			foreach ( cf7m_get_contact_forms() as $id => $title ) {
				$forms[] = array(
					'value' => (string) $id,
					'label' => $title,
				);
			}
		}

		return $forms;
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   REST API – editor preview
	   ═══════════════════════════════════════════════════════════════════════ */

	/**
	 * Register the custom render-block endpoint.
	 *
	 * Bypasses the core block-renderer endpoint's strict attribute
	 * validation that rejects unknown attribute keys with a 400.
	 */
	public function register_rest_routes() {
		register_rest_route(
			'cf7m/v1',
			'/render-block',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'rest_render_block' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
				'args'                => array(
					'attributes' => array(
						'type'              => 'object',
						'default'           => array(),
						'sanitize_callback' => function ( $value ) {
							return is_array( $value ) ? $value : array();
						},
					),
				),
			)
		);
	}

	/**
	 * REST callback – return rendered block HTML.
	 *
	 * @param  \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function rest_render_block( $request ) {
		$attrs = $request->get_param( 'attributes' );
		if ( ! is_array( $attrs ) ) {
			$attrs = array();
		}

		return new \WP_REST_Response(
			array( 'rendered' => $this->render( $attrs ) ),
			200
		);
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   Server-side render
	   ═══════════════════════════════════════════════════════════════════════ */

	/**
	 * Render the CF7 Styler block (frontend + editor preview).
	 *
	 * @param  array          $attrs   Block attributes.
	 * @param  string         $content Inner content (unused).
	 * @param  \WP_Block|null $block   Block instance.
	 * @return string HTML output.
	 */
	public function render( $attrs, $content = '', $block = null ) {
		$form_id  = isset( $attrs['formId'] ) ? (int) $attrs['formId'] : 0;
		$block_id = ! empty( $attrs['blockId'] ) ? sanitize_html_class( $attrs['blockId'] ) : '';

		if ( $form_id <= 0 ) {
			return '<p>' . esc_html__( 'Please select a Contact Form 7 form.', 'cf7-styler-for-divi' ) . '</p>';
		}

		if ( 'wpcf7_contact_form' !== get_post_type( $form_id ) ) {
			return '<p>' . esc_html__( 'The selected Contact Form 7 form no longer exists.', 'cf7-styler-for-divi' ) . '</p>';
		}

		if ( ! $block_id ) {
			$block_id = 'cf7m-gb-' . substr( md5( 'cf7m' . $form_id . wp_json_encode( $attrs ) ), 0, 8 );
		}

		$scope = '#' . $block_id;

		// CSS.
		$css = $this->build_css( $attrs, $scope );

		// Form header.
		$header_html = $this->build_header( $attrs );

		// Wrapper classes.
		$classes       = 'cf7m-gutenberg-block';
		$inner_classes = 'dipe-cf7 dipe-cf7-styler';

		if ( ! empty( $attrs['fullwidthButton'] ) ) {
			$classes .= ' cf7m-button-fullwidth';
		}
		if ( ! empty( $attrs['crCustomStyles'] ) ) {
			$inner_classes .= ' dipe-cf7-cr';
		}

		// CF7 shortcode.
		$shortcode = do_shortcode( sprintf( '[contact-form-7 id="%d"]', $form_id ) );

		if ( strpos( $shortcode, '[cf7m-presets' ) !== false || strpos( $shortcode, '[/cf7m-presets]' ) !== false ) {
			$shortcode = preg_replace( '/\[cf7m-presets[^\]]*\]|\[\/cf7m-presets\]/i', '', $shortcode );
		}

		// Output.
		$out = $css ? '<style>' . $css . '</style>' : '';

		$out .= '<div id="' . esc_attr( $block_id ) . '" class="' . esc_attr( $classes ) . '">';
		$out .= $header_html;
		$out .= '<div class="' . esc_attr( $inner_classes ) . '">';
		$out .= $shortcode;
		$out .= '</div></div>';

		return $out;
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   Form header
	   ═══════════════════════════════════════════════════════════════════════ */

	/**
	 * Build optional form header HTML.
	 *
	 * @param  array  $attrs Block attributes.
	 * @return string
	 */
	private function build_header( $attrs ) {
		if ( empty( $attrs['useFormHeader'] ) ) {
			return '';
		}

		$media = '';
		if ( ! empty( $attrs['useIcon'] ) && ! empty( $attrs['headerIconClass'] ) ) {
			$media = '<div class="cf7m-form-header-icon"><i class="' . esc_attr( $attrs['headerIconClass'] ) . '"></i></div>';
		} elseif ( ! empty( $attrs['headerImageUrl'] ) ) {
			$media = '<div class="cf7m-form-header-image"><img src="' . esc_url( $attrs['headerImageUrl'] ) . '" alt="" /></div>';
		}

		$info = '';
		if ( ! empty( $attrs['formHeaderTitle'] ) ) {
			$info .= '<h2 class="cf7m-form-header-title">' . esc_html( $attrs['formHeaderTitle'] ) . '</h2>';
		}
		if ( ! empty( $attrs['formHeaderText'] ) ) {
			$info .= '<div class="cf7m-form-header-text">' . esc_html( $attrs['formHeaderText'] ) . '</div>';
		}
		if ( $info ) {
			$info = '<div class="cf7m-form-header-info">' . $info . '</div>';
		}

		return '<div class="cf7m-form-header-container"><div class="cf7m-form-header">' . $media . $info . '</div></div>';
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   CSS builder
	   ═══════════════════════════════════════════════════════════════════════ */

	/**
	 * Build scoped CSS from block attributes.
	 *
	 * @param  array  $a Block attributes.
	 * @param  string $s CSS scope selector (e.g. '#cf7m-gb-abc12345').
	 * @return string CSS rules (no wrapping <style> tag).
	 */
	private function build_css( $a, $s ) {
		$rules = array();

		$field_sel  = $s . ' .dipe-cf7-styler .wpcf7 input:not([type=submit]):not([type=checkbox]):not([type=radio]),'
			. $s . ' .dipe-cf7-styler .wpcf7 select,'
			. $s . ' .dipe-cf7-styler .wpcf7 textarea';
		$button_sel = $s . ' .dipe-cf7-styler .wpcf7-form input[type=submit]';

		// Form header.
		$header = array();
		if ( $this->has_val( $a, 'formHeaderBg' ) )           { $header[] = 'background-color:' . $this->sanitize_css_color( $a['formHeaderBg'] ); }
		$this->add_padding( $a, 'formHeaderPadding', $header );
		if ( $this->has_val( $a, 'formHeaderBottomSpacing' ) ) { $header[] = 'margin-bottom:' . $this->sanitize_css_length( $a['formHeaderBottomSpacing'] ); }
		if ( $header ) { $rules[] = $s . ' .cf7m-form-header-container{' . implode( ';', $header ) . '}'; }

		if ( $this->has_val( $a, 'formHeaderImgBg' ) ) {
			$rules[] = $s . ' .cf7m-form-header-icon,' . $s . ' .cf7m-form-header-image{background-color:' . $this->sanitize_css_color( $a['formHeaderImgBg'] ) . '}';
		}
		if ( $this->has_val( $a, 'formHeaderIconColor' ) ) {
			$rules[] = $s . ' .cf7m-form-header-icon i{color:' . $this->sanitize_css_color( $a['formHeaderIconColor'] ) . '}';
			$rules[] = $s . ' .cf7m-form-header-icon svg{fill:' . $this->sanitize_css_color( $a['formHeaderIconColor'] ) . '}';
		}

		// Form common.
		$form = array();
		if ( $this->has_val( $a, 'formBg' ) )          { $form[] = 'background-color:' . $this->sanitize_css_color( $a['formBg'] ); }
		$this->add_padding( $a, 'formPadding', $form );
		if ( $this->has_val( $a, 'formBorderRadius' ) ) { $form[] = 'border-radius:' . $this->sanitize_css_length( $a['formBorderRadius'] ); }
		if ( $form ) { $rules[] = $s . ' .dipe-cf7-styler{' . implode( ';', $form ) . '}'; }

		if ( ! empty( $a['fullwidthButton'] ) ) {
			$rules[] = $s . ' .dipe-cf7-styler .wpcf7-form input[type=submit]{width:100%}';
		}
		if ( ! empty( $a['buttonAlignment'] ) && 'left' !== $a['buttonAlignment'] && empty( $a['fullwidthButton'] ) ) {
			$rules[] = $s . ' .dipe-cf7-styler .wpcf7-form p:last-of-type{text-align:' . $this->sanitize_css_text_align( $a['buttonAlignment'] ) . '}';
		}

		// Fields.
		$field = array();
		if ( $this->has_val( $a, 'fieldBgColor' ) )  { $field[] = 'background-color:' . $this->sanitize_css_color( $a['fieldBgColor'] ); }
		if ( $this->has_val( $a, 'fieldTextColor' ) ) { $field[] = 'color:' . $this->sanitize_css_color( $a['fieldTextColor'] ); }
		$this->add_padding( $a, 'fieldPadding', $field );

		if ( $this->has_val( $a, 'fieldBorderWidth' ) ) {
			$style   = $this->has_val( $a, 'fieldBorderStyle' ) ? $a['fieldBorderStyle'] : 'solid';
			$color   = $this->has_val( $a, 'fieldBorderColor' ) ? ' ' . $this->sanitize_css_color( $a['fieldBorderColor'] ) : '';
			$field[] = 'border:' . $this->sanitize_css_length( $a['fieldBorderWidth'] ) . ' ' . $this->sanitize_css_border_style( $style ) . $color;
		}
		if ( $this->has_val( $a, 'fieldBorderRadius' ) ) { $field[] = 'border-radius:' . $this->sanitize_css_length( $a['fieldBorderRadius'] ); }
		if ( $field ) { $rules[] = $field_sel . '{' . implode( ';', $field ) . '}'; }

		if ( $this->has_val( $a, 'fieldHeight' ) ) {
			$h_sel   = $s . ' .dipe-cf7-styler .wpcf7 input:not([type=submit]):not([type=checkbox]):not([type=radio]),'
				. $s . ' .dipe-cf7-styler .wpcf7 select';
			$rules[] = $h_sel . '{height:' . $this->sanitize_css_length( $a['fieldHeight'] ) . '}';
		}
		if ( $this->has_val( $a, 'fieldFocusBorderColor' ) ) {
			$f_sel   = $s . ' .dipe-cf7-styler .wpcf7 input:not([type=submit]):focus,'
				. $s . ' .dipe-cf7-styler .wpcf7 select:focus,'
				. $s . ' .dipe-cf7-styler .wpcf7 textarea:focus';
			$rules[] = $f_sel . '{border-color:' . $this->sanitize_css_color( $a['fieldFocusBorderColor'] ) . '}';
		}
		if ( $this->has_val( $a, 'fieldSpacing' ) ) {
			$sp_sel  = $s . ' .dipe-cf7-styler .wpcf7 form > p,'
				. $s . ' .dipe-cf7-styler .wpcf7 form > div,'
				. $s . ' .dipe-cf7-styler .wpcf7 form > label';
			$rules[] = $sp_sel . '{margin-bottom:' . $this->sanitize_css_length( $a['fieldSpacing'] ) . '}';
		}

		// Labels.
		if ( $this->has_val( $a, 'labelColor' ) ) {
			$rules[] = $s . ' .dipe-cf7-styler .wpcf7 label{color:' . $this->sanitize_css_color( $a['labelColor'] ) . '}';
		}
		if ( $this->has_val( $a, 'labelSpacing' ) ) {
			$rules[] = $s . ' .dipe-cf7-styler .wpcf7 .wpcf7-form-control:not(.wpcf7-submit){margin-top:' . $this->sanitize_css_length( $a['labelSpacing'] ) . '}';
		}

		// Placeholder.
		if ( $this->has_val( $a, 'placeholderColor' ) ) {
			$ph      = $s . ' .dipe-cf7-styler .wpcf7 input::placeholder,' . $s . ' .dipe-cf7-styler .wpcf7 textarea::placeholder';
			$rules[] = $ph . '{color:' . $this->sanitize_css_color( $a['placeholderColor'] ) . '}';
		}

		// Radio & checkbox.
		if ( ! empty( $a['crCustomStyles'] ) ) {
			$cr = $s . ' .dipe-cf7-cr .wpcf7-checkbox input[type=checkbox] + span:before,'
				. $s . ' .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox] + span:before,'
				. $s . ' .dipe-cf7-cr .wpcf7-radio input[type=radio] + span:before';

			if ( $this->has_val( $a, 'crSize' ) ) {
				$rules[] = $cr . '{width:' . $this->sanitize_css_length( $a['crSize'] ) . ';height:' . $this->sanitize_css_length( $a['crSize'] ) . '}';
			}
			if ( $this->has_val( $a, 'crBgColor' ) ) {
				$rules[] = $s . ' .dipe-cf7-cr .wpcf7-checkbox input[type=checkbox] + span:before,'
					. $s . ' .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox] + span:before,'
					. $s . ' .dipe-cf7-cr .wpcf7-radio input[type=radio]:not(:checked) + span:before'
					. '{background-color:' . $this->sanitize_css_color( $a['crBgColor'] ) . '}';
			}
			if ( $this->has_val( $a, 'crSelectedColor' ) ) {
				$rules[] = $s . ' .dipe-cf7-cr .wpcf7-checkbox input[type=checkbox]:checked + span:before,'
					. $s . ' .dipe-cf7-cr .wpcf7-acceptance input[type=checkbox]:checked + span:before'
					. '{color:' . $this->sanitize_css_color( $a['crSelectedColor'] ) . '}';
				$rules[] = $s . ' .dipe-cf7-cr .wpcf7-radio input[type=radio]:checked + span:before{background-color:' . $this->sanitize_css_color( $a['crSelectedColor'] ) . '}';
			}
			if ( $this->has_val( $a, 'crBorderColor' ) ) { $rules[] = $cr . '{border-color:' . $this->sanitize_css_color( $a['crBorderColor'] ) . '}'; }
			if ( $this->has_val( $a, 'crBorderSize' ) )  { $rules[] = $cr . '{border-width:' . $this->sanitize_css_length( $a['crBorderSize'] ) . '}'; }
			if ( $this->has_val( $a, 'crLabelColor' ) ) {
				$rules[] = $s . ' .dipe-cf7-cr .wpcf7-checkbox label,' . $s . ' .dipe-cf7-cr .wpcf7-radio label{color:' . $this->sanitize_css_color( $a['crLabelColor'] ) . '}';
			}
		}

		// Button.
		$btn = array();
		if ( $this->has_val( $a, 'buttonTextColor' ) )    { $btn[] = 'color:' . $this->sanitize_css_color( $a['buttonTextColor'] ); }
		if ( $this->has_val( $a, 'buttonBgColor' ) )      { $btn[] = 'background-color:' . $this->sanitize_css_color( $a['buttonBgColor'] ); }
		$this->add_padding( $a, 'buttonPadding', $btn );
		if ( $this->has_val( $a, 'buttonBorderRadius' ) ) { $btn[] = 'border-radius:' . $this->sanitize_css_length( $a['buttonBorderRadius'] ); }
		if ( $btn ) { $rules[] = $button_sel . '{' . implode( ';', $btn ) . '}'; }

		$hover = array();
		if ( $this->has_val( $a, 'buttonTextColorHover' ) )   { $hover[] = 'color:' . $this->sanitize_css_color( $a['buttonTextColorHover'] ); }
		if ( $this->has_val( $a, 'buttonBgColorHover' ) )     { $hover[] = 'background-color:' . $this->sanitize_css_color( $a['buttonBgColorHover'] ); }
		if ( $this->has_val( $a, 'buttonBorderColorHover' ) ) { $hover[] = 'border-color:' . $this->sanitize_css_color( $a['buttonBorderColorHover'] ); }
		if ( $hover ) { $rules[] = $button_sel . ':hover{' . implode( ';', $hover ) . '}'; }

		// Validation messages.
		$tip_sel = $s . ' .dipe-cf7-styler span.wpcf7-not-valid-tip';
		$msg     = array();
		if ( $this->has_val( $a, 'msgColor' ) )       { $msg[] = 'color:' . $this->sanitize_css_color( $a['msgColor'] ); }
		if ( $this->has_val( $a, 'msgBgColor' ) )     { $msg[] = 'background-color:' . $this->sanitize_css_color( $a['msgBgColor'] ); }
		if ( $this->has_val( $a, 'msgBorderColor' ) ) { $msg[] = 'border:2px solid ' . $this->sanitize_css_color( $a['msgBorderColor'] ); }
		if ( $this->has_val( $a, 'msgPadding' ) )     { $msg[] = 'padding:' . $this->sanitize_css_length( $a['msgPadding'] ); }
		if ( $this->has_val( $a, 'msgMarginTop' ) )   { $msg[] = 'margin-top:' . $this->sanitize_css_length( $a['msgMarginTop'] ); }
		if ( $msg ) { $rules[] = $tip_sel . '{' . implode( ';', $msg ) . '}'; }

		if ( $this->has_val( $a, 'msgAlignment' ) ) {
			$rules[] = $s . ' .dipe-cf7-styler .wpcf7 form .wpcf7-response-output,' . $tip_sel . '{text-align:' . $this->sanitize_css_text_align( $a['msgAlignment'] ) . '}';
		}

		// Success message.
		$ok_sel = $s . ' .dipe-cf7-styler .wpcf7 form.sent .wpcf7-response-output';
		$ok     = array();
		if ( $this->has_val( $a, 'successMsgColor' ) )    { $ok[] = 'color:' . $this->sanitize_css_color( $a['successMsgColor'] ); }
		if ( $this->has_val( $a, 'successMsgBgColor' ) )  { $ok[] = 'background-color:' . $this->sanitize_css_color( $a['successMsgBgColor'] ); }
		if ( $this->has_val( $a, 'successBorderColor' ) ) { $ok[] = 'border-color:' . $this->sanitize_css_color( $a['successBorderColor'] ); }
		if ( $ok ) { $rules[] = $ok_sel . '{' . implode( ';', $ok ) . '}'; }

		// Error message.
		$err_sel = $s . ' .dipe-cf7-styler .wpcf7 form.invalid .wpcf7-response-output,'
			. $s . ' .dipe-cf7-styler .wpcf7 form.unaccepted .wpcf7-response-output,'
			. $s . ' .dipe-cf7-styler .wpcf7 form.failed .wpcf7-response-output';
		$err     = array();
		if ( $this->has_val( $a, 'errorMsgColor' ) )    { $err[] = 'color:' . $this->sanitize_css_color( $a['errorMsgColor'] ); }
		if ( $this->has_val( $a, 'errorMsgBgColor' ) )  { $err[] = 'background-color:' . $this->sanitize_css_color( $a['errorMsgBgColor'] ); }
		if ( $this->has_val( $a, 'errorBorderColor' ) ) { $err[] = 'border-color:' . $this->sanitize_css_color( $a['errorBorderColor'] ); }
		if ( $err ) { $rules[] = $err_sel . '{' . implode( ';', $err ) . '}'; }

		return implode( "\n", $rules );
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   Private helpers
	   ═══════════════════════════════════════════════════════════════════════ */

	/**
	 * Check if an attribute has a non-empty value.
	 *
	 * @param  array  $attrs Block attributes.
	 * @param  string $key   Attribute key.
	 * @return bool
	 */
	private function has_val( $attrs, $key ) {
		return isset( $attrs[ $key ] ) && '' !== $attrs[ $key ];
	}

	/**
	 * Append padding shorthand from Top/Right/Bottom/Left attrs.
	 *
	 * @param  array  $attrs  Block attributes.
	 * @param  string $prefix Attribute prefix (e.g. 'formPadding').
	 * @param  array  $props  CSS properties array (by reference).
	 */
	private function add_padding( $attrs, $prefix, &$props ) {
		$t = isset( $attrs[ $prefix . 'Top' ] )    ? $attrs[ $prefix . 'Top' ]    : '';
		$r = isset( $attrs[ $prefix . 'Right' ] )  ? $attrs[ $prefix . 'Right' ]  : '';
		$b = isset( $attrs[ $prefix . 'Bottom' ] ) ? $attrs[ $prefix . 'Bottom' ] : '';
		$l = isset( $attrs[ $prefix . 'Left' ] )   ? $attrs[ $prefix . 'Left' ]   : '';

		if ( '' !== $t || '' !== $r || '' !== $b || '' !== $l ) {
			$props[] = 'padding:' . $this->sanitize_css_length( $t ?: '0' ) . ' ' . $this->sanitize_css_length( $r ?: '0' ) . ' ' . $this->sanitize_css_length( $b ?: '0' ) . ' ' . $this->sanitize_css_length( $l ?: '0' );
		}
	}

	/**
	 * Sanitize a CSS color value.
	 *
	 * Accepts hex (#abc, #aabbcc, #aabbccdd), rgb/rgba/hsl/hsla functions,
	 * and named CSS colors. Returns empty string for invalid values.
	 *
	 * @param  string $value Raw color value.
	 * @return string Sanitized color or empty string.
	 */
	private function sanitize_css_color( $value ) {
		$value = trim( $value );

		if ( '' === $value ) {
			return '';
		}

		// Hex colors.
		if ( preg_match( '/^#[0-9a-fA-F]{3,8}$/', $value ) ) {
			return $value;
		}

		// rgb/rgba/hsl/hsla functions – allow digits, commas, spaces, dots, %, /.
		if ( preg_match( '/^(rgba?|hsla?)\([0-9a-f,.\s\/%]+\)$/i', $value ) ) {
			return $value;
		}

		// Named colors – letters and hyphens only.
		if ( preg_match( '/^[a-zA-Z\-]+$/', $value ) ) {
			return $value;
		}

		return '';
	}

	/**
	 * Sanitize a CSS length/dimension value.
	 *
	 * Accepts numbers with standard CSS units (px, em, rem, %, vw, vh, etc.)
	 * and the keyword "auto". Returns empty string for invalid values.
	 *
	 * @param  string $value Raw length value.
	 * @return string Sanitized length or empty string.
	 */
	private function sanitize_css_length( $value ) {
		$value = trim( $value );

		if ( '' === $value ) {
			return '';
		}

		if ( 'auto' === $value || '0' === $value ) {
			return $value;
		}

		// Number with optional unit.
		if ( preg_match( '/^-?[0-9]*\.?[0-9]+(px|em|rem|%|vw|vh|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/', $value ) ) {
			return $value;
		}

		return '';
	}

	/**
	 * Sanitize a CSS border-style value.
	 *
	 * @param  string $value Raw border-style value.
	 * @return string Sanitized border-style or 'solid' as default.
	 */
	private function sanitize_css_border_style( $value ) {
		$allowed = array( 'none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset' );
		return in_array( $value, $allowed, true ) ? $value : 'solid';
	}

	/**
	 * Sanitize a CSS text-align value.
	 *
	 * @param  string $value Raw text-align value.
	 * @return string Sanitized text-align or 'left' as default.
	 */
	private function sanitize_css_text_align( $value ) {
		$allowed = array( 'left', 'center', 'right', 'justify' );
		return in_array( $value, $allowed, true ) ? $value : 'left';
	}
}
