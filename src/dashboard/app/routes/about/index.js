import React from 'react';
import {IconBox, FeatureBox} from '@DashboardApp/components';

function About() {
    const modules = {
        modules: [
            {
                imageUrl:
                    'https://cdn.divitorque.com/spai/q_lossy+w_80+to_webp+ret_img/divitorque.com/wp-content/uploads/2023/10/image-carousel.svg',
                imageAlt: 'Image Carousel',
                title: 'Image Carousel',
                description: 'Enhance your web pages with the dynamic flair of the Image Carousel.',
                url: 'https://divitorque.com/image-carousel-module/',
            },
            {
                imageUrl:
                    'https://cdn.divitorque.com/spai/q_lossy+w_80+to_webp+ret_img/divitorque.com/wp-content/uploads/2023/10/lottie.svg',
                imageAlt: 'Lottie Animation',
                title: 'Lottie Animation',
                description:
                    'Unleash the magic of motion with the Lottie Animation module, seamlessly integrated with Divi Builder.',
                url: 'https://divitorque.com/lottie-animation-module/',
            },
            {
                imageUrl:
                    'https://cdn.divitorque.com/spai/q_lossy+w_80+to_webp+ret_img/divitorque.com/wp-content/uploads/2023/10/toggle.svg',
                imageAlt: 'Content Toggle',
                title: 'Content Toggle',
                description:
                    'Save space and enhance the user experience by revealing additional content through an interactive toggle function.',
                url: 'https://divitorque.com/content-toggle-module/',
            },
            {
                imageUrl:
                    'https://cdn.divitorque.com/spai/q_lossy+w_80+to_webp+ret_img/divitorque.com/wp-content/uploads/2023/10/Timeline.svg',
                imageAlt: 'Timeline Module',
                title: 'Timeline Module',
                description:
                    'Present a chronological sequence of events, achievements, or milestones with our visually appealing timeline module.',
                url: 'https://divitorque.com/vertical-timeline-module/',
            },
            {
                imageUrl:
                    'https://cdn.divitorque.com/spai/q_lossy+w_80+to_webp+ret_img/divitorque.com/wp-content/uploads/2023/10/heading.svg',
                imageAlt: 'Gradient Heading',
                title: 'Gradient Heading',
                description:
                    'Add visual interest to your headings with stunning gradient effects that accentuate your content and capture attention.',
                url: 'https://divitorque.com/gradient-heading-module/',
            },
            {
                imageUrl:
                    'https://cdn.divitorque.com/spai/q_lossy+w_80+to_webp+ret_img/divitorque.com/wp-content/uploads/2023/10/Modal.svg',
                imageAlt: 'Video Modal',
                title: 'Video Modal',
                description:
                    'Embed videos in a sleek and responsive modal, providing a seamless viewing experience for your users.',
                url: 'https://divitorque.com/video-popup-module/',
            },
            {
                imageUrl:
                    'https://cdn.divitorque.com/spai/q_lossy+w_80+to_webp+ret_img/divitorque.com/wp-content/uploads/2023/10/social-share.svg',
                imageAlt: 'Social Share',
                title: 'Social Share Buttons',
                description:
                    'Encourage social sharing with our sleek, easy-to-use social share buttons, fostering increased engagement and brand visibility.',
                url: 'https://divitorque.com/social-share-module/',
            },
            {
                imageUrl:
                    'https://cdn.divitorque.com/spai/q_lossy+w_80+to_webp+ret_img/divitorque.com/wp-content/uploads/2023/10/testimonial.svg',
                imageAlt: 'Testimonial',
                title: 'Testimonial Module',
                description:
                    'Showcase customer testimonials in an elegant and professional format that reinforces your brand’s reputation and trustworthiness.',
                url: 'https://divitorque.com/testimonial-module/',
            },
            {
                imageUrl:
                    'https://cdn.divitorque.com/spai/q_lossy+w_80+to_webp+ret_img/divitorque.com/wp-content/uploads/2023/10/review.svg',
                imageAlt: 'Product Review',
                title: 'Product Review',
                description:
                    'Highlight customer feedback with eye-catching review cards that build trust and credibility for your brand.',
                url: 'https://divitorque.com/review-module/',
            },
        ],
    };

    return (
        <div className="w-full max-w-screen-xl mx-auto bg-[#ffffff]">
            <section className="bg-[#f6e8d2] py-[60px] text-center">
                <div className="container max-w-[50rem] mx-auto flex flex-col items-center justify-center">
                    <h1 className="text-[60px] font-[700] mb-4">
                        The Most Premium Divi Builder Addons
                    </h1>
                    <p className="text-gray-600 text-[18px] mb-[50px] px-[50px]">
                        40+ Cutting-Edge Divi Modules and extensions. Save time by using
                        ready-to-use modules and build your website faster
                    </p>
                    <a
                        href="https://divitorque.com/"
                        className="bg-[#FF6900] text-white font-bold text-base px-8 py-3.5 rounded hover:bg-[#FF5900] hover:shadow-lg transition duration-200 ease-in-out mb-20 hover:text-slate-50"
                        target="__blank"
                    >
                        Get Divi Torque Pro
                    </a>
                </div>
                <div className="container px-10 flex flex-col items-center justify-center">
                    <img
                        src="https://cdn.divitorque.com/spai/q_lossy+w_2360+to_webp+ret_img/divitorque.com/wp-content/uploads/2023/10/hero-image-1.png"
                        alt="Divi Torque Pro"
                    />
                </div>
            </section>

            <div className="container max-w-[64rem] mx-auto py-[60px]">
                <div className="flex flex-col md:flex-row items-center justify-center mb-10">
                    <h2 className="text-[48px] font-[600]">Powerful Divi Modules</h2>
                </div>

                <FeatureBox
                    imageUrl="https://cdn.divitorque.com/spai/q_lossy+w_1145+to_webp+ret_img/divitorque.com/wp-content/uploads/2023/10/InstagramModule.png"
                    imageAlt="Instagram Feed"
                    title="Instagram Feed"
                    description="Enhance user experience and boost brand visibility by integrating captivating live feeds from your Instagram profile(s) into your website using our user-friendly and adaptable Instagram module."
                    imagePosition="left"
                />

                <FeatureBox
                    imageUrl="https://cdn.divitorque.com/spai/q_lossy+w_1145+to_webp+ret_img/divitorque.com/wp-content/uploads/2023/10/FilterableGalleryModule.png"
                    imageAlt="Filterable Gallery"
                    title="Filterable Gallery"
                    description="Elevate your visual showcase with the Filterable Gallery module. Effortlessly organize and display high-quality images with dynamic filtering options in a beautifully crafted layout."
                    imagePosition="right"
                />

                <section className="flex flex-col md:flex-row">
                    <div class="grid grid-cols-3 gap-5">
                        {modules.modules.map((module) => (
                            <IconBox
                                imageUrl={module.imageUrl}
                                imageAlt={module.imageAlt}
                                title={module.title}
                                description={module.description}
                                url={module.url}
                            />
                        ))}
                    </div>
                </section>

                <div className="flex flex-col md:flex-row items-center justify-center my-20">
                    <a
                        href="https://divitorque.com/divi-modules"
                        className="bg-[#fff] text-[#FF6900] font-bold text-base px-8 py-3.5 rounded border-2 border-[#FF6900] transition duration-200 ease-in-out hover:text-[#FF4000] hover:border-[#FF4000] hover:shadow-lg"
                        target="_blank"
                    >
                        All Modules
                    </a>
                </div>
            </div>

            <section className="bg-[#0A236D] py-16 text-center">
                <div className="container max-w-[50rem] mx-auto flex flex-col items-center justify-center">
                    <h2 className="text-[48px] font-bold mb-4 text-slate-50">
                        Supercharge your website-building journey like never before.
                    </h2>
                    <p className="text-slate-200 mb-8">
                        40+ Modules & Extensions, and a vast selection of 100+ Ready-to-Use
                        Wireframe Sections.
                    </p>
                    <a
                        href="https://divitorque.com/"
                        className="bg-[#FF6900] text-white font-bold text-base px-8 py-3.5 rounded hover:bg-[#FF5900] hover:shadow-lg transition duration-200 ease-in-out hover:text-slate-50"
                    >
                        Get Divi Torque Pro
                    </a>
                </div>
            </section>
        </div>
    );
}

export default About;
