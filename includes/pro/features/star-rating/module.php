<?php
/**
 * Star Rating form tag.
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

    protected function __construct()
    {
        parent::__construct();
    }

    protected function get_form_tag_names(): array
    {
        return ['cf7m-star', 'cf7m-star*'];
    }

    protected function get_tag_generator_id(): string
    {
        return 'cf7m-star';
    }

    protected function get_tag_generator_title(): string
    {
        return __('star rating', 'cf7-styler-for-divi');
    }

    public function render_form_tag($tag): string
    {
        $name = trim((string) ($tag->name ?? ''));
        if ($name === '') {
            $name = 'rating';
        }

        $max       = self::opt_int($tag->get_option('max', 'int', true), 5);
        $max       = max(1, min(10, $max));
        $default   = self::opt_int($tag->get_option('default', 'int', true), 0);
        $default   = min(max(0, $default), $max);
        $star_color = $tag->get_option('star_color', '', true);
        $star_color = is_array($star_color) ? (string) reset($star_color) : (string) $star_color;
        $star_color = self::sanitize_color($star_color);

        $style_attr = $star_color !== '' ? ' style="color:' . esc_attr($star_color) . ';"' : '';

        $html = sprintf(
            '<span class="wpcf7-form-control-wrap %1$s" data-name="%2$s">',
            sanitize_html_class($name),
            esc_attr($name)
        );
        $html .= sprintf(
            '<span class="dcs-star-rating" data-max="%1$d" data-value="%2$d" data-name="%3$s"%4$s>',
            $max,
            $default,
            esc_attr($name),
            $style_attr
        );
        $html .= sprintf(
            '<input type="hidden" name="%1$s" value="%2$d" class="cf7m-star-rating-value" />',
            esc_attr($name),
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

    private static function opt_int($opt, $default = 0)
    {
        if (is_array($opt)) {
            $opt = reset($opt);
        }
        $v = is_numeric($opt) ? (int) $opt : $default;
        return $v;
    }

    private static function sanitize_color($value)
    {
        $value = trim((string) $value);
        if (preg_match('/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/', $value)) {
            return $value;
        }
        if (preg_match('/^rgb\(|^rgba\(/', $value)) {
            return wp_strip_all_tags($value);
        }
        return '';
    }

    public function validate_field($result, $tag)
    {
        $name  = trim((string) ($tag->name ?? ''));
        $name  = $name !== '' ? $name : 'rating';
        $value = isset($_POST[$name]) ? (int) $_POST[$name] : 0;
        if ($tag->is_required() && $value < 1) {
            $result->invalidate($tag, \wpcf7_get_message('invalid_required'));
        }
        return $result;
    }

    public function tag_generator_callback($contact_form, $options = ''): void
    {
        $default_tag = '[cf7m-star rating max:5 default:0]';
        ?>
        <div class="cf7m-tag-panel">
        <div class="control-box">
            <fieldset>
                <legend><?php esc_html_e('Star Rating', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table"><tbody>
                    <tr><th><?php esc_html_e('Field type', 'cf7-styler-for-divi'); ?></th><td><label><input type="checkbox" name="required" /> <?php esc_html_e('Required', 'cf7-styler-for-divi'); ?></label></td></tr>
                    <tr><th><label><?php esc_html_e('Name', 'cf7-styler-for-divi'); ?></label></th><td><input type="text" name="name" class="tg-name oneline" placeholder="rating" /></td></tr>
                    <tr><th><label><?php esc_html_e('Max Stars', 'cf7-styler-for-divi'); ?></label></th><td><input type="number" name="max" class="oneline option" value="5" min="1" max="10" /></td></tr>
                    <tr><th><label><?php esc_html_e('Default', 'cf7-styler-for-divi'); ?></label></th><td><input type="number" name="default" class="oneline option" value="0" min="0" /></td></tr>
                    <tr><th><label for="cf7m-star-color"><?php esc_html_e('Star color', 'cf7-styler-for-divi'); ?></label></th><td><input type="text" id="cf7m-star-color" name="star_color" class="oneline option cf7m-color-input" placeholder="#ffc107" /></td></tr>
                </tbody></table>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-star" class="tag code" readonly="readonly" onfocus="this.select()" value="<?php echo esc_attr($default_tag); ?>" />
            <div class="submitbox"><input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'contact-form-7'); ?>" /></div>
        </div>
        </div>
        <?php
    }

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
            'cf7m-star-rating',
            CF7M_PLUGIN_URL . 'assets/pro/js/cf7m-star-rating.js',
            [],
            $version,
            true
        );
    }
}
