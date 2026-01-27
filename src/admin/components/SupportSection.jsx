import React from '@wordpress/element';

const SupportSection = () => {
	return (
		<div className="dcs-admin__support">
			<div className="dcs-admin__support-icon">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className="w-6 h-6"
				>
					<circle cx="12" cy="12" r="10" />
					<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
					<line x1="12" y1="17" x2="12.01" y2="17" />
				</svg>
			</div>
			<div className="dcs-admin__support-content">
				<h3 className="dcs-admin__support-title">Need Help?</h3>
				<p className="dcs-admin__support-desc">
					Check out our documentation or contact support for assistance.
				</p>
			</div>
			<a
				href="https://divipeople.com/divi-cf7-styler/"
				target="_blank"
				rel="noopener noreferrer"
				className="dcs-admin__support-btn"
			>
				Get Support
			</a>
		</div>
	);
};

export default SupportSection;
