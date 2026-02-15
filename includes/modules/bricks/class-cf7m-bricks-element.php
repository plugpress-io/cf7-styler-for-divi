<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Bricks element: CF7 Styler – display and style Contact Form 7 forms.
 */
class CF7M_Bricks_Element extends \Bricks\Element {

    public $category = 'general';
    public $name     = 'cf7-styler';
    public $icon     = 'ti-email';
    public $css      = [];

    public function get_label() {
        return esc_html__('CF7 Styler', 'cf7-styler-for-divi');
    }

    public function set_controls() {
        $forms = cf7m_get_contact_forms();
        $this->controls['cf7_form_id'] = [
            'tab'         => 'content',
            'label'       => esc_html__('Select Form', 'cf7-styler-for-divi'),
            'type'        => 'select',
            'options'     => $forms,
            'default'     => '0',
            'pasteStyles' => false,
        ];
    }

    public function render() {
        $form_id = isset($this->settings['cf7_form_id']) ? (int) $this->settings['cf7_form_id'] : 0;

        if ($form_id <= 0) {
            if (isset($_GET['bricks'])) {
                echo '<div class="cf7m-bricks-placeholder">' . esc_html__('Please select a Contact Form 7 form.', 'cf7-styler-for-divi') . '</div>';
            }
            return;
        }

        $shortcode = do_shortcode(sprintf('[contact-form-7 id="%d"]', $form_id));
        echo '<div class="cf7m-bricks-element dipe-cf7 dipe-cf7-styler" ' . $this->render_attributes('_root') . '>';
        echo $shortcode; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CF7 shortcode output
        echo '</div>';
    }
}
