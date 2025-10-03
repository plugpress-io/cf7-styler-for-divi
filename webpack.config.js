const path = require('path');
const wpPot = require('wp-pot');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        builder4: ['./src/index.js'],
        utils: ['./src/utils/index.js'],
        frontend4: ['./src/frontend.js'],
        'admin-notice': ['./src/admin-notice.js'],
    },
    watch: !isProduction,
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@Dependencies': path.resolve(__dirname, 'src/modules/divi-4/dependencies'),
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
    ],

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                        },
                    },
                ],
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [require('tailwindcss'), require('autoprefixer')],
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: !isProduction,
                            sassOptions: {
                                outputStyle: isProduction ? 'compressed' : 'expanded',
                                includePaths: [path.resolve(__dirname, 'src')],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[ext]',
                            outputPath: 'imgs/',
                            publicPath: '../imgs/',
                            esModule: false,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'imgs/',
                            publicPath: '../imgs/',
                            esModule: false,
                        },
                    },
                ],
            },
        ],
    },

    externals: {
        $: 'jQuery',
        jquery: 'jQuery',
    },

    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },

    mode: isProduction ? 'production' : 'development',

    stats: {
        errorDetails: true,
    },
};

// POT file generation in production mode
if (isProduction) {
    wpPot({
        package: 'CF7 Styler for Divi',
        domain: 'cf7-styler-for-divi',
        destFile: 'languages/cf7-styler-for-divi.pot',
        relativeTo: './',
        team: 'DiviExtensions <support@diviextensions.com>',
    });
}
