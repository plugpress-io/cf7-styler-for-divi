/**
 * shadcn-style Tooltip – shows content on hover.
 * Accessible: role="tooltip", aria-describedby, focus support.
 *
 * @package CF7_Mate
 */

import { useState, useMemo } from '@wordpress/element';
import { cn } from '../../lib/utils';

const SIDE_CLASSES = {
	top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
	bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
	left: 'right-full top-1/2 -translate-y-1/2 mr-2',
	right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

/**
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Trigger element (e.g. info icon button)
 * @param {import('react').ReactNode} props.content - Tooltip content
 * @param {'top'|'bottom'|'left'|'right'} [props.side='top'] - Placement
 * @param {string} [props.className] - Extra class for the wrapper
 */
export function Tooltip({ children, content, side = 'top', className }) {
	const [open, setOpen] = useState(false);
	const tooltipId = useMemo(() => `cf7m-tooltip-${Math.random().toString(36).slice(2, 9)}`, []);

	return (
		<div
			className={cn('relative inline-flex', className)}
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
		>
			{children}
			{open && content && (
				<div
					id={tooltipId}
					role="tooltip"
					className={cn(
						'absolute z-50 px-3 py-2 text-xs text-white bg-gray-900 rounded-md shadow-lg',
						'whitespace-normal max-w-[220px] leading-relaxed',
						SIDE_CLASSES[side] || SIDE_CLASSES.top
					)}
				>
					{content}
				</div>
			)}
		</div>
	);
}
