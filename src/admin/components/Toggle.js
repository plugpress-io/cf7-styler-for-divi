/**
 * Toggle switch for feature on/off.
 *
 * @package CF7_Mate
 */

export function Toggle({ checked, onChange, disabled }) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			disabled={disabled}
			onClick={() => !disabled && onChange(!checked)}
			className={`dcs-toggle ${checked ? 'dcs-toggle--active' : ''} ${disabled ? 'dcs-toggle--disabled' : ''}`}
		>
			<span className="dcs-toggle__track">
				<span className="dcs-toggle__thumb" />
			</span>
		</button>
	);
}
