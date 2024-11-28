import {render} from '@wordpress/element';
import {HashRouter, Link} from 'react-router-dom';
import domReady from '@wordpress/dom-ready';
import {Logo, Card} from '@DashboardComponents';
import {__} from '@wordpress/i18n';

domReady(() => {
    const root = document.getElementById('tfs-root');

    if (!root) {
        return 'No root element found';
    }

    const Dashboard = () => {
        return (
            <HashRouter>
                <div className="tfs-dashboard-app">
                    <div className="h-full flex flex-col gap-[3rem]">
                        <header className="bg-white shadow">
                            <div className="relative flex items-center max-w-3xl mx-auto px-3 sm:px-6 lg:max-w-full h-28 lg:h-16 py-3 lg:py-0">
                                <div className="lg:flex-1 flex items-start justify-center sm:items-stretch sm:justify-start">
                                    {' '}
                                    <Link
                                        to="/"
                                        className="flex-shrink-0 flex items-center justify-start"
                                    >
                                        <Logo />
                                    </Link>
                                </div>
                            </div>
                        </header>

                        <div className="container mx-auto max-w-screen-xl px-4 md:px-0 flex flex-row">
                            <div className="grid gap-3 lg:gap-10 grid-cols-3">
                                <Card
                                    title={__('Knowledge Base', 'form-styler-for-divi')}
                                    description={__(
                                        'Get started by spending some time with the docs to get familiar with Divi Torque.',
                                        'form-styler-for-divi'
                                    )}
                                    buttonText={__('Read Docs →', 'form-styler-for-divi')}
                                    onButtonClick="https://diviepic.com/docs/"
                                />

                                <Card
                                    title={__('Need Help?', 'form-styler-for-divi')}
                                    description={__(
                                        'Stuck with something? Get help from live chat or submit a support ticket.',
                                        'form-styler-for-divi'
                                    )}
                                    buttonText={__('Get Support →', 'form-styler-for-divi')}
                                    onButtonClick="https://diviepic.com/contact-us/"
                                />

                                <Card
                                    title={__('All In One Plugin', 'form-styler-for-divi')}
                                    description={__(
                                        '10 Sites Lifetime Access for only $89',
                                        'form-styler-for-divi'
                                    )}
                                    buttonText={__('Get Divi Torque Pro →', 'form-styler-for-divi')}
                                    onButtonClick="https://diviepic.com/divi-torque-pro/"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </HashRouter>
        );
    };

    render(<Dashboard />, root);
});
