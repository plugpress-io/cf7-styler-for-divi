<?php

defined( 'ABSPATH' ) || die();

class Dipe_Notices {

	private static $instance = null;

	public static function get_instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function __construct() {
		add_action( 'admin_init', array( $this, 'admin_notice_init' ) );
	}

	public function admin_notice_init() {
		add_action( 'wp_ajax_dismiss_admin_notice', array( $this, 'admin_notice' ) );
		add_action( 'admin_notices', array( $this, 'request_review_after_seven_days' ), 10 );
		add_action( 'admin_notices', array( $this, 'request_review_after_fifteen_days' ), 10 );
	}

	public function admin_notice() {
		$option_name        = sanitize_text_field( $_POST['option_name'] ); //phpcs:ignore
		$dismissible_length = sanitize_text_field( $_POST['dismissible_length'] ); //phpcs:ignore

		if ( 'forever' !== $dismissible_length ) {
			$dismissible_length = ( 0 === absint( $dismissible_length ) ) ? 1 : $dismissible_length;
			$dismissible_length = strtotime( absint( $dismissible_length ) . ' days' );
		}

		check_ajax_referer( 'dismissible-notice', 'nonce' );

		self::set_admin_notice_cache( $option_name, $dismissible_length );

		wp_die();
	}

	public static function set_admin_notice_cache( $id, $timeout ) {

		$cache_key = 'dipe-admin-notice-' . md5( $id );

		update_site_option( $cache_key, $timeout );

		return true;
	}

	public static function is_admin_notice_active( $arg ) {

		$array       = explode( '-', $arg );
		$option_name = implode( '-', $array );

		$db_record = self::get_admin_notice_cache( $option_name );

		if ( 'forever' === $db_record ) {
			return false;
		} elseif ( absint( $db_record ) >= time() ) {
			return false;
		} else {
			return true;
		}
	}

	public static function get_admin_notice_cache( $id = false ) {
		if ( ! $id ) {
			return false;
		}
		$cache_key = 'dipe-admin-notice-' . md5( $id );
		$timeout   = get_site_option( $cache_key );
		$timeout   = 'forever' === $timeout ? time() + 60 : $timeout;

		if ( empty( $timeout ) || time() > $timeout ) {
			return false;
		}

		return $timeout;
	}

	public function get_total_interval( $interval, $type ) {
		if ( ! $interval ) {
			return;
		}

		switch ( $type ) {
			case 'years':
				return $interval->format( '%Y' );
				break; //phpcs:ignore.
			case 'months':
				$years  = $interval->format( '%Y' );
				$months = 0;
				if ( $years ) {
					$months += $years * 12;
				}
				$months += $interval->format( '%m' );
				return $months;
				break; //phpcs:ignore.
			case 'days':
				return $interval->format( '%a' );
				break; //phpcs:ignore.
			case 'hours':
				$days  = $interval->format( '%a' );
				$hours = 0;
				if ( $days ) {
					$hours += 24 * $days;
				}
				$hours += $interval->format( '%H' );
				return $hours;
				break; //phpcs:ignore.
			case 'minutes':
				$days    = $interval->format( '%a' );
				$minutes = 0;
				if ( $days ) {
					$minutes += 24 * 60 * $days;
				}
				$hours = $interval->format( '%H' );
				if ( $hours ) {
					$minutes += 60 * $hours;
				}
				$minutes += $interval->format( '%i' );
				return $minutes;
				break; //phpcs:ignore.
			case 'seconds':
				$days    = $interval->format( '%a' );
				$seconds = 0;
				if ( $days ) {
					$seconds += 24 * 60 * 60 * $days;
				}
				$hours = $interval->format( '%H' );
				if ( $hours ) {
					$seconds += 60 * 60 * $hours;
				}
				$minutes = $interval->format( '%i' );
				if ( $minutes ) {
					$seconds += 60 * $minutes;
				}
				$seconds += $interval->format( '%s' );
				return $seconds;
				break; //phpcs:ignore.
			case 'milliseconds':
				$days    = $interval->format( '%a' );
				$seconds = 0;
				if ( $days ) {
					$seconds += 24 * 60 * 60 * $days;
				}
				$hours = $interval->format( '%H' );
				if ( $hours ) {
					$seconds += 60 * 60 * $hours;
				}
				$minutes = $interval->format( '%i' );
				if ( $minutes ) {
					$seconds += 60 * $minutes;
				}
				$seconds     += $interval->format( '%s' );
				$milliseconds = $seconds * 1000;
				return $milliseconds;
				break; //phpcs:ignore.
			default:
				return null;
		}
	}

	public function days_differences() {

		$install_date = get_option( '_dipe_cf7_installed_time' );

		$install_date = isset( $install_date ) ? $install_date : strtotime( 'now' );

		$datetime1 = \DateTime::createFromFormat( 'U', $install_date );
		$datetime2 = \DateTime::createFromFormat( 'U', strtotime( 'now' ) );

		$interval = $datetime2->diff( $datetime1 );

		$days_diff = $this->get_total_interval( $interval, 'days' );
		return $days_diff;

	}

	public function install_plugin( $notice_key ) {

		$notice = sprintf(
			'Please install FREE %1$s plugin to get 20+ Divi Modules.',
			'<a target="_blank" rel="noopener" href="' . esc_url( admin_url( 'plugin-install.php?s=Brain+Addons+for+Divi&tab=search&type=term' ) ) . '"> Brain Addons For Divi </a>'
		);

		?>

		<div data-dismissible="<?php echo esc_attr( $notice_key ); ?>" class="notice dipe-notice notice-success is-dismissible">
			<div class="notice-right-container">
				<?php echo $notice; //phpcs:ignore ?>
			</div>
		</div>

		<?php
	}

	public function request_review_after_seven_days() {
		if ( ! self::is_admin_notice_active( 'dipe-days-7' ) ) {
			return; }
		$dipe_seven_day_notice = $this->days_differences();
		if ( $dipe_seven_day_notice >= 7 && $dipe_seven_day_notice < 15 ) {
			$this->install_plugin( 'dipe-days-7' );
		}
	}

	public function request_review_after_fifteen_days() {
		if ( ! self::is_admin_notice_active( 'dipe-days-15' ) ) {
			return; }
		$dipe_seven_day_notice = $this->days_differences();
		if ( $dipe_seven_day_notice > 7 && $dipe_seven_day_notice < 15 ) {
			$this->install_plugin( 'dipe-days-15' );
		}
	}

}

Dipe_Notices::get_instance();
