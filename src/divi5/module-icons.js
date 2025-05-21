const { addFilter } = window?.vendor?.wp?.hooks;

addFilter('divi.iconLibrary.icon.map', 'divi-cf7-styler', (icons) => {
    return {
        ...icons, // This is important. Without this, all other icons will be overwritten.
        'plugpress/cf7-styler': {
            name: 'plugpress/cf7-styler',
            viewBox: '0 0 24 24',
            moduleIcon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13L3.74 7.84 12 3l8.26 4.84L12 13z"/></svg>',
        },
    };
});
