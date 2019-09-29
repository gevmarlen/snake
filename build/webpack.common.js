// webpack.common.js

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

function assetsPath(dir) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ? '' : './'

  return path.posix.join(assetsSubDirectory, dir)
}

module.exports = {
  entry: [resolve('src/js/index.ts'), resolve('src/scss/index.scss')],
  output: {
    path: resolve('dist'),
    filename: assetsPath('js/bundle.[chunkhash].js'),
    chunkFilename: assetsPath('js/[name].[chunkhash].js'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        include: resolve('src/js'),
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.pug$/,
        use: {
          loader: 'pug-loader',
          options: {
            pretty: true
          }
        }
      },
      {
        test: /\.(sass|scss|css)$/,
        include: resolve('src/scss'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: assetsPath('images/[name].[ext]')
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: /node_modules/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          mimetype: 'application/font-woff',
          name: assetsPath('fonts/[name].[ext]')
        }
      },
      {
        test: /\.(eot|svg|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: assetsPath('fonts/[name].[ext]')
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './css/style.[hash].css',
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('src/index.pug')
    }),
    new CopyWebpackPlugin([
      {
        from: './src/static',
        to: './'
      }
    ])
  ]
}
