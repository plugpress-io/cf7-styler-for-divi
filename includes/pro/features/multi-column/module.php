<?php
/**
 * Multi-Column Forms Module.
 * Supports: [cf7m-row gap:20]...[/cf7m-row] and [cf7m-col width:50]...[/cf7m-col]
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

    protected function __construct()
    {
        parent::__construct();
    }

    protected function init()
    {
        add_filter('wpcf7_form_elements', [$this, 'process_shortcodes'], 15, 1);
        add_action('wpcf7_admin_init', [$this, 'add_tag_generators'], 25);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend_styles'], 20);
    }

    /**
     * Enqueue Pro multi-column styles.
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

        // Process rows first
        $form = preg_replace_callback(
            '/\[cf7m-row\s*([^\]]*)\](.*?)\[\/cf7m-row\]/s',
            [$this, 'process_row_shortcode'],
            $form
        );

        // Then columns
        $form = preg_replace_callback(
            '/\[cf7m-col\s*([^\]]*)\](.*?)\[\/cf7m-col\]/s',
            [$this, 'process_col_shortcode'],
            $form
        );

        // Clean up empty paragraphs and extra line breaks
        $form = preg_replace('/<p>\s*<\/p>/', '', $form);
        $form = preg_replace('/<br\s*\/?>\s*<br\s*\/?>/', '', $form);

        return $form;
    }

    /**
     * Parse [cf7m-row gap:20] or [cf7m-row gap="20"]
     *
     * @param array $matches
     * @return string
     */
    public function process_row_shortcode($matches)
    {
        $raw = isset($matches[1]) ? trim($matches[1]) : '';
        $content = isset($matches[2]) ? $matches[2] : '';

        // Default gap
        $gap = 16;

        // Parse gap:20 or gap="20" or gap=20
        if (preg_match('/gap[=:]"?(\d+)"?/', $raw, $m)) {
            $gap = (int) $m[1];
        }

        return sprintf(
            '<div class="cf7m-pro-row" style="--cf7m-row-gap:%dpx;">%s</div>',
            $gap,
            $content
        );
    }

    /**
     * Parse [cf7m-col width:50] or [cf7m-col width="50%"]
     *
     * @param array $matches
     * @return string
     */
    public function process_col_shortcode($matches)
    {
        $raw = isset($matches[1]) ? trim($matches[1]) : '';
        $content = isset($matches[2]) ? $matches[2] : '';

        // Default width
        $width = '50%';

        // Parse width:50 or width:50% or width="50%" or width="50"
        if (preg_match('/width[=:]"?(\d+(?:\.\d+)?%?)"?/', $raw, $m)) {
            $width = $m[1];
            // Add % if not present
            if (strpos($width, '%') === false) {
                $width .= '%';
            }
        }

        return sprintf(
            '<div class="cf7m-pro-col" style="--cf7m-col-width:%s;">%s</div>',
            esc_attr($width),
            $content
        );
    }

    /**
     * Register CF7 tag generators.
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

    public function tag_generator_row($contact_form, $options = '')
    {
        ?>
        <div class="control-box">
            <fieldset>
                <legend><?php esc_html_e('Multi-Column Row', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table"><tbody>
                    <tr>
                        <th><label for="cf7m-row-gap"><?php esc_html_e('Gap (px)', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="number" id="cf7m-row-gap" name="gap" class="oneline" value="20" min="0"></td>
                    </tr>
                </tbody></table>
                <p class="description"><?php esc_html_e('Place [cf7m-col] tags inside this row.', 'cf7-styler-for-divi'); ?></p>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-row" class="tag code" readonly="readonly" onfocus="this.select()" value="[cf7m-row gap:20]

[/cf7m-row]">
            <div class="submitbox">
                <input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'contact-form-7'); ?>">
            </div>
        </div>
        <?php
    }

    public function tag_generator_col($contact_form, $options = '')
    {
        ?>
        <div class="control-box">
            <fieldset>
                <legend><?php esc_html_e('Column', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table"><tbody>
                    <tr>
                        <th><label for="cf7m-col-width"><?php esc_html_e('Width', 'cf7-styler-for-divi'); ?></label></th>
                        <td>
                            <select id="cf7m-col-width" name="width" class="oneline">
                                <option value="25">25%</option>
                                <option value="33.33">33.33%</option>
                                <option value="50" selected>50%</option>
                                <option value="66.66">66.66%</option>
                                <option value="75">75%</option>
                                <option value="100">100%</option>
                            </select>
                        </td>
                    </tr>
                </tbody></table>
                <p class="description"><?php esc_html_e('Place your fields inside this column.', 'cf7-styler-for-divi'); ?></p>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-col" class="tag code" readonly="readonly" onfocus="this.select()" value="[cf7m-col width:50]

[/cf7m-col]">
            <div class="submitbox">
                <input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'contact-form-7'); ?>">
            </div>
        </div>
        <?php
    }
}
