import {NavLink} from 'react-router-dom';

const MenuComponent = () => {
    const InternalLink = ({path, name}) => (
        <NavLink
            key={path}
            to={path}
            className="flex items-center text-base font-normal text-[#fff] hover:text-slate-100 transition duration-300"
            aria-label={`Navigate to ${name}`}
        >
            {name}
        </NavLink>
    );

    const menuItems = [
        {name: 'Modules', path: '/modules'},
        {name: 'About', path: '/about'},
        {name: 'Help', path: '/help'},
    ];

    const internalLinks = menuItems.map(({name, path}) => ({name, path}));

    return (
        <nav className="sm:ml-20 sm:flex sm:space-x-[50px]">{internalLinks.map(InternalLink)}</nav>
    );
};

export default MenuComponent;
