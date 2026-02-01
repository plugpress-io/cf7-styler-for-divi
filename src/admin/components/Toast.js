/**
 * Toast notification (auto-dismiss).
 *
 * @package CF7_Mate
 */

import { useEffect } from '@wordpress/element';

export function Toast({ message, type, onClose }) {
	useEffect(() => {
		const timer = setTimeout(onClose, 3000);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div className={`dcs-toast dcs-toast--${type}`}>
			<span>{message}</span>
		</div>
	);
}
