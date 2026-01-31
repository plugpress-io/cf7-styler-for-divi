<?php

/**
 * Heading Module – H1–H6 headings in CF7 forms.
 *
 * @package CF7_Mate\Features\Heading
 * @since 3.0.0
 */

namespace CF7_Mate\Features\Heading;

use CF7_Mate\Pro\Pro_Feature_Base;
use CF7_Mate\Pro\Traits\Shortcode_Atts_Trait;
use CF7_Mate\Pro\Traits\Singleton;

if (!defined('ABSPATH')) {
    exit;
}

class Heading extends Pro_Feature_Base
{
    use Shortcode_Atts_Trait;
    use Singleton;

    /** @inheritdoc */
    protected function __construct()
    {
        parent::__construct();
    }

    /** @inheritdoc */
    protected function init()
    {
        add_filter('wpcf7_form_elements', [$this, 'process_shortcodes'], 10, 1);
        add_action('wpcf7_admin_init', [$this, 'add_tag_generators'], 25);
    }

    /**
     * Process [cf7m-heading] shortcode.
     *
     * @param string $form Form content.
     * @return string
     */
    public function process_shortcodes($form)
    {
        if (strpos($form, '[cf7m-heading') === false) {
            return $form;
        }

        return preg_replace_callback(
            '/\[cf7m-heading\s*([^\]]*)\](.*?)\[\/cf7m-heading\]/s',
            [$this, 'render_heading'],
            $form
        );
    }

    /**
     * @param array $matches
     * @return string
     */
    public function render_heading($matches)
    {
        $atts   = $this->parse_atts(isset($matches[1]) ? $matches[1] : '');
        $content = isset($matches[2]) ? trim($matches[2]) : '';
        $level  = isset($atts['level']) ? absint($atts['level']) : 3;
        if ($level < 1 || $level > 6) {
            $level = 3;
        }
        $tag   = 'h' . $level;
        $class = 'cf7m-heading';

        $style_parts = [];
        if (!empty($atts['font_size'])) {
            $style_parts[] = 'font-size:' . esc_attr(wp_strip_all_tags(trim($atts['font_size'])));
        }
        if (!empty($atts['font_family'])) {
            $style_parts[] = 'font-family:' . esc_attr(wp_strip_all_tags($atts['font_family']));
        }
        if (!empty($atts['text_color']) && $this->is_valid_color($atts['text_color'])) {
            $style_parts[] = 'color:' . esc_attr(trim($atts['text_color']));
        }
        $style_attr = !empty($style_parts) ? ' style="' . implode(';', $style_parts) . '"' : '';

        return sprintf('<%1$s class="%2$s"%3$s>%4$s</%1$s>', $tag, esc_attr($class), $style_attr, wp_kses_post($content));
    }

    /**
     * Check if value is a valid CSS color (hex or rgb/rgba).
     *
     * @param string $value Raw value.
     * @return bool
     */
    private function is_valid_color($value)
    {
        $value = trim($value);
        return (bool) preg_match('/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/', $value)
            || preg_match('/^rgb\(|^rgba\(/', $value);
    }

    public function add_tag_generators()
    {
        if (!class_exists('WPCF7_TagGenerator')) {
            return;
        }
        $tg = \WPCF7_TagGenerator::get_instance();
        $tg->add('cf7m-heading', __('heading', 'cf7-styler-for-divi'), [$this, 'tag_generator']);
    }

    /** @param \WPCF7_ContactForm $contact_form */
    public function tag_generator($contact_form, $options = '')
    {
        ?>
        <div class="cf7m-tag-panel">
        <div class="control-box">
            <fieldset>
                <legend><?php esc_html_e('Heading', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table">
                    <tbody>
                        <tr>
                            <th scope="row"><label><?php esc_html_e('Level', 'cf7-styler-for-divi'); ?></label></th>
                            <td>
                                <select name="level" class="oneline">
                                    <?php for ($i = 1; $i <= 6; $i++) : ?>
                                        <option value="<?php echo (int) $i; ?>" <?php selected($i, 3); ?>><?php echo 'H' . $i; ?></option>
                                    <?php endfor; ?>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label><?php esc_html_e('Text', 'cf7-styler-for-divi'); ?></label></th>
                            <td><input type="text" name="content" class="oneline" placeholder="<?php esc_attr_e('Your heading text', 'cf7-styler-for-divi'); ?>" /></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="cf7m-heading-font-size"><?php esc_html_e('Font size', 'cf7-styler-for-divi'); ?></label></th>
                            <td><input type="text" id="cf7m-heading-font-size" name="font_size" class="oneline option" placeholder="e.g. 24px" /></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="cf7m-heading-font-family"><?php esc_html_e('Font family', 'cf7-styler-for-divi'); ?></label></th>
                            <td><input type="text" id="cf7m-heading-font-family" name="font_family" class="oneline option" placeholder="e.g. Arial, sans-serif" /></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="cf7m-heading-text-color"><?php esc_html_e('Text color', 'cf7-styler-for-divi'); ?></label></th>
                            <td><input type="text" id="cf7m-heading-text-color" name="text_color" class="oneline option cf7m-color-input" placeholder="#333" /></td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-heading" class="tag code" readonly="readonly" onfocus="this.select()" value="[cf7m-heading level:3]Your heading[/cf7m-heading]" />
            <div class="submitbox"><input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'contact-form-7'); ?>" /></div>
        </div>
        </div>
        <?php
    }
}
