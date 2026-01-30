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

        $min     = (int) ($tag->get_option('min', 'int', true) ?? 0);
        $max     = (int) ($tag->get_option('max', 'int', true) ?? 100);
        $step    = (int) ($tag->get_option('step', 'int', true) ?: 1);
        $default = (int) ($tag->get_option('default', 'int', true) ?? $min);
        $prefix  = (string) ($tag->get_option('prefix', '', true) ?: '');
        $suffix  = (string) ($tag->get_option('suffix', '', true) ?: '');

        $html = sprintf(
            '<span class="wpcf7-form-control-wrap %1$s" data-name="%2$s">',
            sanitize_html_class($tag->name),
            esc_attr($tag->name)
        );
        $html .= sprintf(
            '<span class="dcs-range-slider" data-prefix="%1$s" data-suffix="%2$s">',
            esc_attr($prefix),
            esc_attr($suffix)
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

    /** @inheritdoc */
    public function validate_field($result, $tag)
    {
        $value = isset($_POST[$tag->name]) ? sanitize_text_field(wp_unslash($_POST[$tag->name])) : '';
        if ($tag->is_required() && '' === $value) {
            $result->invalidate($tag, wpcf7_get_message('invalid_required'));
        }
        return $result;
    }

    /** @inheritdoc */
    public function tag_generator_callback($contact_form, $options = ''): void
    {
        ?>
        <div class="control-box">
            <fieldset>
                <legend><?php esc_html_e('Range Slider', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table"><tbody>
                    <tr><th><?php esc_html_e('Field type', 'cf7-styler-for-divi'); ?></th><td><label><input type="checkbox" name="required" /> <?php esc_html_e('Required', 'cf7-styler-for-divi'); ?></label></td></tr>
                    <tr><th><label><?php esc_html_e('Name', 'cf7-styler-for-divi'); ?></label></th><td><input type="text" name="name" class="tg-name oneline" /></td></tr>
                    <tr><th><label><?php esc_html_e('Min', 'cf7-styler-for-divi'); ?></label></th><td><input type="number" name="min" class="oneline option" value="0" /></td></tr>
                    <tr><th><label><?php esc_html_e('Max', 'cf7-styler-for-divi'); ?></label></th><td><input type="number" name="max" class="oneline option" value="100" /></td></tr>
                    <tr><th><label><?php esc_html_e('Step', 'cf7-styler-for-divi'); ?></label></th><td><input type="number" name="step" class="oneline option" value="1" /></td></tr>
                    <tr><th><label><?php esc_html_e('Default', 'cf7-styler-for-divi'); ?></label></th><td><input type="number" name="default" class="oneline option" value="50" /></td></tr>
                    <tr><th><label><?php esc_html_e('Prefix', 'cf7-styler-for-divi'); ?></label></th><td><input type="text" name="prefix" class="oneline option" placeholder="$" /></td></tr>
                    <tr><th><label><?php esc_html_e('Suffix', 'cf7-styler-for-divi'); ?></label></th><td><input type="text" name="suffix" class="oneline option" placeholder="%" /></td></tr>
                </tbody></table>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-range" class="tag code" readonly="readonly" onfocus="this.select()" />
            <div class="submitbox"><input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'contact-form-7'); ?>" /></div>
        </div>
        <?php
    }

    /** @inheritdoc */
    public function enqueue_assets(): void
    {
        if (!$this->has_cf7_form_on_page()) {
            return;
        }

        wp_register_style('cf7m-range-slider', false);
        wp_enqueue_style('cf7m-range-slider');
        wp_add_inline_style('cf7m-range-slider', '.dcs-range-slider{display:flex;align-items:center;gap:12px}.cf7m-range-input{flex:1;height:8px;-webkit-appearance:none;background:#e5e7eb;border-radius:4px}.cf7m-range-input::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#5733ff;cursor:pointer}.dcs-range-value{min-width:50px;padding:6px 12px;background:#f3f4f6;border-radius:4px;text-align:center}');

        wp_register_script('cf7m-range-slider', false, [], false, true);
        wp_enqueue_script('cf7m-range-slider');
        wp_add_inline_script('cf7m-range-slider', "(function(){document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('.dcs-range-slider').forEach(function(c){if(c.dataset.init)return;c.dataset.init='1';var input=c.querySelector('.cf7m-range-input'),display=c.querySelector('.dcs-range-value'),prefix=c.dataset.prefix||'',suffix=c.dataset.suffix||'';function update(){display.textContent=prefix+input.value+suffix}input.oninput=update;update()})})})();");
    }
}
