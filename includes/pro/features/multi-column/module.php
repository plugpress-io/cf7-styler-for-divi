<?php
/**
 * Multi-Column Forms Module.
 *
 * @package CF7_Mate\Features\Multi_Column
 * @since 3.0.0
 */

namespace CF7_Mate\Features\Multi_Column;

use CF7_Mate\Pro\Pro_Feature_Base;
use CF7_Mate\Pro\Traits\Shortcode_Atts_Trait;
use CF7_Mate\Pro\Traits\Singleton;

if (!defined('ABSPATH')) {
    exit;
}

class Multi_Column extends Pro_Feature_Base
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
        add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend_styles'], 20);
    }

    /**
     * Enqueue Pro multi-column styles only on frontend when a CF7 form is present.
     */
    public function enqueue_frontend_styles()
    {
        if (!Pro_Feature_Base::page_has_cf7_form()) {
            return;
        }

        wp_enqueue_style(
            'cf7m-pro-forms',
            CF7M_PLUGIN_URL . 'assets/pro/css/cf7m-pro-forms.css',
            [],
            defined('CF7M_VERSION') ? CF7M_VERSION : '3.0.0'
        );
    }

    /**
     * Process [cf7m-row] and [cf7m-col] shortcodes.
     *
     * @param string $form
     * @return string
     */
    public function process_shortcodes($form)
    {
        if (strpos($form, '[cf7m-row') === false && strpos($form, '[cf7m-col') === false) {
            return $form;
        }

        $form = preg_replace_callback(
            '/\[cf7m-row\s*([^\]]*)\](.*?)\[\/cf7m-row\]/s',
            [$this, 'process_row_shortcode'],
            $form
        );

        $form = preg_replace_callback(
            '/\[cf7m-col\s*([^\]]*)\](.*?)\[\/cf7m-col\]/s',
            [$this, 'process_col_shortcode'],
            $form
        );

        $form = preg_replace('/<p>\s*<\/p>/', '', $form);
        $form = preg_replace('/<br\s*\/?>\s*<br\s*\/?>/', '', $form);

        return $form;
    }

    /**
     * Replace [cf7m-row] with markup.
     *
     * @param array $matches
     * @return string
     */
    public function process_row_shortcode($matches)
    {
        $atts    = $this->parse_atts($matches[1]);
        $content = $matches[2];
        $gap     = isset($atts['gap']) ? absint($atts['gap']) : 16;
        return '<div class="cf7m-pro-row" style="--cf7m-row-gap: ' . $gap . 'px;">' . $content . '</div>';
    }

    /**
     * Replace [cf7m-col] with markup.
     *
     * @param array $matches
     * @return string
     */
    public function process_col_shortcode($matches)
    {
        $atts    = $this->parse_atts($matches[1]);
        $content = $matches[2];
        $width   = isset($atts['width']) ? $atts['width'] : '50%';
        if (!preg_match('/^\d+(\.\d+)?%$/', $width)) {
            $width = '50%';
        }
        return '<div class="cf7m-pro-col" style="--cf7m-col-width: ' . esc_attr($width) . ';">' . $content . '</div>';
    }

    /**
     * Register CF7 tag generators for row/col.
     */
    public function add_tag_generators()
    {
        if (!class_exists('WPCF7_TagGenerator')) {
            return;
        }
        $tg = \WPCF7_TagGenerator::get_instance();
        $tg->add('cf7m-row', __('row', 'cf7-styler-for-divi'), [$this, 'tag_generator_row']);
        $tg->add('cf7m-col', __('column', 'cf7-styler-for-divi'), [$this, 'tag_generator_col']);
    }

    /**
     * Tag generator callback for [cf7m-row].
     *
     * @param \WPCF7_ContactForm $contact_form
     * @param string $options
     */
    public function tag_generator_row($contact_form, $options = '')
    {
        ?>
        <div class="control-box">
            <fieldset>
                <legend><?php esc_html_e('Multi-Column Row', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table"><tbody>
                    <tr>
                        <th scope="row"><label><?php esc_html_e('Gap (px)', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="number" name="gap" class="oneline" value="16" min="0" /></td>
                    </tr>
                </tbody></table>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-row" class="tag code" readonly="readonly" onfocus="this.select()" value="<?php echo esc_attr('[cf7m-row gap="16"][/cf7m-row]'); ?>" />
            <div class="submitbox"><input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'contact-form-7'); ?>" /></div>
        </div>
        <?php
    }

    /**
     * Tag generator callback for [cf7m-col].
     *
     * @param \WPCF7_ContactForm $contact_form
     * @param string $options
     */
    public function tag_generator_col($contact_form, $options = '')
    {
        ?>
        <div class="control-box">
            <fieldset>
                <legend><?php esc_html_e('Multi-Column Column', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table"><tbody>
                    <tr>
                        <th scope="row"><label><?php esc_html_e('Width', 'cf7-styler-for-divi'); ?></label></th>
                        <td>
                            <select name="width" class="oneline">
                                <option value="25%">25%</option>
                                <option value="33.333%">33.333%</option>
                                <option value="50%" selected>50%</option>
                                <option value="66.666%">66.666%</option>
                                <option value="75%">75%</option>
                                <option value="100%">100%</option>
                            </select>
                        </td>
                    </tr>
                </tbody></table>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-col" class="tag code" readonly="readonly" onfocus="this.select()" value="<?php echo esc_attr('[cf7m-col width="50%"][/cf7m-col]'); ?>" />
            <div class="submitbox"><input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'contact-form-7'); ?>" /></div>
        </div>
        <?php
    }
}
