const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const childProcess = require('child_process')

function RemoveFilesPlugin(options) {
  this.outputFolder = options.outputFolder
}

RemoveFilesPlugin.prototype.apply = function (compiler) {
  const fs = require('fs')
  var self = this
  compiler.plugin('emit', function (compilation, callback) {
    console.log('RemoveFilesPlugin: Remove main and vendor file from ' + self.outputFolder)
    try {
      fs.readdir(self.outputFolder, (err, files) => {
        if (err) {
          console.log('Error when loading dir ' + err)
        } else {
          let now = new Date()
          files.forEach(file => {
            if (file.indexOf('main.') !== -1 || file.indexOf('vendor.') !== -1) {
              let filePath = self.outputFolder + file
              fs.stat(filePath, (staterr, stats) => {
                if (!staterr) {
                  let modifDate = new Date(Date.parse(stats.mtime))
                  if (((now - modifDate) / 60000) > 10) {
                    fs.unlink(filePath, (err) => {
                      if (err) {
                        console.log('RemoveFilesPlugin: error removing ' + file)
                      } else {
                        console.log('RemoveFilesPlugin: remove ' + file)
                      }
                    })
                  }
                }
              })
            }
          })
        }
      })
    }
    catch(error){
      console.log(error)
    }
    callback()
  })
}

module.exports = (env, params) => {
  if (!env.app) {
    env.app = 'shop'
  }
  const app = env.app
  const ENV = (env && env.server) || 'dev'
  const isDev = ENV === 'dev'
  const isQA = ENV === 'qa'
  const isProd = ENV === 'prod'

  const configFilename = `./config/config.${ENV}.js`
  const appConfig = require(configFilename)

  console.info('Building client for environement', ENV)
  console.info('Building client for application', app)
  console.info('Related config:', appConfig)

  const sourcePath = path.join(__dirname, './')
  const outputPath = path.join(__dirname, './dist-' + app, '/public/')

  const gitBranchName = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString()
  let sprintNumber = ''

  if (gitBranchName.length > 0) {
    if (gitBranchName.includes('sprint') && gitBranchName.length >= 9) {
      sprintNumber = gitBranchName.substring(7, 9)
    } else {
      sprintNumber = gitBranchName.substring(1, 3)
    }
  }

  const version = `Chinook - ${sprintNumber}`
  const commithash = childProcess.execSync('git rev-parse HEAD').toString()

  const webpackConfig = {
    context: sourcePath,
    devtool: isDev || isQA ? 'eval' : void 0,
    entry: {
      main: ['babel-polyfill', path.join(sourcePath, './index.js')],
      vendor: ['lodash', 'moment', 'react', 'react-dom']
    },
    stats: {
      colors: true,
      reasons: true,
      chunks: false
    },
    output: {
      path: outputPath,
      filename: '[name].[hash].bundle.js',
      publicPath: '/public/'
    },
    module: {
      rules: [
        // linter
        {
          enforce: 'pre',
          test: /\.jsx?$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        },
        // ES6
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [['es2015', { module: false }], 'stage-0', 'react']
            }
          }]
        },

        // Styles
        { test: /\.css$/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }] },
        { test: /\.scss$/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }] },

        // JSON
        { test: /\.json$/, use: [{ loader: 'json-loader' }] },

        // Images
        { test: /\.png$/, use: [{ loader: 'url-loader', options: { limit: 100000 } }] },
        { test: /\.jpg$/, use: [{ loader: 'file-loader' }] },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: [{ loader: 'file-loader', options: { mimetype: 'image/svg+xml' } }] },

        // Fonts
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          use: [{ loader: 'file-loader', options: { mimetype: 'application/font-woff' } }]
        },
        {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          use: [{ loader: 'file-loader', options: { mimetype: 'application/font-woff' } }]
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: [{ loader: 'file-loader', options: { mimetype: 'application/octet-stream' } }]
        },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: [{ loader: 'file-loader' }] }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    },

    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: !isDev
      }),
      new webpack.DefinePlugin({
        'process.env.appConfig': JSON.stringify(appConfig),
        'process.env.version': JSON.stringify(version),
        'process.env.commithash': JSON.stringify(commithash),
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'dev')
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'vendor.[hash].bundle.js'
      }),
      new RemoveFilesPlugin({ outputFolder: outputPath }),
      new CopyWebpackPlugin([{
        from: path.join(sourcePath, './assets'),
        to: path.join(outputPath)
      }]),
      new CopyWebpackPlugin([{
        from: path.join(sourcePath, './locales'),
        to: path.join(outputPath, './locales')
      }]),
      new HtmlWebpackPlugin({
        template: path.join(sourcePath, './server/template.html'),
        filename: path.join(outputPath, '../scripts.html')
      })
    ],
    devServer: {
      contentBase: sourcePath
    }
  }
  if (!isDev) {
    webpackConfig.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        output: { comments: false },
        sourceMap: false
      })
    )
  }
  return webpackConfig
}
