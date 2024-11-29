<?php

namespace Divi_Form_Styler;

use WPCF7_TagGenerator;

class CF7_Grid_Helper
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
        $this->initialize_shortcodes();
        $this->initialize_tag_generator();
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

        wp_enqueue_script('dfs-admin-js', TFS_PLUGIN_URL . 'assets' . $mj['/js/cf7-util.js'], ['jquery'], TFS_VERSION, true);
    }

    /**
     * Initializes tag generator actions.
     */
    private function initialize_tag_generator()
    {
        add_action('wpcf7_admin_init', array($this, 'add_row_tag_generator'), 99);
        add_action('wpcf7_admin_init', array($this, 'add_column_tag_generators'), 99);
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
     * Adds row tag generator
     */
    public function add_row_tag_generator()
    {
        if (!class_exists('WPCF7_TagGenerator')) {
            return;
        }

        $tag_generator = WPCF7_TagGenerator::get_instance();
        $tag_generator->add(
            'dipe_row',
            __('row', 'form-styler-for-divi'),
            array($this, 'tag_generator_panel'),
            array(
                'title' => __('row', 'form-styler-for-divi'),
                'description' => __('Generate a row shortcode', 'form-styler-for-divi'),
                'version' => '2'
            )
        );
    }

    /**
     * Adds column tag generators
     */
    public function add_column_tag_generators()
    {
        if (!class_exists('WPCF7_TagGenerator')) {
            return;
        }

        $tag_generator = WPCF7_TagGenerator::get_instance();

        $columns = array(
            'dipe_one' => array(
                'title' => __('1-col', 'form-styler-for-divi'),
                'description' => __('Generate a full width column', 'form-styler-for-divi')
            ),
            'dipe_one_half' => array(
                'title' => __('1/2-col', 'form-styler-for-divi'),
                'description' => __('Generate a half width column', 'form-styler-for-divi')
            ),
            'dipe_one_third' => array(
                'title' => __('1/3-col', 'form-styler-for-divi'),
                'description' => __('Generate a one-third width column', 'form-styler-for-divi')
            ),
            'dipe_one_fourth' => array(
                'title' => __('1/4-col', 'form-styler-for-divi'),
                'description' => __('Generate a one-fourth width column', 'form-styler-for-divi')
            ),
            'dipe_two_third' => array(
                'title' => __('2/3-col', 'form-styler-for-divi'),
                'description' => __('Generate a two-thirds width column', 'form-styler-for-divi')
            ),
            'dipe_three_fourth' => array(
                'title' => __('3/4-col', 'form-styler-for-divi'),
                'description' => __('Generate a three-fourths width column', 'form-styler-for-divi')
            )
        );

        foreach ($columns as $tag => $info) {
            $tag_generator->add(
                $tag,
                $info['title'],
                array($this, 'tag_generator_panel'),
                array(
                    'title' => $info['title'],
                    'description' => $info['description'],
                    'version' => '2'
                )
            );
        }
    }

    /**
     * Generates the panel content for the tag generator
     *
     * @param WPCF7_ContactForm $contact_form
     * @param array $args
     */
    public function tag_generator_panel($contact_form, $args = '')
    {
        $type = $args['id'];
        $tag = sprintf('[%s][/%s]', $type, $type);
?>
        <input type="text" class="tag code" readonly="readonly" onfocus="this.select()" value="<?php echo esc_attr($tag); ?>">

        <button class="button button-primary" onclick="insertGridShortcode('<?php echo esc_attr($type); ?>')">Insert</button>
<?php
    }

    public function row_render($attrs, $content = null)
    {
        return $this->render_shortcode(
            'dfs-row',
            $attrs,
            $content
        );
    }

    public function one_col_render($attrs, $content = null)
    {
        return $this->render_shortcode(
            'dfs-col dfs-col-12',
            $attrs,
            $content
        );
    }

    public function one_half_col_render($attrs, $content = null)
    {
        return $this->render_shortcode(
            'dfs-col dfs-col-12 dfs-col-md-6 dfs-col-lg-6',
            $attrs,
            $content
        );
    }

    public function one_third_col_render($attrs, $content = null)
    {
        return $this->render_shortcode(
            'dfs-col dfs-col-12 dfs-col-md-4 dfs-col-lg-4',
            $attrs,
            $content
        );
    }

    public function one_fourth_col_render($attrs, $content = null)
    {
        return $this->render_shortcode(
            'dfs-col dfs-col-12 dfs-col-md-3 dfs-col-lg-3',
            $attrs,
            $content
        );
    }

    public function two_third_col_render($attrs, $content = null)
    {
        return $this->render_shortcode(
            'dfs-col dfs-col-12 dfs-col-md-8 dfs-col-lg-8',
            $attrs,
            $content
        );
    }

    public function three_fourth_col_render($attrs, $content = null)
    {
        return $this->render_shortcode(
            'dfs-col dfs-col-12 dfs-col-md-9 dfs-col-lg-9',
            $attrs,
            $content
        );
    }

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

new CF7_Grid_Helper();
