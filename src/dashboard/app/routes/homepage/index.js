import {__} from '@wordpress/i18n';
import {Card} from '@DashboardApp/components';

const Homepage = () => {
    return (
        <div className="dt-home">
            <div className="grid gap-3 lg:gap-10 grid-cols-3">
                <Card
                    title={__('Knowledge Base', 'divitorque')}
                    description={__(
                        'Get started by spending some time with the docs to get familiar with Divi Torque.',
                        'divitorque'
                    )}
                    buttonText={__('Read Docs →', 'divitorque')}
                    onButtonClick="https://divitorque.com/docs/"
                />

                <Card
                    title={__('Need Help?', 'divitorque')}
                    description={__(
                        'Stuck with something? Get help from live chat or submit a support ticket.',
                        'divitorque'
                    )}
                    buttonText={__('Get Support →', 'divitorque')}
                    onButtonClick="https://divitorque.com/support/"
                />

                <Card
                    title={__('Join the Community', 'divitorque')}
                    description={__(
                        'Join the Facebook community and discuss with fellow developers & users.',
                        'divitorque'
                    )}
                    buttonText={__('Join Now →', 'divitorque')}
                    onButtonClick="https://www.facebook.com/groups/wppaw"
                />
            </div>
        </div>
    );
};

export default Homepage;
