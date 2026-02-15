/**
 * CF7 Mate logo – single source of truth for the plugin icon.
 * Reuse in admin header, onboarding, rebrand modal, banners, etc.
 *
 * @package CF7_Mate
 */

const LOGO_PATH = 'M24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0ZM16.8 12C14.149 12 12 14.149 12 16.8V31.2C12 33.851 14.149 36 16.8 36H21.6C24.251 36 26.4 33.851 26.4 31.2V16.8C26.4 14.149 24.251 12 21.6 12H16.8ZM32.4 12C30.4118 12 28.8 13.6118 28.8 15.6V32.4C28.8 34.3882 30.4118 36 32.4 36C34.3882 36 36 34.3882 36 32.4V15.6C36 13.6118 34.3882 12 32.4 12Z';

export const VIEWBOX = '0 0 48 48';
export const DEFAULT_FILL = '#3a57fc';

/**
 * @param {Object} props
 * @param {number} [props.width=48]
 * @param {number} [props.height=48]
 * @param {string} [props.className]
 * @param {string} [props.fill]
 */
export function CF7MateLogo({ width = 48, height = 48, className, fill = DEFAULT_FILL, ...rest }) {
	return (
		<svg
			width={width}
			height={height}
			viewBox={VIEWBOX}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			className={className}
			{...rest}
		>
			<path fillRule="evenodd" clipRule="evenodd" d={LOGO_PATH} fill={fill} />
		</svg>
	);
}

export default CF7MateLogo;
