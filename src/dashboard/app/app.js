import AppRoutes from './routes';
import {Header} from '@DashboardApp/components';

const App = () => {
    return (
        <div className="h-full flex flex-col gap-[3rem]">
            <Header />
            <AppRoutes />
        </div>
    );
};

export default App;
