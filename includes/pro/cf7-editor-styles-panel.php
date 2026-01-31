<?php
/**
 * CF7 Form Editor: "CF7 Styler" panel. Pro styling defaults saved as post meta.
 *
 * @package CF7_Mate\Pro
 * @since 3.0.0
 */

namespace CF7_Mate\Pro;

if (!defined('ABSPATH')) {
    exit;
}

class CF7_Editor_Styles_Panel
{
    const META_KEY = 'cf7m_pro_styles';

    const DEFAULTS = [
        'star_color'          => '#ffc107',
        'range_track_color'   => '#e5e7eb',
        'range_thumb_color'   => '#5733ff',
        'heading_font_size'   => '',
        'heading_font_family' => '',
        'heading_text_color'  => '',
    ];

    public static function register()
    {
        add_filter('wpcf7_editor_panels', [__CLASS__, 'add_panel']);
        add_action('wpcf7_save_contact_form', [__CLASS__, 'save_panel'], 10, 1);
        add_action('save_post_wpcf7_contact_form', [__CLASS__, 'save_panel_on_save_post'], 10, 3);
        add_filter('wpcf7_form_class_attr', [__CLASS__, 'add_form_class'], 10, 2);
        add_filter('wpcf7_form_elements', [__CLASS__, 'inject_form_styles'], 10, 1);
    }

    public static function add_panel($panels)
    {
        $panels['cf7m-styles'] = [
            'title'    => __('CF7 Styler', 'cf7-styler-for-divi'),
            'callback' => [__CLASS__, 'render_panel'],
        ];
        return $panels;
    }

    public static function render_panel($contact_form)
    {
        $form_id = $contact_form->id();
        $meta = self::get_meta($form_id);
        $name_prefix = 'cf7m_pro_styles_';
        ?>
        <div class="cf7m-editor-panel">
            <p class="description" style="margin-bottom: 16px;">
                <?php esc_html_e('Default styles for Pro form tags (star rating, range slider, heading). Leave blank to use theme defaults.', 'cf7-styler-for-divi'); ?>
            </p>

            <fieldset class="cf7m-panel-section">
                <legend><?php esc_html_e('Star rating', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table" role="presentation">
                    <tbody>
                        <tr>
                            <th scope="row"><label for="cf7m_star_color"><?php esc_html_e('Star color', 'cf7-styler-for-divi'); ?></label></th>
                            <td>
                                <input type="text" id="cf7m_star_color" name="<?php echo esc_attr($name_prefix); ?>star_color" class="cf7m-color-input" value="<?php echo esc_attr($meta['star_color']); ?>" placeholder="#ffc107" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>

            <fieldset class="cf7m-panel-section">
                <legend><?php esc_html_e('Range slider', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table" role="presentation">
                    <tbody>
                        <tr>
                            <th scope="row"><label for="cf7m_range_track_color"><?php esc_html_e('Track color', 'cf7-styler-for-divi'); ?></label></th>
                            <td>
                                <input type="text" id="cf7m_range_track_color" name="<?php echo esc_attr($name_prefix); ?>range_track_color" class="cf7m-color-input" value="<?php echo esc_attr($meta['range_track_color']); ?>" placeholder="#e5e7eb" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="cf7m_range_thumb_color"><?php esc_html_e('Thumb color', 'cf7-styler-for-divi'); ?></label></th>
                            <td>
                                <input type="text" id="cf7m_range_thumb_color" name="<?php echo esc_attr($name_prefix); ?>range_thumb_color" class="cf7m-color-input" value="<?php echo esc_attr($meta['range_thumb_color']); ?>" placeholder="#5733ff" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>

            <fieldset class="cf7m-panel-section">
                <legend><?php esc_html_e('Heading', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table" role="presentation">
                    <tbody>
                        <tr>
                            <th scope="row"><label for="cf7m_heading_font_size"><?php esc_html_e('Font size', 'cf7-styler-for-divi'); ?></label></th>
                            <td>
                                <input type="text" id="cf7m_heading_font_size" name="<?php echo esc_attr($name_prefix); ?>heading_font_size" value="<?php echo esc_attr($meta['heading_font_size']); ?>" placeholder="e.g. 24px or 1.5em" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="cf7m_heading_font_family"><?php esc_html_e('Font family', 'cf7-styler-for-divi'); ?></label></th>
                            <td>
                                <input type="text" id="cf7m_heading_font_family" name="<?php echo esc_attr($name_prefix); ?>heading_font_family" value="<?php echo esc_attr($meta['heading_font_family']); ?>" placeholder="e.g. Arial, sans-serif" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="cf7m_heading_text_color"><?php esc_html_e('Text color', 'cf7-styler-for-divi'); ?></label></th>
                            <td>
                                <input type="text" id="cf7m_heading_text_color" name="<?php echo esc_attr($name_prefix); ?>heading_text_color" class="cf7m-color-input" value="<?php echo esc_attr($meta['heading_text_color']); ?>" placeholder="#333" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
        </div>
        <?php
    }

    public static function save_panel($contact_form)
    {
        if (!$contact_form instanceof \WPCF7_ContactForm) {
            return;
        }
        self::save_meta_from_post($contact_form->id());
    }

    public static function save_panel_on_save_post($post_id, $post, $update)
    {
        if (!$post_id || get_post_type($post_id) !== 'wpcf7_contact_form') {
            return;
        }
        self::save_meta_from_post($post_id);
    }

    private static function save_meta_from_post($form_id)
    {
        $prefix = 'cf7m_pro_styles_';
        $meta = [];
        $has_any = false;
        foreach (array_keys(self::DEFAULTS) as $key) {
            $input_name = $prefix . $key;
            if (!isset($_POST[$input_name]) || !is_string($_POST[$input_name])) {
                $meta[$key] = self::DEFAULTS[$key];
                continue;
            }
            $has_any = true;
            $value = sanitize_text_field(wp_unslash($_POST[$input_name]));
            $meta[$key] = $value !== '' ? $value : self::DEFAULTS[$key];
        }
        if ($form_id && $has_any) {
            update_post_meta((int) $form_id, self::META_KEY, $meta);
        }
    }

    public static function add_form_class($class, $contact_form = null)
    {
        if (!$contact_form || !$contact_form->id()) {
            return $class;
        }
        $meta = self::get_meta($contact_form->id());
        if (self::has_any_styles($meta)) {
            $class .= ' cf7m-has-pro-styles';
        }
        return $class;
    }

    public static function inject_form_styles($form_elements)
    {
        $contact_form = function_exists('WPCF7_ContactForm') ? \WPCF7_ContactForm::get_current() : null;
        if (!$contact_form || !$contact_form->id()) {
            return $form_elements;
        }

        $meta = self::get_meta($contact_form->id());
        if (!self::has_any_styles($meta)) {
            return $form_elements;
        }

        $rules = [];

        if (!empty($meta['star_color'])) {
            $color = self::sanitize_css_color($meta['star_color']);
            if ($color) {
                $rules[] = '.dcs-star-rating .dcs-star:hover, .dcs-star-rating .dcs-star.active { color: ' . $color . '; }';
            }
        }

        if (!empty($meta['range_track_color'])) {
            $color = self::sanitize_css_color($meta['range_track_color']);
            if ($color) {
                $rules[] = '.cf7m-range-input { background: ' . $color . '; }';
            }
        }

        if (!empty($meta['range_thumb_color'])) {
            $color = self::sanitize_css_color($meta['range_thumb_color']);
            if ($color) {
                $rules[] = '.cf7m-range-input::-webkit-slider-thumb { background: ' . $color . '; }';
                $rules[] = '.cf7m-range-input::-moz-range-thumb { background: ' . $color . '; }';
            }
        }

        if (!empty($meta['heading_font_size']) || !empty($meta['heading_font_family']) || !empty($meta['heading_text_color'])) {
            $parts = [];
            if (!empty($meta['heading_font_size'])) {
                $parts[] = 'font-size: ' . esc_attr(self::sanitize_css_length($meta['heading_font_size']));
            }
            if (!empty($meta['heading_font_family'])) {
                $parts[] = 'font-family: ' . esc_attr($meta['heading_font_family']);
            }
            if (!empty($meta['heading_text_color'])) {
                $color = self::sanitize_css_color($meta['heading_text_color']);
                if ($color) {
                    $parts[] = 'color: ' . $color;
                }
            }
            if (!empty($parts)) {
                $rules[] = '.cf7m-has-pro-styles .cf7m-heading { ' . implode('; ', $parts) . '; }';
            }
        }

        if (empty($rules)) {
            return $form_elements;
        }

        $style = '<style type="text/css" data-cf7m="pro-styles">' . "\n" . implode("\n", $rules) . "\n" . '</style>';
        return $style . "\n" . $form_elements;
    }

    public static function get_meta($form_id)
    {
        $raw = get_post_meta((int) $form_id, self::META_KEY, true);
        if (!is_array($raw)) {
            return self::DEFAULTS;
        }
        return wp_parse_args($raw, self::DEFAULTS);
    }

    private static function has_any_styles($meta)
    {
        foreach ($meta as $value) {
            if (is_string($value) && trim($value) !== '') {
                return true;
            }
        }
        return false;
    }

    private static function sanitize_css_color($value)
    {
        $value = trim($value);
        if (preg_match('/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/', $value)) {
            return $value;
        }
        if (preg_match('/^rgb\(/', $value) || preg_match('/^rgba\(/', $value)) {
            return wp_strip_all_tags($value);
        }
        return '';
    }

    private static function sanitize_css_length($value)
    {
        return wp_strip_all_tags(trim($value));
    }
}
