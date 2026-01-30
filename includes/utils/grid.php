<?php

namespace CF7_Mate;

use WPCF7_TagGenerator;

/**
 * CF7 Grid – row/column shortcodes and tag generators for multi-column forms.
 *
 * Single source of truth for shortcode tags, CSS classes, and labels.
 * Renders .dfs-row / .dfs-col markup; grid CSS lives in index.scss (builder4) and is shared.
 *
 * @since 3.0.0
 */
class CF7_Grid {

	private static $instance;

	/** Row shortcode tag and config. */
	const ROW_TAG = 'dipe_row';

	/**
	 * Column shortcodes and their CSS class (base .dfs-col is added in render).
	 * Keys: shortcode tag. Values: space-separated responsive classes (e.g. dfs-col-12 dfs-col-md-6).
	 *
	 * @var array<string, string>
	 */
	const COLUMN_MAP = array(
		'dipe_one'          => 'dfs-col-12',
		'dipe_one_half'     => 'dfs-col-12 dfs-col-md-6 dfs-col-lg-6',
		'dipe_one_third'    => 'dfs-col-12 dfs-col-md-4 dfs-col-lg-4',
		'dipe_one_fourth'   => 'dfs-col-12 dfs-col-md-3 dfs-col-lg-3',
		'dipe_two_third'    => 'dfs-col-12 dfs-col-md-8 dfs-col-lg-8',
		'dipe_three_fourth' => 'dfs-col-12 dfs-col-md-9 dfs-col-lg-9',
	);

	/**
	 * Tag generator labels (title, description) for row and columns.
	 *
	 * @var array<string, array{title: string, description: string}>
	 */
	const TAG_LABELS = array(
		self::ROW_TAG => array(
			'title'       => 'row',
			'description' => 'Generate a row shortcode',
		),
		'dipe_one' => array(
			'title'       => '1-col',
			'description' => 'Generate a full width column',
		),
		'dipe_one_half' => array(
			'title'       => '1/2-col',
			'description' => 'Generate a half width column',
		),
		'dipe_one_third' => array(
			'title'       => '1/3-col',
			'description' => 'Generate a one-third width column',
		),
		'dipe_one_fourth' => array(
			'title'       => '1/4-col',
			'description' => 'Generate a one-fourth width column',
		),
		'dipe_two_third' => array(
			'title'       => '2/3-col',
			'description' => 'Generate a two-thirds width column',
		),
		'dipe_three_fourth' => array(
			'title'       => '3/4-col',
			'description' => 'Generate a three-fourths width column',
		),
	);

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function __construct() {
		$this->register_shortcodes();
		add_action( 'wpcf7_admin_init', array( $this, 'register_tag_generators' ), 99 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );
	}

	public function enqueue_admin_scripts() {
		wp_enqueue_script(
			'dfs-admin-js',
			CF7M_PLUGIN_URL . 'dist/js/utils.js',
			array( 'jquery' ),
			CF7M_VERSION,
			true
		);
	}

	private function register_shortcodes() {
		add_filter( 'wpcf7_autop_or_not', '__return_false' );
		add_filter( 'wpcf7_form_elements', 'do_shortcode' );

		add_shortcode( self::ROW_TAG, array( $this, 'render_row' ) );
		foreach ( array_keys( self::COLUMN_MAP ) as $tag ) {
			add_shortcode( $tag, array( $this, 'render_column' ) );
		}
	}

	/**
	 * Registers CF7 tag generators for row and all columns.
	 */
	public function register_tag_generators() {
		if ( ! class_exists( 'WPCF7_TagGenerator' ) ) {
			return;
		}
		$tg = WPCF7_TagGenerator::get_instance();
		$t = 'cf7-styler-for-divi';

		foreach ( self::TAG_LABELS as $tag => $labels ) {
			$tg->add(
				$tag,
				__( $labels['title'], $t ),
				array( $this, 'tag_generator_panel' ),
				array(
					'title'       => __( $labels['title'], $t ),
					'description' => __( $labels['description'], $t ),
					'version'     => '2',
				)
			);
		}
	}

	/**
	 * Renders the tag generator panel (row or column).
	 *
	 * @param \WPCF7_ContactForm $contact_form
	 * @param array|string       $args   'id' => shortcode tag.
	 */
	public function tag_generator_panel( $contact_form, $args = '' ) {
		$args = wp_parse_args( $args, array( 'id' => '' ) );
		$type = $args['id'];
		$tag  = '[' . $type . '][/' . $type . ']';
		?>
		<input type="text" class="tag code" readonly="readonly" onfocus="this.select()" value="<?php echo esc_attr( $tag ); ?>">
		<button class="button button-primary" onclick="insertGridShortcode('<?php echo esc_js( $type ); ?>')"><?php esc_html_e( 'Insert', 'cf7-styler-for-divi' ); ?></button>
		<?php
	}

	public function render_row( $attrs, $content = null ) {
		return $this->render_wrapper( 'dfs-row', $attrs, $content );
	}

	/**
	 * Renders a column shortcode. Dispatched for all tags in COLUMN_MAP.
	 * WordPress passes the shortcode tag as the third argument to the callback.
	 *
	 * @param array       $attrs
	 * @param string|null $content
	 * @param string      $tag   Shortcode tag (e.g. dipe_one_half).
	 */
	public function render_column( $attrs, $content = null, $tag = '' ) {
		$classes = isset( self::COLUMN_MAP[ $tag ] ) ? self::COLUMN_MAP[ $tag ] : 'dfs-col-12';
		return $this->render_wrapper( 'dfs-col ' . $classes, $attrs, $content );
	}

	/**
	 * Wraps content in a div with the given class(es).
	 *
	 * @param string       $class
	 * @param array|string $attrs
	 * @param string|null  $content
	 * @return string
	 */
	private function render_wrapper( $class, $attrs, $content ) {
		$attrs = shortcode_atts( array(), (array) $attrs );
		return sprintf(
			'<div class="%s">%s</div>',
			esc_attr( $class ),
			do_shortcode( $content )
		);
	}
}

CF7_Grid::instance();
