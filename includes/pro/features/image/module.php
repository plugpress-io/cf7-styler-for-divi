<?php
/**
 * Image Module – insert images into CF7 forms.
 *
 * @package CF7_Mate\Features\Image
 * @since 3.0.0
 */

namespace CF7_Mate\Features\Image;

use CF7_Mate\Pro\Pro_Feature_Base;
use CF7_Mate\Pro\Traits\Shortcode_Atts_Trait;
use CF7_Mate\Pro\Traits\Singleton;

if (!defined('ABSPATH')) {
    exit;
}

class Image extends Pro_Feature_Base
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
     * Process [cf7m-image] shortcode.
     *
     * @param string $form Form content.
     * @return string
     */
    public function process_shortcodes($form)
    {
        if (strpos($form, '[cf7m-image') === false) {
            return $form;
        }

        return preg_replace_callback(
            '/\[cf7m-image\s*([^\]]*)\]/',
            [$this, 'render_image'],
            $form
        );
    }

    /**
     * @param array $matches
     * @return string
     */
    public function render_image($matches)
    {
        $atts = $this->parse_atts(isset($matches[1]) ? $matches[1] : '');
        $src = isset($atts['src']) ? esc_url($atts['src']) : '';
        $alt = isset($atts['alt']) ? sanitize_text_field($atts['alt']) : '';
        $width = isset($atts['width']) ? absint($atts['width']) : 0;
        $height = isset($atts['height']) ? absint($atts['height']) : 0;
        $class = isset($atts['class']) ? sanitize_html_class($atts['class']) : 'cf7m-image';

        if (empty($src)) {
            return '';
        }

        $attr = ['src' => $src, 'alt' => $alt, 'class' => $class];
        if ($width > 0) {
            $attr['width'] = $width;
        }
        if ($height > 0) {
            $attr['height'] = $height;
        }

        $html = '<img ';
        foreach ($attr as $k => $v) {
            $html .= esc_attr($k) . '="' . esc_attr($v) . '" ';
        }
        $html .= '/>';

        return '<span class="cf7m-image-wrap">' . $html . '</span>';
    }

    public function add_tag_generators()
    {
        if (!class_exists('WPCF7_TagGenerator')) {
            return;
        }
        $tg = \WPCF7_TagGenerator::get_instance();
        $tg->add('cf7m-image', __('image', 'cf7-styler-for-divi'), [$this, 'tag_generator']);
    }

    /** @param \WPCF7_ContactForm $contact_form */
    public function tag_generator($contact_form, $options = '')
    {
        ?>
        <div class="cf7m-tag-panel">
        <div class="control-box">
            <fieldset>
                <legend><?php esc_html_e('Image', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table"><tbody>
                    <tr>
                        <th scope="row"><label><?php esc_html_e('Image URL', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="url" name="src" class="oneline" placeholder="https://" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><label><?php esc_html_e('Alt text', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="text" name="alt" class="oneline" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><label><?php esc_html_e('Width', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="number" name="width" class="oneline" value="0" min="0" /> px (0 = auto)</td>
                    </tr>
                    <tr>
                        <th scope="row"><label><?php esc_html_e('Height', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="number" name="height" class="oneline" value="0" min="0" /> px (0 = auto)</td>
                    </tr>
                </tbody></table>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-image" class="tag code" readonly="readonly" onfocus="this.select()" value="[cf7m-image src:url alt:text]" />
            <div class="submitbox"><input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'contact-form-7'); ?>" /></div>
        </div>
        </div>
        <?php
    }
}
