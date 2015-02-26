var webpack = require('webpack');
var path = require('path');

var src = path.join(__dirname,  'src');

module.exports = {

  entry: {
    app: './src/app',
    test: ['mocha!./test/mapevent', 'mocha!./test/components/EventApp'],
    // vendor: ['react','lodash/utility/range', 'lodash/number/random']
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader?harmony' }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['src', 'node_modules'],
    alias: {
      'facebook-events': src
    }
  },

  plugins: [
    // new webpack.optimize.CommonsChunkPlugin('vendor', 'shared.js')
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    })
  ]

};
