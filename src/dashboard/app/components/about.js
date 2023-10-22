import {Button} from '@wordpress/components';
import React from 'react';

function TFSAbout() {
    return (
        <article className="tfs-about" data-js="tfs-about-page">
            <header className="bg-gray-200 p-4">
                <img
                    className="gform-logo w-32 h-32"
                    src="http://divi5.local/wp-content/plugins/gravityforms/images/logos/gravity-logo-white.svg"
                    alt="Gravity Forms"
                />
                <h1 className="text-2xl font-bold">Build Forms Quickly Using Gravity Forms 2.7</h1>
                <p className="mt-2 text-gray-600">
                    Never start from scratch again. Gravity Forms comes with several pre-built form
                    templates...
                </p>
                <Button
                    href="http://divi5.local/wp-admin/admin.php?page=gf_new_form"
                    className="mt-4"
                >
                    Get Started
                </Button>
                {/* ...other content... */}
            </header>
            {/* ...rest of the content... */}
        </article>
    );
}

export default TFSAbout;
