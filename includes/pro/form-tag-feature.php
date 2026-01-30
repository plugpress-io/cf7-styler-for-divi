<?php
/**
 * Base class for CF7 form-tag Pro features (e.g. cf7m-star, cf7m-range).
 *
 * Registers form tag, tag generator, validation, and enqueue hooks.
 * Subclasses implement tag names, render, validation, and assets.
 *
 * @package CF7_Mate\Pro
 * @since 3.0.0
 */

namespace CF7_Mate\Pro;

if (!defined('ABSPATH')) {
    exit;
}

abstract class CF7_Form_Tag_Feature extends Pro_Feature_Base
{
    /**
     * Register CF7 form-tag hooks.
     */
    protected function init()
    {
        add_action('wpcf7_init', [$this, 'register_form_tag']);
        add_action('wpcf7_admin_init', [$this, 'add_tag_generator'], 25);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);

        foreach ($this->get_form_tag_names() as $tag_name) {
            add_filter('wpcf7_validate_' . $tag_name, [$this, 'validate_field'], 10, 2);
        }
    }

    /**
     * Form tag name(s) to register (e.g. ['cf7m-star', 'cf7m-star*']).
     *
     * @return string[]
     */
    abstract protected function get_form_tag_names(): array;

    /**
     * Tag generator ID for CF7 admin (e.g. 'cf7m-star').
     *
     * @return string
     */
    abstract protected function get_tag_generator_id(): string;

    /**
     * Tag generator title for CF7 admin.
     *
     * @return string
     */
    abstract protected function get_tag_generator_title(): string;

    /**
     * Register the form tag with CF7.
     */
    public function register_form_tag()
    {
        if (function_exists('wpcf7_add_form_tag')) {
            wpcf7_add_form_tag(
                $this->get_form_tag_names(),
                [$this, 'render_form_tag'],
                ['name-attr' => true]
            );
        }
    }

    /**
     * Add tag generator to CF7 admin.
     */
    public function add_tag_generator()
    {
        if (class_exists('WPCF7_TagGenerator')) {
            \WPCF7_TagGenerator::get_instance()->add(
                $this->get_tag_generator_id(),
                $this->get_tag_generator_title(),
                [$this, 'tag_generator_callback'],
                ['version' => '2']
            );
        }
    }

    /**
     * Render the form tag HTML.
     *
     * @param \WPCF7_FormTag $tag
     * @return string
     */
    abstract public function render_form_tag($tag): string;

    /**
     * Validate field on submit.
     *
     * @param \WPCF7_Validation $result
     * @param \WPCF7_FormTag $tag
     * @return \WPCF7_Validation
     */
    abstract public function validate_field($result, $tag);

    /**
     * Tag generator callback (CF7 admin UI).
     *
     * @param \WPCF7_ContactForm $contact_form
     * @param string $options
     */
    abstract public function tag_generator_callback($contact_form, $options = ''): void;

    /**
     * Enqueue front-end assets when form is present.
     */
    abstract public function enqueue_assets(): void;

    /**
     * Check if current request has a CF7 form (shortcode or Divi CF7 Styler module).
     *
     * @return bool
     */
    protected function has_cf7_form_on_page(): bool
    {
        return Pro_Feature_Base::page_has_cf7_form();
    }
}
