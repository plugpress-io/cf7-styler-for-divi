/**
 * Hash-based routing for admin app.
 * #/ -> dashboard, #/features -> features, #/entries -> entries, #/entries/123 -> single entry, #/ai-settings -> ai-settings.
 *
 * @package CF7_Mate
 */

export function getViewFromHash() {
	const hash = (window.location.hash || '').replace(/^#\/?/, '');
	// #/entries/123 -> single entry view
	const entriesMatch = hash.match(/^entries\/(\d+)$/);
	if (entriesMatch) return { view: 'entries', entryId: parseInt(entriesMatch[1], 10) };
	if (hash === 'entries') return { view: 'entries', entryId: null };
	if (hash === 'features') return { view: 'features', entryId: null };
	if (hash === 'ai-settings') return { view: 'ai-settings', entryId: null };
	const entriesOnly = typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.entriesOnlyPage;
	if (entriesOnly && !hash) return { view: 'entries', entryId: null };
	return { view: 'dashboard', entryId: null };
}
