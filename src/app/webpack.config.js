const path = require('path');
const html = require('html-webpack-plugin');
const devServer = require("webpack-dev-server");

const webpack = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.app.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        fallback: {'http': require.resolve('stream-http')}
    },
    module:{
        rules: [
            {
                test: /\.jsx?$/,
                include: [path.resolve(__dirname,'src')],
                exclude: [path.resolve(__dirname,'node_modules')],
                use:{
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                }
            }
        ]
    },
    devServer: {
        historyApiFallback: true
    },
    plugins: [
        new html({
            template: './src/index.html'
        })
    ]
}

module.exports = webpack;