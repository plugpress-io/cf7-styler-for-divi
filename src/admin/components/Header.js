import React from '@wordpress/element';

const Header = () => {
	return (
		<header className="dcs-admin__header">
			<div className="dcs-admin__logo">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className="w-7 h-7"
				>
					<rect x="3" y="4" width="18" height="16" rx="2" />
					<line x1="7" y1="8" x2="17" y2="8" />
					<line x1="7" y1="12" x2="17" y2="12" />
					<line x1="7" y1="16" x2="12" y2="16" />
				</svg>
				<h1 className="dcs-admin__title">CF7 Styler for Divi</h1>
			</div>
			<nav className="dcs-admin__nav">
				<a
					href="https://divipeople.com/divi-cf7-styler/"
					target="_blank"
					rel="noopener noreferrer"
					className="dcs-admin__nav-link"
				>
					Documentation
				</a>
			</nav>
		</header>
	);
};

export default Header;
