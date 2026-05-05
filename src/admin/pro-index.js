/**
 * Pro admin entry point – registers pro page components on the window global.
 *
 * Loaded AFTER admin.js (via WP script dependency), so window.cf7mProPages
 * is available before React mounts via domReady().
 *
 * @package CF7_Mate
 */

import { EntriesPage } from './pages/EntriesPage';
import { WebhookPage } from './pages/WebhookPage';
import { AISettingsPage } from './pages/AISettingsPage';
import LicensePage from './pages/LicensePage';
import { EntriesOverviewWidget } from './components/EntriesOverviewWidget';

window.cf7mProPages = window.cf7mProPages || {};
window.cf7mProPages.entries = EntriesPage;
window.cf7mProPages.webhook = WebhookPage;
window.cf7mProPages['ai-settings'] = AISettingsPage;
window.cf7mProPages.license = LicensePage;

window.cf7mProWidgets = window.cf7mProWidgets || {};
window.cf7mProWidgets.entriesOverview = EntriesOverviewWidget;
