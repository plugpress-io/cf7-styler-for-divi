<?php

/**
 * Pro features loader. Excluded from free via @fs_premium_only.
 *
 * @package CF7_Mate
 * @since 3.0.0
 */

namespace CF7_Mate;

if (!defined('ABSPATH')) {
    exit;
}

class Premium_Loader
{
    private static $instance = null;

    private static $defaults = [
        'multi_column'      => true,
        'multi_step'        => true,
        'database_entries'  => true,
        'phone_number'      => true,
        'heading'           => true,
        'calculator'        => true,
        'conditional'       => true,
        'ai_form_generator' => true,
        'presets'           => true,
        'webhook'           => true,
    ];

    private static $features = [
        'multi_column'    => [
            'file'  => 'multi-column/module.php',
            'class' => 'CF7_Mate\Features\Multi_Column\Multi_Column',
        ],
        'multi_step'      => [
            'file'  => 'multi-steps/module.php',
            'class' => 'CF7_Mate\Features\Multi_Steps\Multi_Steps',
        ],
        'database_entries' => [
            'file'  => 'entries/module.php',
            'class' => 'CF7_Mate\Features\Entries\Entries',
        ],
        'phone_number'   => [
            'file'  => 'phone-number/module.php',
            'class' => 'CF7_Mate\Features\Phone_Number\Phone_Number',
        ],
        'heading'         => [
            'file'  => 'heading/module.php',
            'class' => 'CF7_Mate\Features\Heading\Heading',
        ],
        'calculator'      => [
            'file'  => 'calculator/module.php',
            'class' => 'CF7_Mate\Features\Calculator\Calculator',
        ],
        'conditional'     => [
            'file'  => 'conditional/module.php',
            'class' => 'CF7_Mate\Features\Conditional\Conditional',
        ],
        'ai_form_generator' => [
            'file'  => 'ai-form-generator/module.php',
            'class' => 'CF7_Mate\Features\AI_Form_Generator\AI_Form_Generator',
        ],
        'presets'           => [
            'file'  => 'presets/module.php',
            'class' => 'CF7_Mate\Features\Presets\Presets',
        ],
        'webhook'           => [
            'file'  => 'webhook/module.php',
            'class' => 'CF7_Mate\Features\Webhook\Webhook',
        ],
    ];

    public static function instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        // Allow dev mode bypass for testing (define CF7M_DEV_MODE in wp-config.php).
        $dev_mode = defined('CF7M_DEV_MODE') && \CF7M_DEV_MODE;

        if (! $dev_mode && (! function_exists('cf7m_can_use_premium') || ! cf7m_can_use_premium())) {
            return;
        }

        $this->load_bootstrap();
        $this->load_features();

        // Enqueue tag generator scripts for CF7 admin.
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);

        // Enqueue pro admin app bundle on CF7 Mate admin pages.
        add_action('cf7m_admin_enqueue_scripts', [$this, 'enqueue_admin_app_scripts']);
    }

    public function enqueue_admin_scripts($hook)
    {
        // Only load on CF7 edit pages.
        if ('toplevel_page_wpcf7' !== $hook && 'contact_page_wpcf7-new' !== $hook) {
            return;
        }

        $version = defined('CF7M_VERSION') ? CF7M_VERSION : '3.0.0';

        wp_enqueue_script(
            'cf7m-tag-generators',
            CF7M_PLUGIN_URL . 'assets/pro/js/cf7m-tag-generators.js',
            [],
            $version,
            true
        );
    }

    public function enqueue_admin_app_scripts()
    {
        $path = CF7M_PLUGIN_PATH . 'dist/js/admin-pro.js';
        if (! file_exists($path)) {
            return;
        }

        wp_enqueue_script(
            'cf7m-admin-pro',
            CF7M_PLUGIN_URL . 'dist/js/admin-pro.js',
            ['cf7m-admin'],
            CF7M_VERSION,
            true
        );
    }

    private function load_bootstrap()
    {
        $base = CF7M_PLUGIN_PATH . 'includes/pro/';

        $files = [
            'Traits/singleton.php',
            'Traits/shortcode-atts.php',
            'feature-base.php',
            'form-tag-feature.php',
        ];

        foreach ($files as $file) {
            $path = $base . $file;
            if (file_exists($path)) {
                require_once $path;
            }
        }
    }

    private function load_features()
    {
        $saved    = get_option('cf7m_features', []);
        $features = wp_parse_args($saved, self::$defaults);
        $path     = CF7M_PLUGIN_PATH . 'includes/pro/features/';

        foreach (self::$features as $key => $config) {
            if (empty($features[$key])) {
                continue;
            }

            $file_path = $path . $config['file'];
            if (!file_exists($file_path)) {
                continue;
            }

            require_once $file_path;

            if (class_exists($config['class']) && method_exists($config['class'], 'instance')) {
                $config['class']::instance();
            }
        }
    }

    public static function is_feature_enabled($feature)
    {
        // Allow dev mode bypass for testing.
        $dev_mode = defined('CF7M_DEV_MODE') && \CF7M_DEV_MODE;

        if (! $dev_mode && (! function_exists('cf7m_can_use_premium') || ! cf7m_can_use_premium())) {
            return false;
        }

        $saved    = get_option('cf7m_features', []);
        $features = wp_parse_args($saved, self::$defaults);

        return isset($features[$feature]) ? (bool) $features[$feature] : false;
    }

    public static function get_all_features()
    {
        $saved = get_option('cf7m_features', []);
        return wp_parse_args($saved, self::$defaults);
    }
}

Premium_Loader::instance();
