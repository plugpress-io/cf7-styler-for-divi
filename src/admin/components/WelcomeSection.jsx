import React from '@wordpress/element';
import Card from './Card';

const WelcomeSection = () => {
	return (
		<Card>
			<div className="dcs-admin__welcome">
				<div className="dcs-admin__welcome-icon">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="w-8 h-8"
					>
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
						<polyline points="22 4 12 14.01 9 11.01" />
					</svg>
				</div>
				<div className="dcs-admin__welcome-content">
					<h2 className="dcs-admin__welcome-title">
						Welcome to CF7 Styler for Divi
					</h2>
					<p className="dcs-admin__welcome-desc">
						Style your Contact Form 7 forms with ease using Divi Builder. Create beautiful, responsive forms that match your site design without writing any code.
					</p>
				</div>
			</div>
		</Card>
	);
};

export default WelcomeSection;
