import {Route, Routes} from 'react-router-dom';
import {default as Homepage} from './homepage';
import {default as Modules} from './modules';

const AppRoutes = () => {
    return (
        <div className="flex flex-col flex-1 transition-all ease-in-out duration-500">
            <div className="flex-1">
                <div className="h-full">
                    <div className="w-full mx-auto p-4 md:p-6 2xl:p-12 h-full">
                        <Routes>
                            <Route path="/" element={<Homepage />} />
                            <Route path="/modules" element={<Modules />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppRoutes;
