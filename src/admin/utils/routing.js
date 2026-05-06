/**
 * Hash-based routing helpers for the Mate Dash app.
 * Tabs: overview (default), features, webhook, license, ai-settings.
 *
 * @package CF7_Mate
 */

const VALID_TABS = ['overview', 'features', 'webhook', 'license', 'ai-settings'];

export function getDashTabFromHash() {
	const hash = (window.location.hash || '').replace(/^#\/?/, '');
	if (VALID_TABS.includes(hash)) return hash;
	return 'overview';
}
