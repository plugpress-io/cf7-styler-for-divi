/**
 * Header nav icons (Docs, Crown).
 *
 * @package CF7_Mate
 */

export const DocsIcon = () => (
	<svg className="dcs-nav-icon dcs-nav-icon--docs" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<path d="M12 7v14" />
		<path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
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
