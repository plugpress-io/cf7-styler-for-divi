<?php
/**
 * Separator Module – horizontal divider in CF7 forms.
 * Supports: [cf7m-separator] or [cf7m-separator style:dashed color:#ccc]
 *
 * @package CF7_Mate\Lite\Features\Separator
 * @since 3.0.0
 */

namespace CF7_Mate\Lite\Features\Separator;

use CF7_Mate\Lite\Feature_Base;
use CF7_Mate\Lite\Traits\Shortcode_Atts_Trait;
use CF7_Mate\Lite\Traits\Singleton;

if (!defined('ABSPATH')) {
    exit;
}

class Separator extends Feature_Base
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
    }

    /**
     * Process [cf7m-separator] shortcode.
     *
     * @param string $form
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
     * Render separator.
     *
     * @param array $matches
     * @return string
     */
    public function render_separator($matches)
    {
        $raw = isset($matches[1]) ? trim($matches[1]) : '';

        // Defaults
        $style = 'solid';
        $color = '#e5e7eb';
        $margin = 20;
        $width = '1px';

        // Parse style:solid|dashed|dotted|double|space
        if (preg_match('/style[=:](\w+)/', $raw, $m)) {
            $valid_styles = ['solid', 'dashed', 'dotted', 'double', 'space', 'line'];
            $style = in_array($m[1], $valid_styles) ? $m[1] : 'solid';
            if ($style === 'line') $style = 'solid';
        }

        // Parse color:#xxx or color:#xxxxxx
        if (preg_match('/color[=:](#[A-Fa-f0-9]{3,6})/', $raw, $m)) {
            $color = $m[1];
        }

        // Parse margin:20 or margin:20px
        if (preg_match('/margin[=:](\d+)/', $raw, $m)) {
            $margin = (int) $m[1];
        }

        // Parse width:2px
        if (preg_match('/width[=:](\d+(?:px)?)/', $raw, $m)) {
            $width = is_numeric($m[1]) ? $m[1] . 'px' : $m[1];
        }

        $class = 'cf7m-separator cf7m-separator--' . esc_attr($style);

        if ($style === 'space') {
            // Just a spacer, no visible line
            return sprintf(
                '<div class="%s" style="height:%dpx;"></div>',
                esc_attr($class),
                $margin
            );
        }

        // Visible line
        $inline_style = sprintf(
            'border:0;border-top:%s %s %s;margin:%dpx 0;',
            esc_attr($width),
            esc_attr($style),
            esc_attr($color),
            $margin
        );

        return sprintf('<hr class="%s" style="%s">', esc_attr($class), esc_attr($inline_style));
    }

    public function add_tag_generators()
    {
        if (!class_exists('WPCF7_TagGenerator')) {
            return;
        }
        \WPCF7_TagGenerator::get_instance()->add(
            'cf7m-separator',
            __('separator', 'cf7-styler-for-divi'),
            [$this, 'tag_generator'],
            ['version' => '2']
        );
    }

    public function tag_generator($contact_form, $options = '')
    {
        ?>
        <div class="control-box">
            <fieldset>
                <legend><?php esc_html_e('Separator', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table"><tbody>
                    <tr>
                        <th><label for="cf7m-sep-style"><?php esc_html_e('Style', 'cf7-styler-for-divi'); ?></label></th>
                        <td>
                            <select id="cf7m-sep-style" name="style" class="oneline">
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                                <option value="double">Double</option>
                                <option value="space">Space only</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th><label for="cf7m-sep-color"><?php esc_html_e('Color', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="text" id="cf7m-sep-color" name="color" class="oneline" value="#e5e7eb" placeholder="#e5e7eb"></td>
                    </tr>
                    <tr>
                        <th><label for="cf7m-sep-margin"><?php esc_html_e('Margin (px)', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="number" id="cf7m-sep-margin" name="margin" class="oneline" value="20" min="0"></td>
                    </tr>
                </tbody></table>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-separator" class="tag code" readonly="readonly" onfocus="this.select()" value="[cf7m-separator]">
            <div class="submitbox">
                <input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'cf7-styler-for-divi'); ?>">
            </div>
        </div>
        <?php
    }
}
