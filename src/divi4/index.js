// Divi 4 builder entry: registers CF7/FF/GF modules with Visual Builder
import $ from 'jquery';

import CF7Styler from './cf7/cf7.jsx';
import FFStyler from './ff/ff.jsx';
import GFStyler from './gf/gf.jsx';

import '../index.scss';

const modules = [CF7Styler, FFStyler, GFStyler];

$(window).on('et_builder_api_ready', (event, API) => {
	API.registerModules(modules);
});
