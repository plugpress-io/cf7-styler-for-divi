const mix = require('laravel-mix');
const wpPot = require('wp-pot');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

mix.setPublicPath('assets')
    .sourceMaps(false)

    // Builder JS
    .js('src/divi-4/index.js', 'assets/js/builder.js')

    // Dashboard App
    .js('src/dashboard/index.js', 'assets/js/dashboard.js')

    // External JS
    .js('src/externalJS/paw-countdown.js', 'assets/js/paw-countdown.js')

    // Module Frontend JS
    .js('src/divi-4/modules/TorqAlert/frontend.js', 'assets/js/modules/torq-alert.js')
    .js('src/divi-4/modules/TorqCarousel/frontend.js', 'assets/js/modules/torq-carousel.js')
    .js('src/divi-4/modules/TorqCompareImage/frontend.js', 'assets/js/modules/torq-compare-image.js')
    .js('src/divi-4/modules/TorqLogoCarousel/frontend.js', 'assets/js/modules/torq-logo-carousel.js')
    .js('src/divi-4/modules/TorqImageScroll/frontend.js', 'assets/js/modules/torq-image-scroll.js')
    .js('src/divi-4/modules/TorqVideoModal/frontend.js', 'assets/js/modules/torq-video-modal.js')
    .js('src/divi-4/modules/TorqTimeline/frontend.js', 'assets/js/modules/torq-timeline.js')
    .js('src/divi-4/modules/TorqContentToggle/frontend.js', 'assets/js/modules/torq-content-toggle.js')
    .js('src/divi-4/modules/TorqHorizontalTimeline/frontend.js', 'assets/js/modules/torq-horizontal-timeline.js')
    .js('src/divi-4/modules/TorqSocialShare/frontend.js', 'assets/js/modules/torq-social-share.js')
    .js('src/divi-4/modules/TorqLottie/frontend.js', 'assets/js/modules/torq-lottie.js')
    .js('src/divi-4/modules/TorqImageZoom/frontend.js', 'assets/js/modules/torq-image-zoom.js')
    .js('src/divi-4/modules/TorqHotspots/frontend.js', 'assets/js/modules/torq-hotspot.js')

    // New Modules Frontend JS
    .js('src/divi-4/modules/Countdown/frontend.js', 'assets/js/modules/countdown.js')
    .js('src/divi-4/modules/PricingTable/frontend.js', 'assets/js/modules/pricing-table.js')
    .js('src/divi-4/modules/FilterableGallery/frontend.js', 'assets/js/modules/filterable-gallery.js')
    .js('src/divi-4/modules/InstagramFeed/frontend.js', 'assets/js/modules/instagram-feed.js')

    // Builder styles
    .sass('src/divi-4/style.scss', 'assets/css/builder.css')

    // Frontend styles
    .sass('src/frontend.scss', 'assets/css/frontend.css')

    // Dashboard styles
    .sass('src/dashboard/style.scss', 'assets/css/dashboard.css')

    // Module styles
    .sass('src/divi-4/modules/TorqDivider/style.scss', 'assets/css/modules/torq-divider.css')
    .sass('src/divi-4/modules/TorqTeam/style.scss', 'assets/css/modules/torq-team.css')
    .sass('src/divi-4/modules/TorqAlert/style.scss', 'assets/css/modules/torq-alert.css')
    .sass('src/divi-4/modules/TorqBusinessHour/style.scss', 'assets/css/modules/torq-business-hour.css')
    .sass('src/divi-4/modules/TorqInfoCard/style.scss', 'assets/css/modules/torq-info-card.css')
    .sass('src/divi-4/modules/TorqContactForm7/style.scss', 'assets/css/modules/torq-contact-form7.css')
    .sass('src/divi-4/modules/TorqFlipBox/style.scss', 'assets/css/modules/torq-flip-box.css')
    .sass('src/divi-4/modules/TorqIconBox/style.scss', 'assets/css/modules/torq-icon-box.css')
    .sass('src/divi-4/modules/TorqCarousel/style.scss', 'assets/css/modules/torq-carousel.css')
    .sass('src/divi-4/modules/TorqCompareImage/style.scss', 'assets/css/modules/torq-compare-image.css')
    .sass('src/divi-4/modules/TorqBlurb/style.scss', 'assets/css/modules/torq-blurb.css')
    .sass('src/divi-4/modules/TorqLogoCarousel/style.scss', 'assets/css/modules/torq-logo-carousel.css')
    .sass('src/divi-4/modules/TorqLogoList/style.scss', 'assets/css/modules/torq-logo-list.css')
    .sass('src/divi-4/modules/TorqReviewCard/style.scss', 'assets/css/modules/torq-review-card.css')
    .sass('src/divi-4/modules/TorqImageScroll/style.scss', 'assets/css/modules/torq-image-scroll.css')
    .sass('src/divi-4/modules/TorqProgressBar/style.scss', 'assets/css/modules/torq-progress-bar.css')
    .sass('src/divi-4/modules/TorqTestimonial/style.scss', 'assets/css/modules/torq-testimonial.css')
    .sass('src/divi-4/modules/TorqVideoModal/style.scss', 'assets/css/modules/torq-video-modal.css')
    .sass('src/divi-4/modules/TorqHeading/style.scss', 'assets/css/modules/torq-heading.css')
    .sass('src/divi-4/modules/TorqTimeline/style.scss', 'assets/css/modules/torq-timeline.css')
    .sass('src/divi-4/modules/TorqContentToggle/style.scss', 'assets/css/modules/torq-content-toggle.css')
    .sass('src/divi-4/modules/TorqHorizontalTimeline/style.scss', 'assets/css/modules/torq-horizontal-timeline.css')
    .sass('src/divi-4/modules/TorqSocialShare/style.scss', 'assets/css/modules/torq-social-share.css')
    .sass('src/divi-4/modules/TorqLottie/style.scss', 'assets/css/modules/torq-lottie.css')
    .sass('src/divi-4/modules/TorqSVG/style.scss', 'assets/css/modules/torq-svg.css')
    .sass('src/divi-4/modules/TorqImageZoom/style.scss', 'assets/css/modules/torq-image-zoom.css')
    .sass('src/divi-4/modules/TorqRestroMenu/style.scss', 'assets/css/modules/torq-restro-menu.css')
    .sass('src/divi-4/modules/TorqHotspots/style.scss', 'assets/css/modules/torq-hotspot.css')

    // New Modules styles
    .sass('src/divi-4/modules/Countdown/style.scss', 'assets/css/modules/torq-countdown.css')
    .sass('src/divi-4/modules/PricingTable/style.scss', 'assets/css/modules/torq-pricing-table.css')
    .sass('src/divi-4/modules/BasicList/style.scss', 'assets/css/modules/torq-basic-list.css')
    .sass('src/divi-4/modules/IconList/style.scss', 'assets/css/modules/torq-icon-list.css')
    .sass('src/divi-4/modules/CheckmarkList/style.scss', 'assets/css/modules/torq-checkmark-list.css')
    .sass('src/divi-4/modules/StarRating/style.scss', 'assets/css/modules/torq-star-rating.css')
    .sass('src/divi-4/modules/StatsGrid/style.scss', 'assets/css/modules/torq-stats-grid.css')
    .sass('src/divi-4/modules/FilterableGallery/style.scss', 'assets/css/modules/torq-filterable-gallery.css')
    .sass('src/divi-4/modules/InstagramFeed/style.scss', 'assets/css/modules/torq-instagram-feed.css')

    .version();

mix.webpackConfig({
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: '**/module.json',
                    context: 'src/divi-5/modules/components',
                    to: path.resolve(__dirname, 'includes/modules/divi-5/modules-json'),
                },
            ],
        }),
    ],

    resolve: {
        extensions: ['.js', 'jsx'],
        alias: {
            '@DashboardApp': path.resolve(__dirname, 'src/dashboard/app'),
            '@DashboardComponents': path.resolve(__dirname, 'src/dashboard/app/components'),
            '@Modules': path.resolve(__dirname, 'src/divi-4/modules'),
            '@ExternalJS': path.resolve(__dirname, 'src/externalJS'),
            '@Dependencies': path.resolve(__dirname, 'src/divi-4/dependencies'),
        },
    },
    externals: {
        $: 'jQuery',
        jquery: 'jQuery',
    },
});

if (mix.inProduction()) {
    wpPot({
        package: 'Divi Torque',
        domain: 'divitorque',
        destFile: 'languages/divitorque.pot',
        relativeTo: './',
        team: 'WPPaw <hello@wppaw.com>',
    });
}
