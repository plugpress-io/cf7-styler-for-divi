<?php
/**
 * Range Slider Module.
 * Processes [cf7m-range] shortcodes in form markup (same pattern as multi-steps).
 *
 * @package CF7_Mate\Lite\Features\Range_Slider
 * @since 3.0.0
 */

namespace CF7_Mate\Lite\Features\Range_Slider;

use CF7_Mate\Lite\Feature_Base;
use CF7_Mate\Lite\Traits\Shortcode_Atts_Trait;
use CF7_Mate\Lite\Traits\Singleton;

if (!defined('ABSPATH')) {
    exit;
}

class Range_Slider extends Feature_Base
{
    use Shortcode_Atts_Trait;
    use Singleton;

    protected function __construct()
    {
        parent::__construct();
    }

    protected function init()
    {
        add_filter('wpcf7_form_elements', [$this, 'process_shortcodes'], 20, 1);
        add_action('wpcf7_admin_init', [$this, 'add_tag_generators'], 25);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    /**
     * Process [cf7m-range name min:0 max:100 step:1 default:50] shortcodes.
     *
     * @param string $form
     * @return string
     */
    public function process_shortcodes($form)
    {
        if (strpos($form, '[cf7m-range') === false) {
            return $form;
        }

        // Match: [cf7m-range name min:0 max:100] or [cf7m-range* name ...]
        $form = preg_replace_callback(
            '/\[cf7m-range\*?\s+([^\]]+)\]/',
            [$this, 'render_range_slider'],
            $form
        );

        return $form;
    }

    /**
     * Render a single range slider field.
     *
     * @param array $matches Regex matches
     * @return string HTML output
     */
    public function render_range_slider($matches)
    {
        $raw_atts = trim($matches[1]);
        $is_required = strpos($matches[0], '[cf7m-range*') === 0;

        // Parse attributes: first word is name, rest are key:value pairs
        $parts = preg_split('/\s+/', $raw_atts);
        $name = !empty($parts[0]) ? sanitize_key($parts[0]) : 'amount';

        $min = 0;
        $max = 100;
        $step = 1;
        $default = 50;
        $prefix = '';
        $suffix = '';
        $track_color = '';
        $thumb_color = '';

        for ($i = 1; $i < count($parts); $i++) {
            $part = $parts[$i];
            if (strpos($part, 'min:') === 0) {
                $min = (int) substr($part, 4);
            } elseif (strpos($part, 'max:') === 0) {
                $max = (int) substr($part, 4);
            } elseif (strpos($part, 'step:') === 0) {
                $step = (int) substr($part, 5);
            } elseif (strpos($part, 'default:') === 0) {
                $default = (int) substr($part, 8);
            } elseif (strpos($part, 'prefix:') === 0) {
                $prefix = substr($part, 7);
            } elseif (strpos($part, 'suffix:') === 0) {
                $suffix = substr($part, 7);
            } elseif (strpos($part, 'track:') === 0) {
                $track_color = substr($part, 6);
            } elseif (strpos($part, 'thumb:') === 0) {
                $thumb_color = substr($part, 6);
            }
        }

        $step = max(1, $step);
        $default = max($min, min($default, $max));
        $track_color = $this->sanitize_color($track_color);
        $thumb_color = $this->sanitize_color($thumb_color);

        // Build style attribute
        $style_parts = [];
        if ($track_color !== '') {
            $style_parts[] = '--cf7m-range-track:' . esc_attr($track_color);
        }
        if ($thumb_color !== '') {
            $style_parts[] = '--cf7m-range-thumb:' . esc_attr($thumb_color);
        }
        $style = !empty($style_parts) ? ' style="' . implode(';', $style_parts) . '"' : '';

        $required_attr = $is_required ? ' data-required="true"' : '';

        // Build HTML
        $html = sprintf(
            '<span class="wpcf7-form-control-wrap wpcf7-form-control-wrap-%1$s" data-name="%1$s">',
            esc_attr($name)
        );
        $html .= sprintf(
            '<span class="cf7m-range-slider" data-prefix="%s" data-suffix="%s" data-name="%s"%s%s>',
            esc_attr($prefix),
            esc_attr($suffix),
            esc_attr($name),
            $required_attr,
            $style
        );
        $html .= sprintf(
            '<input type="range" name="%s" min="%d" max="%d" step="%d" value="%d" class="cf7m-range-input">',
            esc_attr($name),
            $min,
            $max,
            $step,
            $default
        );
        $html .= sprintf(
            '<span class="cf7m-range-value">%s</span>',
            esc_html($prefix . $default . $suffix)
        );
        $html .= '</span></span>';

        return $html;
    }

    /**
     * Sanitize color value.
     *
     * @param string $value
     * @return string
     */
    private function sanitize_color($value)
    {
        $value = trim((string) $value);
        if (preg_match('/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/', $value)) {
            return $value;
        }
        return '';
    }

    /**
     * Register CF7 tag generator for [cf7m-range].
     */
    public function add_tag_generators()
    {
        if (class_exists('WPCF7_TagGenerator')) {
            \WPCF7_TagGenerator::get_instance()->add(
                'cf7m-range',
                __('range slider', 'cf7-styler-for-divi'),
                [$this, 'tag_generator_callback'],
                ['version' => '2']
            );
        }
    }

    /**
     * Tag generator callback for [cf7m-range].
     *
     * @param \WPCF7_ContactForm $contact_form
     * @param string $options
     */
    public function tag_generator_callback($contact_form, $options = '')
    {
        ?>
        <div class="control-box">
            <fieldset>
                <legend><?php esc_html_e('Range Slider', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table"><tbody>
                    <tr>
                        <th><?php esc_html_e('Field type', 'cf7-styler-for-divi'); ?></th>
                        <td><label><input type="checkbox" name="required" id="cf7m-range-required"> <?php esc_html_e('Required', 'cf7-styler-for-divi'); ?></label></td>
                    </tr>
                    <tr>
                        <th><label for="cf7m-range-name"><?php esc_html_e('Name', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="text" name="name" id="cf7m-range-name" class="tg-name oneline" placeholder="amount"></td>
                    </tr>
                    <tr>
                        <th><label for="cf7m-range-min"><?php esc_html_e('Min', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="number" name="min" id="cf7m-range-min" class="oneline" value="0"></td>
                    </tr>
                    <tr>
                        <th><label for="cf7m-range-max"><?php esc_html_e('Max', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="number" name="max" id="cf7m-range-max" class="oneline" value="100"></td>
                    </tr>
                    <tr>
                        <th><label for="cf7m-range-step"><?php esc_html_e('Step', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="number" name="step" id="cf7m-range-step" class="oneline" value="1" min="1"></td>
                    </tr>
                    <tr>
                        <th><label for="cf7m-range-default"><?php esc_html_e('Default Value', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="number" name="default" id="cf7m-range-default" class="oneline" value="50"></td>
                    </tr>
                    <tr>
                        <th><label for="cf7m-range-prefix"><?php esc_html_e('Prefix', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="text" name="prefix" id="cf7m-range-prefix" class="oneline" placeholder="$"></td>
                    </tr>
                    <tr>
                        <th><label for="cf7m-range-suffix"><?php esc_html_e('Suffix', 'cf7-styler-for-divi'); ?></label></th>
                        <td><input type="text" name="suffix" id="cf7m-range-suffix" class="oneline" placeholder="%"></td>
                    </tr>
                </tbody></table>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-range" class="tag code" readonly="readonly" onfocus="this.select()" value="[cf7m-range amount min:0 max:100 step:1 default:50]">
            <div class="submitbox">
                <input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'cf7-styler-for-divi'); ?>">
            </div>
        </div>
        <?php
    }

    /**
     * Enqueue range slider front-end assets.
     */
    public function enqueue_assets()
    {
        if (!Feature_Base::page_has_cf7_form()) {
            return;
        }

        $version = defined('CF7M_VERSION') ? CF7M_VERSION : '3.0.0';
        wp_enqueue_style(
            'cf7m-lite-forms',
            CF7M_PLUGIN_URL . 'assets/lite/css/cf7m-lite-forms.css',
            [],
            $version
        );
        wp_enqueue_script(
            'cf7m-range-slider',
            CF7M_PLUGIN_URL . 'assets/lite/js/cf7m-range-slider.js',
            [],
            $version,
            true
        );
    }
}
