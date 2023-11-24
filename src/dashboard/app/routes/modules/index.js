import {__} from '@wordpress/i18n';
import {useState, useEffect} from '@wordpress/element';
import ModuleCard from './module-card';

const Modules = () => {
    const initialModules = window.tfsApp?.modules;

    const [modules, setModules] = useState(() => {
        if (!initialModules) return [];

        return [...initialModules].sort((a, b) => {
            const priorityModules = ['cf7', 'ff', 'gf'];
            if (priorityModules.includes(a.name) && !priorityModules.includes(b.name)) {
                return -1;
            }
            if (!priorityModules.includes(a.name) && priorityModules.includes(b.name)) {
                return 1;
            }
            return 0;
        });
    });

    const moduleCount = modules?.length;

    return (
        <div className="rounded-xl w-full max-w-screen-xl mx-auto p-[24px] bg-white shadow-lg">
            <div className="pb-5 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    {__('Divi Modules', 'divitorque')}
                    {moduleCount && (
                        <span className="ml-3 text-sm font-medium text-white bg-[#ff6900] rounded-full w-7 h-7 flex items-center justify-center">
                            {moduleCount}
                        </span>
                    )}
                </h2>

                <p className="text-base text-slate-600 mt-1">
                    {__(
                        'Here is the list of all Divi Torque modules. You can enable or disable the modules based on your need.',
                        'divitorque'
                    )}
                </p>
            </div>
            <div className="mt-5 mx-auto grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 py-5">
                {modules?.map((module, index) => (
                    <ModuleCard key={index} moduleInfo={module} />
                ))}
            </div>
        </div>
    );
};

export default Modules;
