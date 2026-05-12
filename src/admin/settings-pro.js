/**
 * Pro registrations for the Settings page bundle.
 * Loaded AFTER settings.js so window.cf7mProPages / cf7mProWidgets are
 * available before mount.
 *
 * @package CF7_Mate
 */

import LicensePage from './pages/LicensePage';
import { ResponsesOverviewWidget } from './components/ResponsesOverviewWidget';

window.cf7mProPages = window.cf7mProPages || {};
window.cf7mProPages.license = LicensePage;

window.cf7mProWidgets = window.cf7mProWidgets || {};
window.cf7mProWidgets.responsesOverview = ResponsesOverviewWidget;
