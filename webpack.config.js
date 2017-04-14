var path = require('path');
var webpack = require('webpack');
// 将样式提取到单独的 css 文件中，而不是打包到 js 文件或使用 style 标签插入在 head 标签中
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// 生成自动引用 js 文件的HTML
var HtmlWebpackPlugin = require('html-webpack-plugin');
var glob = require('glob');


function getPath(globPath) {
    var entries = {};
    glob.sync(globPath).forEach(function (filePath) {
        var pathname = filePath.split("/").slice(-2).join("/");
        pathname = pathname.split(".");
        pathname.pop();
        pathname = pathname.join("");
        entries[pathname] = filePath;
    });
    console.log(entries);
    return entries;
}

var entries = getPath("./src/page/*/*.js");

for (var k in entries) {
    entries[k] = ['babel-polyfill', entries[k]];
}
console.log(entries);


var chunks = Object.keys(entries);
module.exports = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: 'js/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(jpg|gif|svg)$/,
                loader: "url-loader",
                options: {
                    name: '[name].[ext]?[hash]',
                    limit: 4096
                }
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader?importLoaders=1",
                    {
                        loader: "postcss-loader",
                        // options: {
                        //     plugins: function () {
                        //         return [
                        //             require('precss'),
                        //             require('autoprefixer') //({browsers: ['ie>=8', '>1% in CN']})
                        //         ];
                        //     }
                        // }
                    },
                    "sass-loader"
                ]
            }
        ]
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        contentBase: path.join(__dirname, "dist")
    },
    performance: {
        hints: false
    },
    plugins: [
        //提取公共模块
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors/vendors', // 公共模块的名称
            chunks: chunks,  // chunks 是需要提取的模块
            minChunks: 2
        }),
    ],
    devtool: '#eval-source-map'
};

var pages = getPath("./src/page/*/*.html");
for (var pathname in pages) {
    var config = {
        filename: pathname + ".html",
        template: pages[pathname],
        inject: true
    };
    if (pathname in module.exports.entry) {
        config.chunks = ["polyfill", "vendors/vendors", pathname];
        config.hash = true;
    }
    module.exports.plugins.push(new HtmlWebpackPlugin(config));
}


if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}


