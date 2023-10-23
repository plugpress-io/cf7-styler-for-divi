import {render} from '@wordpress/element';
import {HashRouter} from 'react-router-dom';
import domReady from '@wordpress/dom-ready';
import App from './app/app';
import {Header, Modal} from '@DashboardApp/components';

domReady(() => {
    const root = document.getElementById('tfs-root');

    if (!root) {
        return 'No root element found';
    }

    const Dashboard = () => {
        return (
            <div className="tfs-dashboard-app">
                <Modal />
                <HashRouter>
                    <App />
                </HashRouter>
            </div>
        );
    };

    render(<Dashboard />, root);
});
