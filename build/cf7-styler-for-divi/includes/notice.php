<?php
add_action( 'admin_init', 'dipe_cf7_plugin_is_loaded' );

if ( ! function_exists( 'dipe_cf7_installed' ) ) 
{
	function dipe_cf7_installed() 
    {
		$file_path = 'contact-form-7/wp-contact-form-7.php';
		$installed_plugins = get_plugins();
		return isset( $installed_plugins[ $file_path ] );
	}
}

function dipe_cf7_admin_notice() 
{

	$plugin = 'contact-form-7/wp-contact-form-7.php';

	if( dipe_cf7_installed() ){

		if( ! current_user_can( 'activate_plugins' ) ) return;

		$cf7_install_active_url = wp_nonce_url(
			'plugins.php?action=activate&amp;plugin=' . $plugin . '&amp;plugin_status=all&amp;paged=1&amp;s', 
			'activate-plugin_' . $plugin
		);

    	$message = __(
    		'Contact Form 7 Styler for Divi requires Coctact Form 7 plugin to be active. Please activate Contact Form 7 to continue.', 
    		'dvppl-cf7-styler'
    	);

		$button_text = __(
			'Activate Contact Form 7', 
			'dvppl-cf7-styler' 
		);
		$button = '<a href="' . $cf7_install_active_url . '" class="button-primary">' . $button_text . '</a>';

	} else {

		if (!current_user_can('install_plugins')) return;

		$cf7_install_active_url = wp_nonce_url( 
			self_admin_url( 'update.php?action=install-plugin&plugin=contact-form-7' ), 
			'install-plugin_contact-form-7'
		);

    	$message = __( 
    		'Contact Form 7 Styler for Divi plugin to be installed and activated. Please install Contact Form 7 to continue.', 
    		'dvppl-cf7-styler'
    	);

		$button_text = __(
			'Install Contact Form 7', 
			'dvppl-cf7-styler'
		);

		$button = '<a href="' . $cf7_install_active_url . '" class="button-primary install-now button">' . $button_text . '</a>';
	}

	printf('
		<div id="dvppl-cf7-install-notice" class="dvppl-cf7-install-notice notice is-dismissible">
			<p style="display: flex; align-items: center; padding:10px 10px 10px 0;">
				%1$s &nbsp; %2$s
			</p>
		</div>', 
		esc_html( $message ),
		$button
	);
}

function dipe_cf7_plugin_is_loaded() 
{

	if (!is_plugin_active('contact-form-7/wp-contact-form-7.php') ) {
		add_action( 'admin_notices', 'dipe_cf7_admin_notice' );
	}
}

#START_REPLACE #END_REPLACE