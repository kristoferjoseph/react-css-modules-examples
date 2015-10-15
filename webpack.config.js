var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var postcssImport = require('postcss-import')
var customProperties = require('postcss-custom-properties')
var colorScale = require('postcss-color-scale')
var autoprefixer = require('autoprefixer')
var devServer

devServer = {
    contentBase: __dirname + '/endpoint',
    colors: true,
    quiet: false,
    noInfo: false,
    publicPath: '/',
    historyApiFallback: true,
    host: '127.0.0.1',
    port: 8000,
    hot: true
};

module.exports = {
    devtool: 'source-map',
    debug: false,
    devServer: devServer,
    context: __dirname + '/src',
    entry: {
        app: [
            './'
        ]
    },
    output: {
        path: __dirname + '/endpoint',
        filename: '[name].js',
        publicPath: devServer.publicPath
    },
    plugins: [
        new ExtractTextPlugin('app.css', {
            allChunks: true
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.OldWatchingPlugin(),
        // new webpack.NewWatchingPlugin(),
        // https://github.com/webpack/docs/wiki/optimization#deduplication
        // new webpack.optimize.DedupePlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                  'style',
                  'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
                )
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, './src'),
                loader: 'babel'
            }
        ]
    },
    postcss: function() {
      return [
        postcssImport({
          onImport: function (files) {
              files.forEach(this.addDependency);
          }.bind(this)
        }),
        colorScale(),
        customProperties(),
        autoprefixer
      ]
    },
    resolve: {
        // root: path.resolve(__dirname, 'node_modules'),
        extensions: [
            '',
            '.js'
        ]
    }
};
