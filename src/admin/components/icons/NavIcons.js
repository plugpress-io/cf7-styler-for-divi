/**
 * Header nav icons (Docs, Crown).
 *
 * @package CF7_Mate
 */

export const DocsIcon = () => (
	<svg className="dcs-nav-icon dcs-nav-icon--docs" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
		<polyline points="14 2 14 8 20 8" />
		<line x1="8" y1="13" x2="16" y2="13" />
		<line x1="8" y1="17" x2="16" y2="17" />
		<line x1="8" y1="9" x2="12" y2="9" />
	</svg>
);

export const CrownIcon = ({ className = '' }) => (
	<svg className={`dcs-icon-crown ${className}`.trim()} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z" />
	</svg>
);

export const CrownIconNav = () => (
	<svg className="dcs-nav-icon dcs-nav-icon--crown" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z" />
	</svg>
);
