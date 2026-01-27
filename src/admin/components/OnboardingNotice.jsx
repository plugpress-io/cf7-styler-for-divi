import React, { useState } from '@wordpress/element';

const OnboardingNotice = ({ apiFetch }) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleComplete = async () => {
		setIsLoading(true);
		try {
			const response = await apiFetch({
				path: '/cf7-styler/v1/onboarding/complete',
				method: 'POST',
			});

			if (response && response.success) {
				window.location.reload();
			} else {
				setIsLoading(false);
				alert('Error completing onboarding. Please try again.');
			}
		} catch (error) {
			console.error('Error completing onboarding:', error);
			setIsLoading(false);
			alert('Error completing onboarding. Please try again.');
		}
	};

	return (
		<div className="dcs-admin__onboarding-notice">
			<div className="dcs-admin__notice-content">
				<div className="dcs-admin__notice-icon">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="w-6 h-6"
					>
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
						<polyline points="22 4 12 14.01 9 11.01" />
					</svg>
				</div>
				<div className="dcs-admin__notice-text">
					<h3 className="dcs-admin__notice-title">Complete Your Onboarding</h3>
					<p className="dcs-admin__notice-description">
						You skipped the onboarding process. Complete it now to learn how to get started with CF7 Styler for Divi.
					</p>
				</div>
				<button
					className="dcs-admin__notice-button"
					onClick={handleComplete}
					disabled={isLoading}
				>
					{isLoading ? 'Loading...' : 'Complete Onboarding'}
				</button>
			</div>
		</div>
	);
};

export default OnboardingNotice;
