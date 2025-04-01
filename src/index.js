// External Dependencies
import $ from 'jquery';

// Internal Dependencies
import modules from './modules';

import './index.scss';

$(window).on('et_builder_api_ready', (event, API) => {
    API.registerModules(modules);
});
