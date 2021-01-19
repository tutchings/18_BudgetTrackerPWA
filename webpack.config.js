const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
    entry: {
        index: './public/index.js'
    },
    output: {
        path: __dirname + '/public/dist',
        filename: '[name].bundle.js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    plugins: [
        new WebpackPwaManifest({
            fingerprints: false,
            name: '18_budgetTrackerPWA',
            short_name: 'budgetTracker',
            description: 'Downloadable application that allows a user to track money spending.',
            background_color: '#ffffff',
            theme_color: '#ffffff',
            start_url: '/',
            icons: [
                {
                    src: path.resolve('public/icons/icon-192x192.png'),
                    sizes: [96, 128, 192, 256, 384, 512],
                    destination: path.join('assets', 'icons'),
                },
            ],
        }),
    ],
};

module.exports = config;