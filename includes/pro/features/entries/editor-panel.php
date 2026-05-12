<?php
/**
 * CF7 Mate panel inside the CF7 form editor – per-form Save Responses toggle.
 *
 * @package CF7_Mate\Features\Entries
 */

namespace CF7_Mate\Features\Entries;

if (!defined('ABSPATH')) {
    exit;
}

class Entries_Editor_Panel
{
    const NONCE_ACTION = 'cf7m_save_to_db';
    const NONCE_NAME   = 'cf7m_save_to_db_nonce';
    const FIELD_NAME   = 'cf7m_save_to_db';

    public function __construct()
    {
        add_filter('wpcf7_editor_panels', [$this, 'register_panel']);
        add_action('wpcf7_save_contact_form', [$this, 'save'], 10, 1);
    }

    /**
     * Register a "CF7 Mate" tab in the form editor.
     */
    public function register_panel($panels)
    {
        $panels['cf7m-panel'] = [
            'title'    => __('CF7 Mate', 'cf7-styler-for-divi'),
            'callback' => [$this, 'render_panel'],
        ];
        return $panels;
    }

    /**
     * Render the panel UI.
     *
     * @param \WPCF7_ContactForm $contact_form
     */
    public function render_panel($contact_form)
    {
        $form_id = $contact_form ? (int) $contact_form->id() : 0;
        $enabled = $form_id ? Entries_Save::is_enabled_for_form($form_id) : true;
        ?>
        <h2><?php esc_html_e('CF7 Mate', 'cf7-styler-for-divi'); ?></h2>

        <fieldset>
            <legend><?php esc_html_e('Responses', 'cf7-styler-for-divi'); ?></legend>

            <?php wp_nonce_field(self::NONCE_ACTION, self::NONCE_NAME); ?>

            <p>
                <label>
                    <input
                        type="checkbox"
                        name="<?php echo esc_attr(self::FIELD_NAME); ?>"
                        value="1"
                        <?php checked($enabled); ?>
                    />
                    <?php esc_html_e('Save submissions of this form to the database.', 'cf7-styler-for-divi'); ?>
                </label>
            </p>

            <p class="description">
                <?php esc_html_e('When enabled, every submission is stored and viewable from CF7 Mate → Responses. Disable for forms you don\'t want to log (e.g. search, login).', 'cf7-styler-for-divi'); ?>
            </p>
        </fieldset>

        <?php do_action( 'cf7m_editor_panel_sections', $contact_form ); ?>
        <?php
    }

    /**
     * Persist the toggle on form save.
     *
     * @param \WPCF7_ContactForm $contact_form
     */
    public function save($contact_form)
    {
        if (! $contact_form instanceof \WPCF7_ContactForm) {
            return;
        }

        $form_id = (int) $contact_form->id();
        if ($form_id <= 0) {
            return;
        }

        if (! current_user_can('wpcf7_edit_contact_form', $form_id)) {
            return;
        }

        // Require nonce; if absent, the panel wasn't submitted (e.g. CLI / programmatic save).
        if (empty($_POST[self::NONCE_NAME]) || ! wp_verify_nonce(
            sanitize_text_field(wp_unslash($_POST[self::NONCE_NAME])),
            self::NONCE_ACTION
        )) {
            return;
        }

        $enabled = ! empty($_POST[self::FIELD_NAME]);
        update_post_meta($form_id, Entries_Save::PER_FORM_META_KEY, $enabled ? '1' : '0');
    }
}
