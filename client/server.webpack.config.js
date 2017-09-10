var webpack = require('webpack')
var path = require('path')
var fs = require('fs')
const childProcess = require('child_process')

var nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

module.exports = (env, params) => {
  console.log('params server', JSON.stringify(params))
  const app = env.app
  const ENV = (env && env.server) || 'dev'
  const isDev = ENV === 'dev'
  const isProd = ENV === 'prod'

  const configFilename = `./config/config.${ENV}.js`
  const appConfig = require(configFilename)

  const gitBranchName = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString()
  let sprintNumber = ''

  if (gitBranchName.length > 0) {
    if (gitBranchName.includes('sprint') && gitBranchName.length >= 9) {
      sprintNumber = gitBranchName.substring(7, 9)
    } else {
      sprintNumber = gitBranchName.substring(1, 3)
    }
  }

  const version = `Keep track - ${sprintNumber}`
  const commithash = childProcess.execSync('git rev-parse HEAD').toString()

  console.info('Building server for environement', ENV )
  console.info('Building server for application', app )
  console.info('Related config:', appConfig)

  const sourcePath = path.join(__dirname, './')
  const outputPath = path.join(__dirname, './dist-' + app)

  let webpackConfig = {
    entry: sourcePath + '/server/server.js',
    devtool: false,
    target: 'node',
    output: {
      path: outputPath,
      filename: 'backend.js'
    },
    externals: nodeModules,
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
              presets: [ ['es2015', { module: false }], 'stage-0', 'react' ]
            }
          }]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.appConfig': JSON.stringify(appConfig),
        'process.env.version': JSON.stringify(version),
        'process.env.commithash': JSON.stringify(commithash),
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'dev')
      })
    ]
  }

  if (!isDev) {
    webpackConfig.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        output: { comments: false },
        sourceMap: false
      }))
  }
  return webpackConfig
}
