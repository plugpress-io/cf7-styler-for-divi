<?php
/**
 * Partial Save – CF7 editor panel (per-form enable toggle).
 *
 * @package CF7_Mate\Features\Partial_Save
 * @since 3.1.0
 */

namespace CF7_Mate\Features\Partial_Save;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Partial_Save_Editor_Panel {

	const NONCE_ACTION = 'cf7m_partial_save';
	const NONCE_NAME   = 'cf7m_partial_save_nonce';
	const META_KEY     = '_cf7m_partial_save_enabled';

	public function __construct() {
		add_action( 'cf7m_editor_panel_sections', [ $this, 'render_section' ] );
		add_action( 'wpcf7_save_contact_form', [ $this, 'save' ], 10, 1 );
	}

	public function render_section( $contact_form ) {
		$form_id = $contact_form ? (int) $contact_form->id() : 0;
		$enabled = $form_id ? get_post_meta( $form_id, self::META_KEY, true ) === '1' : false;
		?>
		<fieldset style="margin-top:20px;">
			<legend><?php esc_html_e( 'Save & Continue', 'cf7-styler-for-divi' ); ?></legend>

			<?php wp_nonce_field( self::NONCE_ACTION, self::NONCE_NAME ); ?>

			<p>
				<label>
					<input type="checkbox" name="cf7m_partial_save_enabled" value="1" <?php checked( $enabled ); ?> />
					<?php esc_html_e( 'Allow users to save their progress and return later.', 'cf7-styler-for-divi' ); ?>
				</label>
			</p>
			<p class="description">
				<?php esc_html_e( 'When enabled, a "Save progress" button appears in the form. Progress is saved for 7 days using a browser token — no account required.', 'cf7-styler-for-divi' ); ?>
			</p>
		</fieldset>
		<?php
	}

	public function save( $contact_form ) {
		if ( ! $contact_form instanceof \WPCF7_ContactForm ) {
			return;
		}
		$form_id = (int) $contact_form->id();
		if ( $form_id <= 0 ) {
			return;
		}
		if ( ! current_user_can( 'wpcf7_edit_contact_form', $form_id ) ) {
			return;
		}
		if ( empty( $_POST[ self::NONCE_NAME ] ) || ! wp_verify_nonce(
			sanitize_text_field( wp_unslash( $_POST[ self::NONCE_NAME ] ) ),
			self::NONCE_ACTION
		) ) {
			return;
		}

		$enabled = ! empty( $_POST['cf7m_partial_save_enabled'] ) ? '1' : '0';
		update_post_meta( $form_id, self::META_KEY, $enabled );
	}

	public static function is_enabled_for_form( int $form_id ): bool {
		return get_post_meta( $form_id, self::META_KEY, true ) === '1';
	}
}
