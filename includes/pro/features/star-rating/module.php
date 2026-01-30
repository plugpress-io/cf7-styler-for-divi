<?php
/**
 * Star Rating Field Module.
 *
 * @package CF7_Mate\Features\Star_Rating
 * @since 3.0.0
 */

namespace CF7_Mate\Features\Star_Rating;

use CF7_Mate\Pro\CF7_Form_Tag_Feature;
use CF7_Mate\Pro\Traits\Singleton;

if (!defined('ABSPATH')) {
    exit;
}

class Star_Rating extends CF7_Form_Tag_Feature
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
        return ['cf7m-star', 'cf7m-star*'];
    }

    /** @inheritdoc */
    protected function get_tag_generator_id(): string
    {
        return 'cf7m-star';
    }

    /** @inheritdoc */
    protected function get_tag_generator_title(): string
    {
        return __('star rating', 'cf7-styler-for-divi');
    }

    /** @inheritdoc */
    public function render_form_tag($tag): string
    {
        if (empty($tag->name)) {
            return '';
        }

        $max     = (int) $tag->get_option('max', 'int', true) ?: 5;
        $default = (int) $tag->get_option('default', 'int', true) ?: 0;
        $default = min($default, $max);

        $html = sprintf(
            '<span class="wpcf7-form-control-wrap %1$s" data-name="%2$s">',
            sanitize_html_class($tag->name),
            esc_attr($tag->name)
        );
        $html .= sprintf(
            '<span class="dcs-star-rating" data-max="%1$d" data-value="%2$d" data-name="%3$s">',
            $max,
            $default,
            esc_attr($tag->name)
        );
        $html .= sprintf(
            '<input type="hidden" name="%1$s" value="%2$d" class="cf7m-star-rating-value" />',
            esc_attr($tag->name),
            $default
        );

        $star_svg = '<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
        for ($i = 1; $i <= $max; $i++) {
            $html .= sprintf(
                '<span class="dcs-star %s" data-value="%d" role="button" tabindex="0">%s</span>',
                $i <= $default ? 'active' : '',
                $i,
                $star_svg
            );
        }

        $html .= '</span></span>';
        return $html;
    }

    /** @inheritdoc */
    public function validate_field($result, $tag)
    {
        $value = isset($_POST[$tag->name]) ? (int) $_POST[$tag->name] : 0;
        if ($tag->is_required() && $value < 1) {
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
                <legend><?php esc_html_e('Star Rating', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table"><tbody>
                    <tr><th><?php esc_html_e('Field type', 'cf7-styler-for-divi'); ?></th><td><label><input type="checkbox" name="required" /> <?php esc_html_e('Required', 'cf7-styler-for-divi'); ?></label></td></tr>
                    <tr><th><label><?php esc_html_e('Name', 'cf7-styler-for-divi'); ?></label></th><td><input type="text" name="name" class="tg-name oneline" /></td></tr>
                    <tr><th><label><?php esc_html_e('Max Stars', 'cf7-styler-for-divi'); ?></label></th><td><input type="number" name="max" class="oneline option" value="5" min="1" max="10" /></td></tr>
                    <tr><th><label><?php esc_html_e('Default', 'cf7-styler-for-divi'); ?></label></th><td><input type="number" name="default" class="oneline option" value="0" min="0" /></td></tr>
                </tbody></table>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-star" class="tag code" readonly="readonly" onfocus="this.select()" />
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

        wp_register_style('cf7m-star-rating', false);
        wp_enqueue_style('cf7m-star-rating');
        wp_add_inline_style('cf7m-star-rating', '.dcs-star-rating{display:inline-flex;gap:4px}.dcs-star{cursor:pointer;color:#ddd;transition:all .15s}.dcs-star:hover,.dcs-star.active{color:#ffc107}.dcs-star svg{width:24px;height:24px}');

        wp_register_script('cf7m-star-rating', false, [], false, true);
        wp_enqueue_script('cf7m-star-rating');
        wp_add_inline_script('cf7m-star-rating', "(function(){document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('.dcs-star-rating').forEach(function(c){if(c.dataset.init)return;c.dataset.init='1';var stars=c.querySelectorAll('.dcs-star'),input=c.querySelector('.cf7m-star-rating-value'),val=parseInt(c.dataset.value)||0;stars.forEach(function(s,i){s.onclick=function(){val=i+1;input.value=val;update()};s.onmouseenter=function(){highlight(i+1)}});c.onmouseleave=function(){highlight(val)};function highlight(n){stars.forEach(function(s,i){s.classList.toggle('active',i<n)})}function update(){highlight(val)}})})})();");
    }
}
