/**
 * shadcn-style cn() – merge Tailwind classes with tailwind-merge.
 * Admin app uses Tailwind + shadcn design tokens.
 *
 * @package CF7_Mate
 */

import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';

/**
 * Merge class names (supports conditional classes) and resolve Tailwind conflicts.
 * Use for all admin UI components (shadcn + Tailwind).
 * @param {...import('classnames').ArgumentArray} inputs - Class names or arrays/objects.
 * @returns {string}
 */
export function cn(...inputs) {
	return twMerge(classNames(inputs));
}
