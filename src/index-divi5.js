import $ from 'jquery';

import modules from './modules/divi5';

import './index.scss';

$(window).on('et_builder_api_ready', (event, API) => {
    API.registerModules(modules);
});
