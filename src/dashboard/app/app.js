import AppRoutes from './routes';
import {Sidebar} from '@DashboardApp/components';

const App = () => {
    return (
        <div className="h-full min-h-screen flex gap-0 dt-app-bg">
            <Sidebar />
            <AppRoutes />
        </div>
    );
};

export default App;
