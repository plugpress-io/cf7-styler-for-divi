import React from 'react';
import {Link} from 'react-router-dom';
import {Logo, Menu, RightMenu} from '@DashboardApp/components';

const Header = () => {
    return (
        <header className="bg-[#0A236D] p-4 md:p-6">
            <div className="container mx-auto max-w-screen-xl px-4 md:px-0 flex items-center justify-between">
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                    <Link
                        to="/"
                        className="logo-dt focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                    >
                        <Logo />
                    </Link>

                    <Menu />
                </div>

                <RightMenu />
            </div>
        </header>
    );
};

export default Header;
