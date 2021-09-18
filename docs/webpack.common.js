const QuickPaperLoaderPlugin = require('quick-paper/loader-plug/index.js');
const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('./package.json'));

module.exports = {
    entry: ['./src/entry.js'],
    output: {
        path: __dirname,
        filename: 'dist/clunch-doc@v' + pkg.version + '.js',
        chunkFilename: 'dist/clunch-doc@v' + pkg.version + '-bundle[name].js'
    },
    resolve: {
        alias: {
            'clunch': require('path').resolve('../dist/clunch-template.js')
        }
    },
    module: {
        rules: [{
            test: /\.html$/,
            exclude: /node_modules/,
            loader: ['./build/examples-html-loader.js']
        }, {
            test: /\.clunch$/,
            exclude: /node_modules/,
            loader: ['../loader.js']
        }, {
            test: /\.paper$/,
            exclude: /node_modules/,
            loader: ['quick-paper/loader/index.js']
        }, {
            test: /\.css$/,
            loader: ['quick-paper/style-loader/index.js', 'css-loader', 'postcss-loader', './scss-loader.js']
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.(png|jpg|jpeg|gif|bmp)$/,
            loader: [{
                loader: "url-loader",
                options: {
                    name: "dist/[name].[ext]",
                    context: "src/asset",
                    limit: 5000
                }
            }]
        }]
    },
    plugins: [
        new QuickPaperLoaderPlugin()
    ]
};
