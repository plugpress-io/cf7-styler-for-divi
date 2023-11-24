import {Route, Routes} from 'react-router-dom';
import Help from './help';
import About from './about';
// import Modules from './modules';

const AppRoutes = () => (
    <div className="container mx-auto max-w-screen-xl px-4 md:px-0 flex flex-row h-full min-h-screen">
        <Routes>
            <Route path="/" element={<Help />} />
            <Route path="/help" element={<Help />} />
            <Route path="/about" element={<About />} />
        </Routes>
    </div>
);

export default AppRoutes;
