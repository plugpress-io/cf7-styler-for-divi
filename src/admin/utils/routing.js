/**
 * Hash-based routing for admin app.
 * #/ -> dashboard, #/features -> features, #/entries -> entries, #/ai-settings -> ai-settings.
 *
 * @package CF7_Mate
 */

export function getViewFromHash() {
	const entriesOnly = typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.entriesOnlyPage;
	if (entriesOnly) return 'entries';
	const hash = (window.location.hash || '').replace(/^#\/?/, '');
	if (hash === 'entries') return 'entries';
	if (hash === 'features') return 'features';
	if (hash === 'ai-settings') return 'ai-settings';
	return 'dashboard';
}
