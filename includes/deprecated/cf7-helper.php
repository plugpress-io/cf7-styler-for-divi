<?php

namespace TorqueFormsStyler;

class CF7_Helper
{

    private static $instance;

    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * The plugin slug.
     *
     * @var string
     */
    public $plugin_slug = 'cf7-styler-for-divi';

    /**
     * Constructor function.
     */
    public function __construct()
    {
        $this->initialize_tag_generator();
        $this->initialize_shortcodes();
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
    }

    /**
     *  Enqueue admin scripts
     *
     * @return void
     */
    public function enqueue_admin_scripts()
    {

        $mj = file_get_contents(TFS_PLUGIN_PATH . 'assets/mix-manifest.json');
        $mj = json_decode($mj, true);

        wp_enqueue_script('tfs-admin-js', TFS_PLUGIN_URL . 'assets' . $mj['/js/cf7-util.js'], ['jquery'], TFS_VERSION, true);
    }

    /**
     * Initializes tag generator actions.
     */
    private function initialize_tag_generator()
    {
        add_action('wpcf7_admin_init', array($this, 'tag_generator'), 15);
    }

    /**
     * Initializes shortcodes and related filters.
     */
    private function initialize_shortcodes()
    {
        add_filter('wpcf7_autop_or_not', '__return_false');
        add_filter('wpcf7_form_elements', 'do_shortcode');

        $shortcodes = array(
            'dipe_row'          => 'row_render',
            'dipe_one'          => 'one_col_render',
            'dipe_one_half'     => 'one_half_col_render',
            'dipe_one_third'    => 'one_third_col_render',
            'dipe_one_fourth'   => 'one_fourth_col_render',
            'dipe_two_third'    => 'two_third_col_render',
            'dipe_three_fourth' => 'three_fourth_col_render'
        );

        foreach ($shortcodes as $shortcode => $callback) {
            add_shortcode($shortcode, array($this, $callback));
        }
    }

    /**
     * Tag generator method.
     */
    public function tag_generator()
    {
        $tag_generator = \WPCF7_TagGenerator::get_instance();
        $callback      = 'jj';

        $tags = array(
            'dipe_row'          => __('row', 'torque-forms-styler'),
            'dipe_one'          => __('1-col', 'torque-forms-styler'),
            'dipe_one_half'     => __('1/2-col', 'torque-forms-styler'),
            'dipe_one_third'    => __('1/3-col', 'torque-forms-styler'),
            'dipe_one_fourth'   => __('1/4-col', 'torque-forms-styler'),
            'dipe_two_third'    => __('2/3-col', 'torque-forms-styler'),
            'dipe_three_fourth' => __('3/4-col', 'torque-forms-styler')
        );

        foreach ($tags as $tag => $label) {
            $tag_generator->add($tag, $label, $callback, $this->plugin_slug);
        }
    }

    /**
     * Renders row.
     *
     * @param array       $attrs   Shortcode attributes.
     * @param string|null $content Inner content of the shortcode.
     *
     * @return string The rendered HTML string.
     */
    public function row_render($attrs, $content = null)
    {
        return $this->render_shortcode(
            'tfs-row',
            $attrs,
            $content
        );
    }

    public function one_col_render($attrs, $content = null)
    {
        return $this->render_shortcode(
            'tfs-col tfs-col-12',
            $attrs,
            $content
        );
    }

    public function one_half_col_render($attrs, $content = null)
    {
        return $this->render_shortcode(
            'tfs-col tfs-col-12 tfs-col-md-6 tfs-col-lg-6',
            $attrs,
            $content
        );
    }

    public function one_third_col_render($attrs, $content = null)
    {
        return $this->render_shortcode(
            'tfs-col tfs-col-12 tfs-col-md-4 tfs-col-lg-4',
            $attrs,
            $content
        );
    }

    public function one_fourth_col_render($attrs, $content = null)
    {
        return $this->render_shortcode(
            'tfs-col tfs-col-12 tfs-col-md-3 tfs-col-lg-3',
            $attrs,
            $content
        );
    }

    public function two_third_col_render($attrs, $content = null)
    {
        return $this->render_shortcode(
            'tfs-col tfs-col-12 tfs-col-md-8 tfs-col-lg-8',
            $attrs,
            $content
        );
    }

    public function three_fourth_col_render($attrs, $content = null)
    {
        return $this->render_shortcode(
            'tfs-col tfs-col-12 tfs-col-md-9 tfs-col-lg-9',
            $attrs,
            $content
        );
    }

    /**
     * Common method for rendering shortcodes.
     *
     * @param string      $class   CSS class for the wrapping div.
     * @param array       $attrs   Shortcode attributes.
     * @param string|null $content Inner content of the shortcode.
     *
     * @return string The rendered HTML string.
     */
    private function render_shortcode($class, $attrs, $content)
    {
        $attrs = shortcode_atts(array(), $attrs);

        return sprintf(
            '<div class="%s">%s</div>',
            esc_attr($class),
            do_shortcode($content)
        );
    }
}
