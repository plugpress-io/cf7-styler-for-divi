import {__} from '@wordpress/i18n';
import {ToggleControl} from '@wordpress/components';

const ModuleCard = ({moduleInfo}) => {
    const {title, name} = moduleInfo;

    const moduleTitle = title.replace('Torq ', 'Divi ');

    const isChecked = ['cf7', 'ff', 'gf'].includes(name);
    const isDisabled = ['cf7', 'ff', 'gf'].includes(name) ? false : true;

    return (
        <div className="border border-slate-200 rounded-md h-20 p-4 flex items-center transition">
            <p className="text-sm font-medium text-slate-800">{moduleTitle}</p>
            <ToggleControl
                className="ml-auto dt-toggle"
                checked={isChecked}
                disabled={isDisabled}
                onChange={() => {}}
            />
        </div>
    );
};

export default ModuleCard;
