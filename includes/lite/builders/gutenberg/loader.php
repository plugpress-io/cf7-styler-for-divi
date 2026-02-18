<?php

if (!defined('ABSPATH')) {
    exit;
}


add_action('init', 'cf7m_register_gutenberg_block', 11);
add_action('enqueue_block_editor_assets', 'cf7m_enqueue_gutenberg_editor_assets');

function cf7m_register_gutenberg_block()
{
    if (!function_exists('register_block_type')) {
        return;
    }

    // Load the render callback.
    require_once __DIR__ . '/gutenberg-block.php';

    $script_path = CF7M_PLUGIN_PATH . 'dist/js/gutenberg.js';

    if (!file_exists($script_path)) {
        return;
    }

    register_block_type('cf7-mate/cf7-styler', [
        'api_version'     => 2,
        'title'           => __('CF7 Styler', 'cf7-styler-for-divi'),
        'category'        => 'widgets',
        'icon'            => 'email-alt',
        'description'     => __('Display and style a Contact Form 7 form with full design controls.', 'cf7-styler-for-divi'),
        'keywords'        => ['contact form', 'cf7', 'form', 'styler'],
        'render_callback' => 'cf7m_gutenberg_render_callback',
        'attributes'      => cf7m_gutenberg_get_attributes(),
    ]);
}

function cf7m_enqueue_gutenberg_editor_assets()
{
    $script_path = CF7M_PLUGIN_PATH . 'dist/js/gutenberg.js';
    $style_path  = CF7M_PLUGIN_PATH . 'dist/css/gutenberg.css';

    if (!file_exists($script_path)) {
        return;
    }

    wp_enqueue_script(
        'cf7m-gutenberg-editor',
        CF7M_PLUGIN_URL . 'dist/js/gutenberg.js',
        ['wp-blocks', 'wp-block-editor', 'wp-components', 'wp-element', 'wp-i18n', 'wp-server-side-render'],
        CF7M_VERSION,
        true
    );

    // Pass CF7 forms list to the editor JS.
    $forms = [];
    if (function_exists('cf7m_get_contact_forms')) {
        $raw = cf7m_get_contact_forms();
        foreach ($raw as $id => $title) {
            $forms[] = [
                'value' => (string) $id,
                'label' => $title,
            ];
        }
    }
    wp_localize_script('cf7m-gutenberg-editor', 'cf7mGutenbergData', [
        'forms' => $forms,
    ]);

    if (file_exists($style_path)) {
        wp_enqueue_style(
            'cf7m-gutenberg-editor-style',
            CF7M_PLUGIN_URL . 'dist/css/gutenberg.css',
            [],
            CF7M_VERSION
        );
    }
}

function cf7m_gutenberg_get_attributes()
{
    return [
        // Content
        'blockId'            => ['type' => 'string',  'default' => ''],
        'formId'             => ['type' => 'integer', 'default' => 0],

        // Form Header
        'useFormHeader'      => ['type' => 'boolean', 'default' => false],
        'formHeaderTitle'    => ['type' => 'string',  'default' => ''],
        'formHeaderText'     => ['type' => 'string',  'default' => ''],
        'useIcon'            => ['type' => 'boolean', 'default' => false],
        'headerIconClass'    => ['type' => 'string',  'default' => ''],
        'headerImageUrl'     => ['type' => 'string',  'default' => ''],

        // Form Header Style
        'formHeaderBg'            => ['type' => 'string', 'default' => ''],
        'formHeaderPaddingTop'    => ['type' => 'string', 'default' => ''],
        'formHeaderPaddingRight'  => ['type' => 'string', 'default' => ''],
        'formHeaderPaddingBottom' => ['type' => 'string', 'default' => ''],
        'formHeaderPaddingLeft'   => ['type' => 'string', 'default' => ''],
        'formHeaderBottomSpacing' => ['type' => 'string', 'default' => ''],
        'formHeaderImgBg'         => ['type' => 'string', 'default' => ''],
        'formHeaderIconColor'     => ['type' => 'string', 'default' => ''],

        // Form Common
        'formBg'              => ['type' => 'string', 'default' => ''],
        'formPaddingTop'      => ['type' => 'string', 'default' => ''],
        'formPaddingRight'    => ['type' => 'string', 'default' => ''],
        'formPaddingBottom'   => ['type' => 'string', 'default' => ''],
        'formPaddingLeft'     => ['type' => 'string', 'default' => ''],
        'formBorderRadius'    => ['type' => 'string', 'default' => ''],
        'fullwidthButton'     => ['type' => 'boolean', 'default' => false],
        'buttonAlignment'     => ['type' => 'string',  'default' => 'left'],

        // Form Fields
        'fieldHeight'          => ['type' => 'string', 'default' => ''],
        'fieldPaddingTop'      => ['type' => 'string', 'default' => '10px'],
        'fieldPaddingRight'    => ['type' => 'string', 'default' => '15px'],
        'fieldPaddingBottom'   => ['type' => 'string', 'default' => '10px'],
        'fieldPaddingLeft'     => ['type' => 'string', 'default' => '15px'],
        'fieldBgColor'         => ['type' => 'string', 'default' => ''],
        'fieldTextColor'       => ['type' => 'string', 'default' => ''],
        'fieldFocusBorderColor' => ['type' => 'string', 'default' => ''],
        'fieldBorderWidth'     => ['type' => 'string', 'default' => ''],
        'fieldBorderStyle'     => ['type' => 'string', 'default' => 'solid'],
        'fieldBorderColor'     => ['type' => 'string', 'default' => ''],
        'fieldBorderRadius'    => ['type' => 'string', 'default' => ''],
        'fieldSpacing'         => ['type' => 'string', 'default' => '20px'],

        // Labels
        'labelColor'   => ['type' => 'string', 'default' => ''],
        'labelSpacing'  => ['type' => 'string', 'default' => '7px'],

        // Placeholder
        'placeholderColor' => ['type' => 'string', 'default' => ''],

        // Radio & Checkbox
        'crCustomStyles'  => ['type' => 'boolean', 'default' => false],
        'crSize'          => ['type' => 'string',  'default' => '20px'],
        'crBgColor'       => ['type' => 'string',  'default' => ''],
        'crSelectedColor' => ['type' => 'string',  'default' => '#222222'],
        'crBorderColor'   => ['type' => 'string',  'default' => '#222222'],
        'crBorderSize'    => ['type' => 'string',  'default' => '1px'],
        'crLabelColor'    => ['type' => 'string',  'default' => ''],

        // Button
        'buttonTextColor'      => ['type' => 'string', 'default' => ''],
        'buttonBgColor'        => ['type' => 'string', 'default' => ''],
        'buttonTextColorHover' => ['type' => 'string', 'default' => ''],
        'buttonBgColorHover'   => ['type' => 'string', 'default' => ''],
        'buttonBorderColorHover' => ['type' => 'string', 'default' => ''],
        'buttonPaddingTop'     => ['type' => 'string', 'default' => ''],
        'buttonPaddingRight'   => ['type' => 'string', 'default' => ''],
        'buttonPaddingBottom'  => ['type' => 'string', 'default' => ''],
        'buttonPaddingLeft'    => ['type' => 'string', 'default' => ''],
        'buttonBorderRadius'   => ['type' => 'string', 'default' => ''],

        // Messages (validation)
        'msgPadding'     => ['type' => 'string', 'default' => ''],
        'msgMarginTop'   => ['type' => 'string', 'default' => ''],
        'msgAlignment'   => ['type' => 'string', 'default' => 'left'],
        'msgColor'       => ['type' => 'string', 'default' => ''],
        'msgBgColor'     => ['type' => 'string', 'default' => ''],
        'msgBorderColor' => ['type' => 'string', 'default' => ''],

        // Success message
        'successMsgColor'   => ['type' => 'string', 'default' => ''],
        'successMsgBgColor' => ['type' => 'string', 'default' => ''],
        'successBorderColor' => ['type' => 'string', 'default' => ''],

        // Error message
        'errorMsgColor'   => ['type' => 'string', 'default' => ''],
        'errorMsgBgColor' => ['type' => 'string', 'default' => ''],
        'errorBorderColor' => ['type' => 'string', 'default' => ''],
    ];
}
