<?php
/**
 * Range Slider Field Module.
 *
 * @package CF7_Mate\Features\Range_Slider
 * @since 3.0.0
 */

namespace CF7_Mate\Features\Range_Slider;

use CF7_Mate\Pro\CF7_Form_Tag_Feature;
use CF7_Mate\Pro\Traits\Singleton;

if (!defined('ABSPATH')) {
    exit;
}

class Range_Slider extends CF7_Form_Tag_Feature
{
    use Singleton;

    /** @inheritdoc */
    protected function __construct()
    {
        parent::__construct();
    }

    /** @inheritdoc */
    protected function get_form_tag_names(): array
    {
        return ['cf7m-range', 'cf7m-range*'];
    }

    /** @inheritdoc */
    protected function get_tag_generator_id(): string
    {
        return 'cf7m-range';
    }

    /** @inheritdoc */
    protected function get_tag_generator_title(): string
    {
        return __('range slider', 'cf7-styler-for-divi');
    }

    /** @inheritdoc */
    public function render_form_tag($tag): string
    {
        if (empty($tag->name)) {
            return '';
        }

        $min          = (int) ($tag->get_option('min', 'int', true) ?? 0);
        $max          = (int) ($tag->get_option('max', 'int', true) ?? 100);
        $step         = (int) ($tag->get_option('step', 'int', true) ?: 1);
        $default      = (int) ($tag->get_option('default', 'int', true) ?? $min);
        $prefix       = (string) ($tag->get_option('prefix', '', true) ?: '');
        $suffix       = (string) ($tag->get_option('suffix', '', true) ?: '');
        $track_color  = self::opt_string($tag->get_option('track_color', '', true));
        $thumb_color  = self::opt_string($tag->get_option('thumb_color', '', true));
        $track_color  = self::sanitize_color($track_color);
        $thumb_color  = self::sanitize_color($thumb_color);

        $style_parts = [];
        if ($track_color !== '') {
            $style_parts[] = '--cf7m-range-track:' . esc_attr($track_color);
        }
        if ($thumb_color !== '') {
            $style_parts[] = '--cf7m-range-thumb:' . esc_attr($thumb_color);
        }
        $style_attr = !empty($style_parts) ? ' style="' . implode(';', $style_parts) . '"' : '';

        $html = sprintf(
            '<span class="wpcf7-form-control-wrap %1$s" data-name="%2$s">',
            sanitize_html_class($tag->name),
            esc_attr($tag->name)
        );
        $html .= sprintf(
            '<span class="dcs-range-slider" data-prefix="%1$s" data-suffix="%2$s"%3$s>',
            esc_attr($prefix),
            esc_attr($suffix),
            $style_attr
        );
        $html .= sprintf(
            '<input type="range" name="%1$s" min="%2$s" max="%3$s" step="%4$s" value="%5$s" class="cf7m-range-input" />',
            esc_attr($tag->name),
            $min,
            $max,
            $step,
            $default
        );
        $html .= sprintf('<span class="dcs-range-value">%s</span>', esc_html($prefix . $default . $suffix));
        $html .= '</span></span>';

        return $html;
    }

    /**
     * Get single string from tag option (may be array).
     *
     * @param mixed $opt Option value.
     * @return string
     */
    private static function opt_string($opt)
    {
        return is_array($opt) ? (string) reset($opt) : (string) $opt;
    }

    /**
     * Sanitize a value for use as CSS color.
     *
     * @param string $value Raw value.
     * @return string Empty if invalid.
     */
    private static function sanitize_color($value)
    {
        $value = trim($value);
        if (preg_match('/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/', $value)) {
            return $value;
        }
        if (preg_match('/^rgb\(|^rgba\(/', $value)) {
            return wp_strip_all_tags($value);
        }
        return '';
    }

    /** @inheritdoc */
    public function validate_field($result, $tag)
    {
        $value = isset($_POST[$tag->name]) ? sanitize_text_field(wp_unslash($_POST[$tag->name])) : '';
        if ($tag->is_required() && '' === $value) {
            $result->invalidate($tag, \wpcf7_get_message('invalid_required'));
        }
        return $result;
    }

    /** @inheritdoc */
    public function tag_generator_callback($contact_form, $options = ''): void
    {
        $default_tag = '[cf7m-range amount min:0 max:100 step:1 default:50]';
        ?>
        <div class="cf7m-tag-panel">
        <div class="control-box">
            <fieldset>
                <legend><?php esc_html_e('Range Slider', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table"><tbody>
                    <tr><th><?php esc_html_e('Field type', 'cf7-styler-for-divi'); ?></th><td><label><input type="checkbox" name="required" /> <?php esc_html_e('Required', 'cf7-styler-for-divi'); ?></label></td></tr>
                    <tr><th><label><?php esc_html_e('Name', 'cf7-styler-for-divi'); ?></label></th><td><input type="text" name="name" class="tg-name oneline" placeholder="amount" /></td></tr>
                    <tr><th><label><?php esc_html_e('Min', 'cf7-styler-for-divi'); ?></label></th><td><input type="number" name="min" class="oneline option" value="0" /></td></tr>
                    <tr><th><label><?php esc_html_e('Max', 'cf7-styler-for-divi'); ?></label></th><td><input type="number" name="max" class="oneline option" value="100" /></td></tr>
                    <tr><th><label><?php esc_html_e('Step', 'cf7-styler-for-divi'); ?></label></th><td><input type="number" name="step" class="oneline option" value="1" /></td></tr>
                    <tr><th><label><?php esc_html_e('Default', 'cf7-styler-for-divi'); ?></label></th><td><input type="number" name="default" class="oneline option" value="50" /></td></tr>
                    <tr><th><label><?php esc_html_e('Prefix', 'cf7-styler-for-divi'); ?></label></th><td><input type="text" name="prefix" class="oneline option" placeholder="$" /></td></tr>
                    <tr><th><label><?php esc_html_e('Suffix', 'cf7-styler-for-divi'); ?></label></th><td><input type="text" name="suffix" class="oneline option" placeholder="%" /></td></tr>
                    <tr><th><label for="cf7m-range-track"><?php esc_html_e('Track color', 'cf7-styler-for-divi'); ?></label></th><td><input type="text" id="cf7m-range-track" name="track_color" class="oneline option cf7m-color-input" placeholder="#e5e7eb" /></td></tr>
                    <tr><th><label for="cf7m-range-thumb"><?php esc_html_e('Thumb color', 'cf7-styler-for-divi'); ?></label></th><td><input type="text" id="cf7m-range-thumb" name="thumb_color" class="oneline option cf7m-color-input" placeholder="#5733ff" /></td></tr>
                </tbody></table>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-range" class="tag code" readonly="readonly" onfocus="this.select()" value="<?php echo esc_attr($default_tag); ?>" />
            <div class="submitbox"><input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'contact-form-7'); ?>" /></div>
        </div>
        </div>
        <?php
    }

    /** @inheritdoc */
    public function enqueue_assets(): void
    {
        if (!$this->has_cf7_form_on_page()) {
            return;
        }

        $version = defined('CF7M_VERSION') ? CF7M_VERSION : '3.0.0';
        wp_enqueue_style(
            'cf7m-pro-forms',
            CF7M_PLUGIN_URL . 'assets/pro/css/cf7m-pro-forms.css',
            [],
            $version
        );
        wp_enqueue_script(
            'cf7m-range-slider',
            CF7M_PLUGIN_URL . 'assets/pro/js/cf7m-range-slider.js',
            [],
            $version,
            true
        );
    }
}
