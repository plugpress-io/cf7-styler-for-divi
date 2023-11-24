import React from 'react';
import {IconBox, FeatureBox} from '@DashboardApp/components';

import CTA from './cta';
import Header from './header';

function About() {
    const plugins = [
        {
            imageUrl: 'https://divitorque.b-cdn.net/dashboard/divi-torque-pro-banner.png',
            imageAlt: 'Divi Torque Pro',
            title: 'Divi Torque Pro',
            description:
                'Save time by using ready-to-use 50+ modules and build your website faster',
            url: 'https://divitorque.com/divi-pro-gallery/',
        },
        {
            imageUrl: 'https://divitorque.b-cdn.net/dashboard/divi-whatsapp-chat-plugin.jpeg',
            imageAlt: 'Divi WhatsApp Chat',
            title: 'Divi WhatsApp Chat',
            description:
                'Divi WhatsApp Chat is allows you to add a WhatsApp Chat button to your website.',
            url: 'https://divitorque.com/divi-whatsapp-chat/',
        },
        {
            imageUrl: 'https://divitorque.b-cdn.net/dashboard/divi-progallery-banner.jpeg',
            imageAlt: 'Divi Pro Gallery',
            title: 'Divi Pro Gallery',
            description:
                'Create a gallery and include a filter bar for easy navigation between categories.',
            url: 'https://divitorque.com/divi-pro-gallery/',
        },
    ];

    return (
        <div className="w-full max-w-screen-xl mx-auto bg-[#ffffff]">
            <Header />

            <div className="container max-w-[64rem] mx-auto py-[60px]">
                <div className="flex flex-col md:flex-row items-center justify-center mb-10">
                    <h2 className="text-[48px] font-[600]">Our Products</h2>
                </div>

                <section className="flex flex-col md:flex-row">
                    <div className="grid grid-cols-3 gap-5">
                        {plugins.map((plugin, index) => (
                            <div className="grid-item">
                                <IconBox
                                    key={index}
                                    imageUrl={plugin.imageUrl}
                                    imageAlt={plugin.imageAlt}
                                    title={plugin.title}
                                    description={plugin.description}
                                    url={plugin.url}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <CTA />
        </div>
    );
}

export default About;
