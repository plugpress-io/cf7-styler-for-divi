import React, { useEffect, useState, render } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import domReady from '@wordpress/dom-ready';
import './style.scss';

// Ensure React is available globally for classic JSX runtime
if (typeof window !== 'undefined' && window.wp && window.wp.element) {
	window.React = window.wp.element;
}

import {
	Header,
	OnboardingNotice,
	WelcomeSection,
	QuickStartSection,
	SupportSection,
} from './components';

const App = () => {
	const [onboardingStatus, setOnboardingStatus] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchStatus = async () => {
			try {
				const response = await window.wp?.apiFetch({
					path: '/cf7-styler/v1/onboarding/status',
					method: 'GET',
				});
				setOnboardingStatus(response);
			} catch (error) {
				console.error('Error fetching onboarding status:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStatus();
	}, []);

	const apiFetch = window.wp?.apiFetch;

	return (
		<div className="dcs-admin-wrapper">
			<Header />
			<div className="dcs-admin">
				<div className="dcs-admin__content">
					{!isLoading && onboardingStatus?.should_show_notice && apiFetch && (
						<OnboardingNotice apiFetch={apiFetch} />
					)}
					<WelcomeSection />
					<QuickStartSection />
					<SupportSection />
				</div>
			</div>
		</div>
	);
};

domReady(() => {
	const rootElement = document.getElementById('cf7-styler-for-divi-root');
	if (!rootElement) return;

	// Ensure wp.element is loaded (this is React)
	if (typeof wp === 'undefined' || !wp.element) {
		console.error('CF7 Styler: wp.element is not available. Make sure wp-element script is enqueued.');
		rootElement.innerHTML = '<div class="notice notice-error"><p>CF7 Styler: WordPress React (wp.element) is not loaded. Please refresh the page.</p></div>';
		return;
	}

	// Ensure React is available globally for classic JSX runtime
	if (!window.React) {
		window.React = wp.element;
	}

	// Render the app
	render(<App />, rootElement);
});
