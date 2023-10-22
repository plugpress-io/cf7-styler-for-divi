import {render} from '@wordpress/element';
import {HashRouter} from 'react-router-dom';
import domReady from '@wordpress/dom-ready';
// import {ToastContainer} from 'react-toastify';

// import registerStore from '@DashboardApp/store';

// Styles
import 'react-toastify/dist/ReactToastify.css';
// import './style.scss';

// Dashboard App
import App from './app/app';

domReady(() => {
    const root = document.getElementById('tfs-root');

    // registerStore();

    if (!root) {
        return 'No root element found';
    }

    const Dashboard = () => {
        return (
            <div className="tfs-dashboard-app">
                <HashRouter>
                    <App />
                    {/* <ToastContainer /> */}
                </HashRouter>
            </div>
        );
    };

    render(<Dashboard />, root);
});
