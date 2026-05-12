/**
 * Pro registrations for the Analytics page bundle.
 * Loaded AFTER analytics.js so window.cf7mProPages is available before mount.
 *
 * @package CF7_Mate
 */

import { AnalyticsPage } from './pages/AnalyticsPage';

window.cf7mProPages = window.cf7mProPages || {};
window.cf7mProPages.analytics = AnalyticsPage;
