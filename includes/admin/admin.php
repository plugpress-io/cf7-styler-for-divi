<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Dipe_Admin {

	public function __construct() {
		add_action( 'admin_menu', array( __CLASS__, 'add_menu' ), 99 );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_scripts' ), 99 );
		add_action( 'admin_post_cf7_styler_rollback', array( $this, 'post_cf7_styler_rollback' ) );
	}

	public static function add_menu() {
		add_submenu_page(
			'et_divi_options',
			'CF7 Styler',
			'CF7 Styler',
			'manage_options',
			'dipe_cf7_styler_options',
			array( __CLASS__, 'render_page' )
		);
	}

	public static function post_cf7_styler_rollback() {

		check_admin_referer( 'cf7_styler_rollback' );

		$plugin_slug = basename( DIPE_CF7_PATH, '.php' );

		$rollback = new Dipe_Rollback(
			array(
				'version'     => DIPE_CF7_STABLE_VERSION,
				'plugin_name' => DIPE_CF7_PLUGIN_BASE,
				'plugin_slug' => $plugin_slug,
				'package_url' => sprintf( 'https://downloads.wordpress.org/plugin/%s.%s.zip', $plugin_slug, DIPE_CF7_STABLE_VERSION ),
			)
		);
		$rollback->run();
		wp_die(
			'',
			__( 'Rollback to Previous Version', 'dvppl-cf7-styler' ),
			array(
				'response' => 200,
			)
		);
	}

	public static function render_page() {

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Unauthorized user' );
		}

		if ( isset( $_POST['options'] ) ) {

			$value = $_POST['options'];

			update_option( 'dipe_options', $value );

		}

		$options      = get_option( 'dipe_options' );
		$grid_options = isset( $options['grid'] ) ? $options['grid'] : 'off';
		?>
		<div class="wrap">
			<div id="dipe-header">
				<h1>
					<?php echo esc_html__( 'CF7 Styler for Divi', 'dvppl-cf7-styler' ); ?>
					<span style="font-size: 10px;">v<?php echo DIPE_CF7_VERSION; ?></span>
				</h1>
				<div id="dipe-cf7-styler-tabs-wrapper" class="nav-tab-wrapper dipe-cf7-styler">
					<a id='dipe-cf7-styler-tab-general' class='nav-tab nav-tab-active' href='#tab-general'>General</a>
				</div>
			</div>
			<div class="dipe-wrap">
				<div id="poststuff">
					<div id="post-body" class="metabox-holder columns-2">
						<div id="post-body-content">
							<div id="tab-general" class="dipe-cf7-styler-form-page">
								<div class="postbox dipe-postbox">
									<h3 class="hndle">Rollback to Previous Version</h3>
									<div class="inside">
										<p>Experiencing an issue with CF7 Styler for Divi <?php echo DIPE_CF7_VERSION; ?> ? Rollback to a previous version before the issue appeared.</p>
										<table class="form-table">
											<tbody>
												<tr class="cf7_styler_rollback">
													<th scope="row">Rollback Version</th>
													<td>
														<div id="cf7_styler_rollback">
															<div>
																<?php
																echo sprintf( '<a target="_blank" href="%1$s" class="button wdc-btn wdc-rollback-button">%2$s</a>', wp_nonce_url( admin_url( 'admin-post.php?action=cf7_styler_rollback' ), 'cf7_styler_rollback' ), __( 'Rollback to Version ' . DIPE_CF7_STABLE_VERSION, 'dvppl-cf7-styler' ) );
																?>
															</div>

															<p class="description">
																<span style="color: red;">Warning: Please backup your database before making the rollback.</span>
															</p>
														 </div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>

								<div class="postbox dipe-postbox">
									<h3 class="hndle">Grid Builder</h3>
									<div class="inside">
										<form id="dipe-cf7-styler-form" method="post">
											<table class="form-table">
												<tbody>
													<tr class="cf7_styler_grid">
														<th scope="row">Contact Form 7 Grid Builder</th>
														<td>
															<div id="cf7_styler_grid">
																<div>
																	<input type="hidden" name='options[grid]' value='off' />
																	<input
																		type="checkbox"
																		class="checkbox"
																		id="cf7-styler-grid"
																		name='options[grid]'
																		value='on'
																		<?php checked( $grid_options, 'on', true ); ?>
																	>
																</div>
															</div>
														</td>
													</tr>

												</tbody>
											</table>
											<?php wp_nonce_field( 'dipe_cf7_styler_action' ); ?>
											<p><input type="submit" value="Save All Changes" class="button button-primary"></p>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<?php
	}

	public static function enqueue_scripts() {

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		wp_enqueue_script( 'dipe-admin-js', DIPE_ASSETS_URL . 'js/admin.js', array( 'jquery' ), DIPE_CF7_VERSION, true );
		wp_enqueue_style( 'dipe-admin', DIPE_ASSETS_URL . 'css/admin.css', null, DIPE_CF7_VERSION );
	}

}

new Dipe_Admin();
