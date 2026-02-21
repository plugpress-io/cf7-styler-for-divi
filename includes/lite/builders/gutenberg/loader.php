<?php
/**
 * Gutenberg Block – bootstrap.
 *
 * @package CF7_Mate\Gutenberg
 * @since   3.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-block.php';

CF7_Mate\Gutenberg\Block::instance();
