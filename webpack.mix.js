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

    // Builder CSS
    .sass('src/modules/style.scss', 'assets/css/builder.css')

    // Frontend CSS
    .sass('src/frontend.scss', 'assets/css/frontend.css')

    // Dashboard CSS
    .sass('src/dashboard/style.scss', 'assets/css/dashboard.css')

    .version();

mix.webpackConfig({
    resolve: {
        extensions: ['.js', '.jsx'],
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
        package: 'Torque Forms Styler',
        domain: 'torque-forms-styler',
        destFile: 'languages/torque-forms-styler.pot',
        relativeTo: './',
        team: 'Divi Torque <hello@divitorque.com>',
    });
}
