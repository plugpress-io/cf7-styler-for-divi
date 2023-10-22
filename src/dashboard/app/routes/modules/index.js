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
        <div className="rounded-xl bg-white overflow-hidden p-8 dt-modules">
            <div className="pb-6 border-b border-b-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    {__('Torque Modules', 'divitorque')}
                    <span className="text-sm font-normal text-white ml-1 bg-[#ff6900] rounded-full w-7 h-7 flex items-center justify-center">
                        {moduleCount && `${moduleCount}`}
                    </span>
                </h2>
            </div>
            <div className="mx-auto grid grid-flow-row auto-rows-min grid-cols-3 gap-5 sm:grid-cols-4 py-8">
                {modules?.map((module, index) => (
                    <ModuleCard key={index} moduleInfo={module} />
                ))}
            </div>
        </div>
    );
};

export default Modules;
