<?php
/**
 * IDE stub for Contact Form 7 WPCF7_TagGenerator.
 *
 * The real class is provided by the Contact Form 7 plugin at runtime.
 * This file is for IDE/static analysis only — do not require or include it.
 *
 * @see https://contactform7.com/
 */

/**
 * Stub for WPCF7_TagGenerator (defined by CF7 plugin at runtime).
 */
class WPCF7_TagGenerator {

	/** @return self */
	public static function get_instance() {
		return new self();
	}

	/**
	 * @param string   $id
	 * @param string   $title
	 * @param callable $callback
	 * @param array    $options
	 */
	public function add( $id, $title, $callback, $options = array() ) {}
}
