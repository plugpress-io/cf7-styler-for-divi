/**
 * Pro registrations for the Responses page bundle.
 * Loaded AFTER responses.js so window.cf7mProPages is available before mount.
 *
 * @package CF7_Mate
 */

import { ResponsesPage } from './pages/ResponsesPage';

window.cf7mProPages = window.cf7mProPages || {};
window.cf7mProPages.responses = ResponsesPage;
