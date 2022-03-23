<?php
function dipe_global_assets_list( $global_list ) {

	$assets_list   = array();
	$assets_prefix = et_get_dynamic_assets_path();

	$assets_list['et_icons_fa'] = array(
		'css' => "{$assets_prefix}/css/icons_fa_all.css",
	);

	return array_merge( $global_list, $assets_list );
}

function dipe_inject_fa_icons( $icon_data ) {
	if ( function_exists( 'et_pb_maybe_fa_font_icon' ) && et_pb_maybe_fa_font_icon( $icon_data ) ) {
		add_filter( 'et_global_assets_list', 'dipe_global_assets_list' );
		add_filter( 'et_late_global_assets_list', 'dipe_global_assets_list' );
	}
}


