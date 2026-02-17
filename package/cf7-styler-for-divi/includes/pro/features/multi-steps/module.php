<?php
/**
 * Multi-Step Forms Module.
 *
 * @package CF7_Mate\Features\Multi_Steps
 * @since 3.0.0
 */

namespace CF7_Mate\Features\Multi_Steps;

use CF7_Mate\Pro\Pro_Feature_Base;
use CF7_Mate\Pro\Traits\Shortcode_Atts_Trait;
use CF7_Mate\Pro\Traits\Singleton;

if (!defined('ABSPATH')) {
    exit;
}

class Multi_Steps extends Pro_Feature_Base
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
        add_filter('wpcf7_form_elements', [$this, 'process_shortcodes'], 20, 1);
        add_action('wpcf7_admin_init', [$this, 'add_tag_generators'], 25);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    /**
     * Process [cf7m-step] shortcodes in form markup.
     *
     * @param string $form
     * @return string
     */
    public function process_shortcodes($form)
    {
        if (strpos($form, '[cf7m-step') === false) {
            return $form;
        }

        $step_count = 0;

        $form = preg_replace_callback('/\[cf7m-step\s*([^\]]*)\](.*?)\[\/cf7m-step\]/s', function ($matches) use (&$step_count) {
            $step_count++;
            $atts  = $this->parse_atts($matches[1]);
            $title = isset($atts['title']) ? $atts['title'] : sprintf(__('Step %d', 'cf7-styler-for-divi'), $step_count);
            
            // Important: Don't escape or modify the inner content - let CF7 process nested tags
            $inner_content = $matches[2];
            
            return sprintf(
                '<div class="cf7m-step %s" data-step="%d" data-title="%s">%s</div>',
                $step_count === 1 ? 'active' : '',
                $step_count,
                esc_attr($title),
                $inner_content
            );
        }, $form);

        if ($step_count > 0) {
            $progress = '<div class="cf7m-steps-progress">';
            for ($i = 1; $i <= $step_count; $i++) {
                $progress .= sprintf(
                    '<span class="cf7m-progress-step %s" data-step="%d">%d</span>',
                    $i === 1 ? 'active' : '',
                    $i,
                    $i
                );
            }
            $progress .= '</div>';

            $nav  = '<div class="cf7m-steps-nav">';
            $nav .= '<button type="button" class="cf7m-prev-step" style="display:none;">' . esc_html__('Previous', 'cf7-styler-for-divi') . '</button>';
            $nav .= '<button type="button" class="cf7m-next-step">' . esc_html__('Next', 'cf7-styler-for-divi') . '</button>';
            $nav .= '</div>';

            $form = sprintf(
                '<div class="cf7m-multistep-form" data-total-steps="%d">%s<div class="cf7m-steps-container">%s</div>%s</div>',
                $step_count,
                $progress,
                $form,
                $nav
            );
        }

        return $form;
    }

    /**
     * Register CF7 tag generators for [cf7m-step].
     */
    public function add_tag_generators()
    {
        if (class_exists('WPCF7_TagGenerator')) {
            \WPCF7_TagGenerator::get_instance()->add(
                'cf7m-step',
                __('step', 'cf7-styler-for-divi'),
                [$this, 'tag_generator_step'],
                ['version' => '2']
            );
        }
    }

    /**
     * Tag generator callback for [cf7m-step].
     *
     * @param \WPCF7_ContactForm $contact_form
     * @param string $options
     */
    public function tag_generator_step($contact_form, $options = '')
    {
        ?>
        <div class="control-box">
            <fieldset>
                <legend><?php esc_html_e('Multi-Step', 'cf7-styler-for-divi'); ?></legend>
                <table class="form-table"><tbody>
                    <tr><th><label><?php esc_html_e('Step Title', 'cf7-styler-for-divi'); ?></label></th><td><input type="text" name="title" class="oneline" placeholder="Step 1" /></td></tr>
                </tbody></table>
            </fieldset>
        </div>
        <div class="insert-box">
            <input type="text" name="cf7m-step" class="tag code" readonly="readonly" onfocus="this.select()" />
            <div class="submitbox"><input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'contact-form-7'); ?>" /></div>
        </div>
        <?php
    }

    /**
     * Enqueue multi-step front-end assets.
     */
    public function enqueue_assets()
    {
        if (!Pro_Feature_Base::page_has_cf7_form()) {
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
            'cf7m-multi-steps',
            CF7M_PLUGIN_URL . 'assets/pro/js/cf7m-multi-steps.js',
            [],
            $version,
            true
        );
    }
}
