/**
 * Created by Leon on 16/11/23.
 */
var webpack = require('webpack');
require("babel-loader")
module.exports = {
    entry: './src/router.js',
    output: {
        path: './dist',
        filename: 'router.min.js'
    },
    module: {
        loaders: [

            {
                test: /\.(js|jsx)$/, //正则表达式匹配 .js 和 .jsx 文件
                loader: 'babel-loader'//,//对匹配的文件进行处理的loader

            }
        ]
    },
    babel: {
        presets: ['es2015']
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};