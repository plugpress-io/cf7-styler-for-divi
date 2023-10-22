import {useSelect} from '@wordpress/data';
import {Navigate, Route, Routes} from 'react-router-dom';

const PageTitle = () => {
    const getRouteTitle = useSelect((select) => select('divitorque/dashboard').getRouteTitle());
    return (
        <div className="sticky w-full z-20 flex-shrink-0 flex h-16 bg-white">
            <div className="flex-1 px-4 flex justify-between">
                <div className="flex-1 flex">
                    <h3 className="w-full flex md:ml-0 text-xl pl-6 my-auto font-semibold text-app-heading">
                        {getRouteTitle}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default PageTitle;
