/**
 * CF7 Styler – Gutenberg block entry point.
 *
 * Registers the client-side edit/save for the block. All metadata
 * (name, attributes, supports, title, icon) comes from the server-side
 * PHP registration via block.json in the gutenberg directory.
 *
 * @package CF7_Mate
 */

import { registerBlockType } from '@wordpress/blocks';
import metadata from '../../includes/lite/builders/gutenberg/block.json';
import Edit from './edit';
import './editor.scss';

registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	save: () => null,
});
