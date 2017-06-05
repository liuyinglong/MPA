let path = require('path');
let fs = require("fs");
let webpack = require('webpack');
// 将样式提取到单独的 css 文件中，而不是打包到 js 文件或使用 style 标签插入在 head 标签中
let ExtractTextPlugin = require('extract-text-webpack-plugin');
// 生成自动引用 js 文件的HTML
let HtmlWebpackPlugin = require('html-webpack-plugin');

let glob = require('glob');

/**
 * 返回文件夹列表
 * @param path
 * @returns {Array}
 */
function getDirList(path = "./") {
    let fileList = fs.readdirSync(path);
    let dirListAry = [];
    for (let i = 0; i < fileList.length; i++) {
        let stats = fs.statSync(path + fileList[i]);
        if (stats.isDirectory()) {
            dirListAry.push(fileList[i])
        }
    }
    return dirListAry;
}

/**
 * 判断该目录下是否存在该类型文件
 * @param path
 * @param suffix
 * @returns {Array}
 */
function suffix(path, suffix) {
    let fileList = fs.readdirSync(path);
    let fileAry = [];
    let reg = new RegExp(suffix + "$", "i");
    for (let i = 0; i < fileList.length; i++) {
        let stats = fs.statSync(path + fileList[i]);
        if (stats.isFile() && reg.test(fileList[i])) {
            fileAry.push(fileList[i]);
        }
    }
    return fileAry;
}

/**
 * 判断文件是否存在
 * @param path
 * @returns {boolean}
 */
function fsExistsSync(path) {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * @param globPath
 * @returns {{}}
 */
function getPath(globPath) {
    let entries = {};
    glob.sync(globPath).forEach(function (filePath) {
        let pathname = filePath.split("/").slice(-2).join("/");
        pathname = pathname.split(".");
        pathname.pop();
        pathname = pathname.join("");
        entries[pathname] = filePath;
    });
    console.log(entries);
    return entries;
}


let entries = getPath("./src/page/*/*.js");

for (let k in entries) {
    entries[k] = ['babel-polyfill', entries[k]];
}

let chunks = Object.keys(entries);

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
                test: /\.(jpg|gif|png|svg)$/,
                loader: "url-loader",
                options: {
                    name: 'images/[name].[ext]?[hash]',
                    limit: 4096
                }
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader?importLoaders=1",
                    {
                        loader: "postcss-loader",
                    },
                    "sass-loader"
                ]
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            "@": path.resolve(__dirname, "./src")
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        host: "192.168.1.53",
        port: "8080",
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
        new webpack.BannerPlugin(function () {
            return "version:1.0.0 \n" +
                "author:liuyinglong \n" +
                "date:" + new Date() + " \n" +
                "mail:liuyinglong@utimes.cc"
        }())
    ],
    devtool: '#eval-source-map'
};


for (let pathname in entries) {
    let config = {
        filename: pathname + ".html",
        template: fsExistsSync("./src/page/" + pathname + ".html") ? "./src/page/" + pathname + ".html" : "./src/htmlTemplate/template.html",
        inject: true,
        chunks: ["polyfill", "vendors/vendors", pathname],
        hash: true
    };
    module.exports.plugins.push(new HtmlWebpackPlugin(config));
}


if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
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


