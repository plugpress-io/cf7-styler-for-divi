<?php

class Dipe_Shortcode {

	public function __construct() {
		add_filter( 'wpcf7_autop_or_not', '__return_false' );
		add_filter( 'wpcf7_form_elements', 'do_shortcode' );
		add_shortcode( 'dipe_row', array( $this, 'row_render' ) );
		add_shortcode( 'dipe_one', array( $this, 'one_col_render' ) );
		add_shortcode( 'dipe_one_half', array( $this, 'one_half_col_render' ) );
		add_shortcode( 'dipe_one_third', array( $this, 'one_third_col_render' ) );
		add_shortcode( 'dipe_one_fourth', array( $this, 'one_fourth_col_render' ) );
		add_shortcode( 'dipe_two_third', array( $this, 'two_third_col_render' ) );
		add_shortcode( 'dipe_three_fourth', array( $this, 'three_fourth_col_render' ) );
	}

	public function row_render( $attrs, $content = null ) {
		$attrs = shortcode_atts( array(), $attrs );
		ob_start();
		$shortcode = sprintf(
			'<div class="dp-row">
				%1$s
        	</div>',
			do_shortcode( $content )
		);
		echo et_core_intentionally_unescaped( $shortcode, 'html' ); //phpcs:ignore.

		return ob_get_clean();
	}

	public function one_col_render( $attrs, $content = null ) {

		$attrs = shortcode_atts( array(), $attrs );
		ob_start();
		$shortcode = sprintf(
			'<div class="dp-col dp-col-12">
				%1$s
        	</div>',
			do_shortcode( $content )
		);
		echo et_core_intentionally_unescaped( $shortcode, 'html' ); //phpcs:ignore.

		return ob_get_clean();
	}

	public function one_half_col_render( $attrs, $content = null ) {

		$attrs = shortcode_atts( array(), $attrs );
		ob_start();
		$shortcode = sprintf(
			'<div class="dp-col dp-col-12 dp-col-md-6 dp-col-lg-6">
				%1$s
        	</div>',
			do_shortcode( $content )
		);
		echo et_core_intentionally_unescaped( $shortcode, 'html' ); //phpcs:ignore.

		return ob_get_clean();
	}

	public function one_third_col_render( $attrs, $content = null ) {

		$attrs = shortcode_atts( array(), $attrs );
		ob_start();
		$shortcode = sprintf(
			'<div class="dp-col dp-col-12 dp-col-md-4 dp-col-lg-4">
				%1$s
        	</div>',
			do_shortcode( $content )
		);
		echo et_core_intentionally_unescaped( $shortcode, 'html' ); //phpcs:ignore.

		return ob_get_clean();
	}

	public function one_fourth_col_render( $attrs, $content = null ) {

		$attrs = shortcode_atts( array(), $attrs );
		ob_start();
		$shortcode = sprintf(
			'<div class="dp-col dp-col-12 dp-col-md-3 dp-col-lg-3">
				%1$s
        	</div>',
			do_shortcode( $content )
		);
		echo et_core_intentionally_unescaped( $shortcode, 'html' ); //phpcs:ignore.

		return ob_get_clean();
	}

	public function two_third_col_render( $attrs, $content = null ) {

		$attrs = shortcode_atts( array(), $attrs );
		ob_start();
		$shortcode = sprintf(
			'<div class="dp-col dp-col-12 dp-col-md-8 dp-col-lg-8">
				%1$s
        	</div>',
			do_shortcode( $content )
		);
		echo et_core_intentionally_unescaped( $shortcode, 'html' ); //phpcs:ignore.

		return ob_get_clean();
	}

	public function three_fourth_col_render( $attrs, $content = null ) {

		$attrs = shortcode_atts( array(), $attrs );
		ob_start();
		$shortcode = sprintf(
			'<div class="dp-col dp-col-12 dp-col-md-9 dp-col-lg-9">
				%1$s
        	</div>',
			do_shortcode( $content )
		);
		echo et_core_intentionally_unescaped( $shortcode, 'html' ); //phpcs:ignore.

		return ob_get_clean();
	}
}

new Dipe_Shortcode();
