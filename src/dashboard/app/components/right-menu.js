const RightMenuComponent = () => {
    const DASH_ICONS = {
        'Knowledge Base': 'dashicons-book-alt',
        Support: 'dashicons-testimonial',
    };

    const getDashIcon = (name) => DASH_ICONS[name] || 'dashicons-admin-plugins';

    const menuItemClasses = (isActive) =>
        `w-10 h-10 flex items-center justify-center rounded-full border border-white text-white`;

    const ExternalLink = ({path, name}) => (
        <a
            key={path}
            href={path}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`External link to ${name}`}
            className={menuItemClasses(false)}
        >
            <span className={`dashicons ${getDashIcon(name)}`}></span>
        </a>
    );

    const menuItems = [
        {
            name: 'Knowledge Base',
            path: 'https://divitorque.com/docs/',
        },
        {
            name: 'Changelog',
            path: 'https://divitorque.com/changelog/',
        },
    ];

    return <div className="sm:ml-4 sm:flex sm:space-x-4"> {menuItems.map(ExternalLink)}</div>;
};

export default RightMenuComponent;
