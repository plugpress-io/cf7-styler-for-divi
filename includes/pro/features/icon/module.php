<?php
namespace CF7_Mate\Features\Icon;

use CF7_Mate\Pro\Pro_Feature_Base;
use CF7_Mate\Pro\Traits\Shortcode_Atts_Trait;
use CF7_Mate\Pro\Traits\Singleton;

if (!defined('ABSPATH')) {
    exit;
}

class Icon extends Pro_Feature_Base
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
        add_action('wp_enqueue_scripts', [$this, 'enqueue_dashicons']);
    }

    /**
     * Ensure Dashicons are enqueued only on frontend pages that have a CF7 form.
     */
    public function enqueue_dashicons()
    {
        global $post;
        if (!$post || !is_singular() || !has_shortcode($post->post_content, 'contact-form-7')) {
            return;
        }
        wp_enqueue_style('dashicons');
    }

    /**
     * Process [cf7m-icon] shortcode.
     *
     * @param string $form Form content.
     * @return string
     */
    public function process_shortcodes($form)
    {
        if (strpos($form, '[cf7m-icon') === false) {
            return $form;
        }

        return preg_replace_callback(
            '/\[cf7m-icon\s*([^\]]*)\]/',
            [$this, 'render_icon'],
            $form
        );
    }

    /**
     * @param array $matches
     * @return string
     */
    public function render_icon($matches)
    {
        $atts = $this->parse_atts(isset($matches[1]) ? $matches[1] : '');
        $name = isset($atts['name']) ? sanitize_text_field($atts['name']) : 'dashicons-star-filled';
        $size = isset($atts['size']) ? absint($atts['size']) : 24;
        if ($size < 8 || $size > 96) {
            $size = 24;
        }
        // Allow only dashicons-* for security.
        if (strpos($name, 'dashicons-') !== 0) {
            $name = 'dashicons-star-filled';
        }
        $class = 'cf7m-icon dashicons ' . esc_attr($name);
        $style = sprintf('font-size: %dpx; width: %dpx; height: %dpx;', $size, $size, $size);
        return sprintf('<span class="%s" style="%s" aria-hidden="true"></span>', esc_attr($class), esc_attr($style));
    }

    public function add_tag_generators()
    {
        if (!class_exists('WPCF7_TagGenerator')) {
            return;
        }
        $tg = \WPCF7_TagGenerator::get_instance();
        $tg->add('cf7m-icon', __('icon', 'cf7-styler-for-divi'), [$this, 'tag_generator']);
    }

    /** @param \WPCF7_ContactForm $contact_form */
    public function tag_generator($contact_form, $options = '')
    {
        ?>
        <div class="cf7m-tag-panel">
        <div class="control-box">
            <fieldset>
                <legend><?php esc_html_e('Icon', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table"><tbody>
                    <tr>
                        <th scope="row"><label><?php esc_html_e('Dashicon name', 'cf7-styler-for-divi'); ?></label></th>
                        <td>
                            <input type="text" name="name" class="oneline" value="dashicons-star-filled" placeholder="dashicons-star-filled" />
                            <p class="description"><?php esc_html_e('Use Dashicons class (e.g. dashicons-email, dashicons-phone)', 'cf7-styler-for-divi'); ?></p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label><?php esc_html_e('Size (px)', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="number" name="size" class="oneline" value="24" min="8" max="96" /></td>
                    </tr>
                </tbody></table>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-icon" class="tag code" readonly="readonly" onfocus="this.select()" value="[cf7m-icon name:dashicons-star-filled size:24]" />
            <div class="submitbox"><input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'contact-form-7'); ?>" /></div>
        </div>
        </div>
        <?php
    }
}
