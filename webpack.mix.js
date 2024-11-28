const mix = require('laravel-mix');
const wpPot = require('wp-pot');
const path = require('path');

mix.setPublicPath('assets')
    .sourceMaps(false)

    // Builder JS
    .js('src/index.js', 'assets/js/builder.js')

    // Dashboard JS
    .js('src/dashboard/index.js', 'assets/js/dashboard.js')

    // Admin JS
    .js('src/utils/cf7-util.js', 'assets/js/cf7-util.js')

    .js('src/admin-notice.js', 'assets/admin/js/admin-notice.js')

    // Builder CSS
    .sass('src/modules/style.scss', 'assets/css/builder.css')

    // Frontend CSS
    .sass('src/frontend.scss', 'assets/css/frontend.css')

    // Dashboard CSS
    .sass('src/dashboard/style.scss', 'assets/css/dashboard.css')

    .version();

mix.webpackConfig({
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            '@DashboardApp': path.resolve(__dirname, 'src/dashboard'),
            '@DashboardComponents': path.resolve(__dirname, 'src/dashboard/components'),
            '@Dependencies': path.resolve(__dirname, 'src/dependencies'),
        },
    },
    externals: {
        $: 'jQuery',
        jquery: 'jQuery',
    },
});

if (mix.inProduction()) {
    wpPot({
        package: 'Contact Form Styler for Divi',
        domain: 'form-styler-for-divi',
        destFile: 'languages/form-styler-for-divi.pot',
        relativeTo: './',
        team: 'DiviEpic <help@diviepic.com>',
    });
}
