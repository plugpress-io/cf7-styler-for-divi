import {DiviTorqueLogo} from '@DashboardApp/components';
import {__} from '@wordpress/i18n';
import {Link, NavLink} from 'react-router-dom';

const Sidebar = () => {
    const getDashIcon = (name) => {
        switch (name) {
            case 'Modules':
                return 'dashicons-admin-plugins';
            case 'Changelog':
                return 'dashicons-list-view';
            case 'Knowledge Base':
                return 'dashicons-book-alt';
            case 'Support':
                return 'dashicons-sos';
            default:
                return 'dashicons-admin-plugins';
        }
    };

    const menus = [
        {
            items: [
                {name: 'Modules', path: '/modules'},
                {name: 'Knowledge Base', path: 'https://divitorque.com/docs/'},
                {name: 'Support', path: 'https://divitorque.com/support/'},
                {name: 'Changelog', path: 'https://divitorque.com/changelog/'},
            ],
        },
    ];

    return (
        <aside className="bg-white md:w-72 py-10 px-10 hidden md:flex md:flex-col border-r dt-sidebar text-base">
            <div className="flex flex-col flex-grow overflow-y-auto">
                <div className="flex flex-start flex-col mb-5 pb-5 border-b border-solid border-slate-200">
                    <Link to="/" className="logo-dt">
                        <DiviTorqueLogo />
                    </Link>
                    <span className="text-slate-500 font-normal text-sm mt-2">
                        {__('Version:', 'torque-forms-styler')} {window.tfsApp?.version}
                    </span>
                </div>

                {menus.map((menuSection) => (
                    <div className="py-8" key={menuSection.title}>
                        {menuSection.title && (
                            <h4 className="text-base font-normal text-slate-900 mb-4">
                                {menuSection.title}
                            </h4>
                        )}

                        <nav
                            className={`dt-nav-${
                                menuSection.title ? menuSection.title.toLowerCase() : 'notitle'
                            }`}
                        >
                            {menuSection.items.map((menu) =>
                                menu.path.startsWith('http') ? (
                                    <a
                                        key={menu.path}
                                        href={menu.path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-600 focus:text-slate-700 hover:text-slate-700 group cursor-pointer py-2 flex items-center text-base font-normal"
                                    >
                                        <span
                                            className={`dashicons ${getDashIcon(menu.name)}`}
                                        ></span>
                                        {menu.name}

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="16"
                                            height="16"
                                            aria-hidden="true"
                                            focusable="false"
                                        >
                                            <path d="M19.5 4.5h-7V6h4.44l-5.97 5.97 1.06 1.06L18 7.06v4.44h1.5v-7Zm-13 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3H17v3a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h3V5.5h-3Z"></path>
                                        </svg>
                                    </a>
                                ) : (
                                    <NavLink
                                        key={menu.path}
                                        to={menu.path}
                                        className={({isActive}) =>
                                            isActive
                                                ? `text-slate-600 focus:text-slate-700 hover:text-slate-700 group cursor-pointer py-2 flex items-center text-base font-normal dt-active`
                                                : `text-slate-600 focus:text-slate-700 hover:text-slate-700 group cursor-pointer py-2 flex items-center text-base font-normal`
                                        }
                                    >
                                        <span
                                            className={`dashicons ${getDashIcon(menu.name)}`}
                                        ></span>
                                        {menu.name}
                                    </NavLink>
                                )
                            )}
                        </nav>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
