import React from 'react';
import {Link} from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-white shadow">
            <div className="relative flex items-center max-w-3xl mx-auto px-3 sm:px-6 lg:max-w-full h-28 lg:h-16 py-3 lg:py-0">
                <div className="lg:flex-1 flex items-start justify-center sm:items-stretch sm:justify-start">
                    {' '}
                    <Link to="/" className="flex-shrink-0 flex items-center justify-start">
                        <Logo />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
