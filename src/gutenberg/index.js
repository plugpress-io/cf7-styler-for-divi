import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';
import './editor.scss';

// Pass the full metadata object so Gutenberg reads title, category,
// icon, and keywords from block.json and shows the block in the inserter.
registerBlockType( metadata, {
	edit: Edit,
	// Server-side rendered – no static save output.
	save: () => null,
} );
