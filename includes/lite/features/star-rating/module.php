<?php

namespace CF7_Mate\Lite\Features\Star_Rating;

use CF7_Mate\Lite\Feature_Base;
use CF7_Mate\Lite\Traits\Shortcode_Atts_Trait;
use CF7_Mate\Lite\Traits\Singleton;

if (!defined('ABSPATH')) {
    exit;
}

class Star_Rating extends Feature_Base
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

    public function process_shortcodes($form)
    {
        if (strpos($form, '[cf7m-star') === false) {
            return $form;
        }

        // Match: [cf7m-star name max:5 default:0] or [cf7m-star* name max:5]
        $form = preg_replace_callback(
            '/\[cf7m-star\*?\s+([^\]]+)\]/',
            [$this, 'render_star_rating'],
            $form
        );

        return $form;
    }

    public function render_star_rating($matches)
    {
        $raw_atts = trim($matches[1]);
        $is_required = strpos($matches[0], '[cf7m-star*') === 0;

        // Parse attributes: first word is name, rest are key:value pairs
        $parts = preg_split('/\s+/', $raw_atts);
        $name = !empty($parts[0]) ? sanitize_key($parts[0]) : 'rating';

        $max = 5;
        $default = 0;
        $color = '';

        for ($i = 1; $i < count($parts); $i++) {
            $part = $parts[$i];
            if (strpos($part, 'max:') === 0) {
                $max = (int) substr($part, 4);
            } elseif (strpos($part, 'default:') === 0) {
                $default = (int) substr($part, 8);
            } elseif (strpos($part, 'color:') === 0) {
                $color = substr($part, 6);
            }
        }

        $max = max(1, min(10, $max));
        $default = max(0, min($default, $max));
        $color = $this->sanitize_color($color);

        // Build star SVG
        $star_svg = '<svg class="cf7m-star-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

        // Style attribute for custom color
        $style = '';
        if ($color !== '') {
            $style = ' style="--cf7m-star-on:' . esc_attr($color) . ';--cf7m-star-hover:' . esc_attr($color) . ';"';
        }

        // Build HTML
        $required_attr = $is_required ? ' data-required="true"' : '';

        $html = sprintf(
            '<span class="wpcf7-form-control-wrap wpcf7-form-control-wrap-%1$s" data-name="%1$s">',
            esc_attr($name)
        );
        $html .= sprintf(
            '<span class="cf7m-star-rating" data-max="%d" data-value="%d" data-name="%s"%s%s role="group" aria-label="%s">',
            $max,
            $default,
            esc_attr($name),
            $required_attr,
            $style,
            esc_attr__('Star rating', 'cf7-styler-for-divi')
        );
        $html .= sprintf(
            '<input type="hidden" name="%s" value="%d" class="cf7m-star-input" data-cf7m-star-input>',
            esc_attr($name),
            $default
        );

        for ($i = 1; $i <= $max; $i++) {
            $active = $i <= $default ? ' cf7m-star--on' : '';
            $html .= sprintf(
                '<button type="button" class="cf7m-star%s" data-value="%d" aria-label="%s">%s</button>',
                $active,
                $i,
                /* translators: %d: star rating number (e.g. 1, 2, 3) */
                sprintf(esc_attr__('Rate %d star', 'cf7-styler-for-divi'), $i),
                $star_svg
            );
        }

        $html .= '</span></span>';

        return $html;
    }

    private function sanitize_color($value)
    {
        $value = trim((string) $value);
        if (preg_match('/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/', $value)) {
            return $value;
        }
        return '';
    }

    public function add_tag_generators()
    {
        if (class_exists('WPCF7_TagGenerator')) {
            \WPCF7_TagGenerator::get_instance()->add(
                'cf7m-star',
                __('star rating', 'cf7-styler-for-divi'),
                [$this, 'tag_generator_callback'],
                ['version' => '2']
            );
        }
    }

    public function tag_generator_callback($contact_form, $options = '')
    {
?>
        <div class="control-box">
            <fieldset>
                <legend><?php esc_html_e('Star Rating', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table">
                    <tbody>
                        <tr>
                            <th><?php esc_html_e('Field type', 'cf7-styler-for-divi'); ?></th>
                            <td><label><input type="checkbox" name="required" id="cf7m-star-required"> <?php esc_html_e('Required', 'cf7-styler-for-divi'); ?></label></td>
                        </tr>
                        <tr>
                            <th><label for="cf7m-star-name"><?php esc_html_e('Name', 'cf7-styler-for-divi'); ?></label></th>
                            <td><input type="text" name="name" id="cf7m-star-name" class="tg-name oneline" placeholder="rating"></td>
                        </tr>
                        <tr>
                            <th><label for="cf7m-star-max"><?php esc_html_e('Max Stars', 'cf7-styler-for-divi'); ?></label></th>
                            <td><input type="number" name="max" id="cf7m-star-max" class="oneline" value="5" min="1" max="10"></td>
                        </tr>
                        <tr>
                            <th><label for="cf7m-star-default"><?php esc_html_e('Default Value', 'cf7-styler-for-divi'); ?></label></th>
                            <td><input type="number" name="default" id="cf7m-star-default" class="oneline" value="0" min="0"></td>
                        </tr>
                        <tr>
                            <th><label for="cf7m-star-color"><?php esc_html_e('Star Color', 'cf7-styler-for-divi'); ?></label></th>
                            <td><input type="text" name="color" id="cf7m-star-color" class="oneline" placeholder="#f59e0b"></td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-star" class="tag code" readonly="readonly" onfocus="this.select()" value="[cf7m-star rating max:5 default:0]">
            <div class="submitbox">
                <input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'cf7-styler-for-divi'); ?>">
            </div>
        </div>
<?php
    }

    /**
     * Enqueue star rating front-end assets.
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
            'cf7m-star-rating',
            CF7M_PLUGIN_URL . 'assets/lite/js/cf7m-star-rating.js',
            [],
            $version,
            true
        );
    }
}
