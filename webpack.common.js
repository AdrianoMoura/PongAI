const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            options: {
                presets: ['es2015']
            }
        },{ 
            test: /\.(otf)$/, 
            loader: "file" 
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'head'
        }),
        new CopyWebpackPlugin([
            { from: 'static' }
        ])
    ]
};