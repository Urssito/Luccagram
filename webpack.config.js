const path = require('path');
const html = require('html-webpack-plugin');
const devServer = require("webpack-dev-server");

const webpack = {
    mode: 'development',
    entry: './src/app/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.app.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module:{
        rules: [
            {
                test: /\.jsx?$/,
                include: [path.resolve(__dirname,'src','app')],
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
            template: './src/app/index.html'
        })
    ]
}

module.exports = webpack;