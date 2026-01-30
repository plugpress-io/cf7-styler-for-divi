<?php
/**
 * Separator Module – horizontal divider in CF7 forms.
 *
 * @package CF7_Mate\Features\Separator
 * @since 3.0.0
 */

namespace CF7_Mate\Features\Separator;

use CF7_Mate\Pro\Pro_Feature_Base;
use CF7_Mate\Pro\Traits\Shortcode_Atts_Trait;
use CF7_Mate\Pro\Traits\Singleton;

if (!defined('ABSPATH')) {
    exit;
}

class Separator extends Pro_Feature_Base
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
     * Process [cf7m-separator] shortcode.
     *
     * @param string $form Form content.
     * @return string
     */
    public function process_shortcodes($form)
    {
        if (strpos($form, '[cf7m-separator') === false) {
            return $form;
        }

        return preg_replace_callback(
            '/\[cf7m-separator\s*([^\]]*)\]/',
            [$this, 'render_separator'],
            $form
        );
    }

    /**
     * @param array $matches
     * @return string
     */
    public function render_separator($matches)
    {
        $atts = $this->parse_atts(isset($matches[1]) ? $matches[1] : '');
        $style = isset($atts['style']) ? sanitize_text_field($atts['style']) : 'line';
        $margin = isset($atts['margin']) ? absint($atts['margin']) : 16;
        $class = 'cf7m-separator cf7m-separator--' . esc_attr($style);
        $style_attr = sprintf('margin: %1$dpx 0;', $margin);
        if ($style === 'line') {
            $style_attr .= ' border: 0; border-top: 1px solid #ddd;';
        }
        return sprintf('<hr class="%s" style="%s" />', esc_attr($class), esc_attr($style_attr));
    }

    public function add_tag_generators()
    {
        if (!class_exists('WPCF7_TagGenerator')) {
            return;
        }
        $tg = \WPCF7_TagGenerator::get_instance();
        $tg->add('cf7m-separator', __('separator', 'cf7-styler-for-divi'), [$this, 'tag_generator']);
    }

    /** @param \WPCF7_ContactForm $contact_form */
    public function tag_generator($contact_form, $options = '')
    {
        ?>
        <div class="cf7m-tag-panel">
        <div class="control-box">
            <fieldset>
                <legend><?php esc_html_e('Separator', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table"><tbody>
                    <tr>
                        <th scope="row"><label><?php esc_html_e('Style', 'cf7-styler-for-divi'); ?></label></th>
                        <td>
                            <select name="style" class="oneline">
                                <option value="line"><?php esc_html_e('Line', 'cf7-styler-for-divi'); ?></option>
                                <option value="space"><?php esc_html_e('Space only', 'cf7-styler-for-divi'); ?></option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label><?php esc_html_e('Margin (px)', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="number" name="margin" class="oneline" value="16" min="0" /></td>
                    </tr>
                </tbody></table>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-separator" class="tag code" readonly="readonly" onfocus="this.select()" value="[cf7m-separator style:line margin:16]" />
            <div class="submitbox"><input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'contact-form-7'); ?>" /></div>
        </div>
        </div>
        <?php
    }
}
