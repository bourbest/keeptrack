const fs = require('fs')
const webpack = require('webpack')
const path = require('path')
const {generateBabelEnvLoader, addOptimizationPlugins, getConfig} = require('./common')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const buildCache = {}

const getNodeServerPlugins = ({sourcePath, outputPath, isProd, appConfig}) => {
  const plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isProd ? '"production"' : '"development"',
      'process.env.appConfig': JSON.stringify(appConfig),
      'process.env.target': '"server"'
    }),

    // copy assets to the output dir
    new CopyWebpackPlugin([{
      from: path.join(sourcePath, './assets'),
      to: path.join(outputPath, './public')
    }]),
    new CopyWebpackPlugin([{
      from: path.join(sourcePath, './locales'),
      to: path.join(outputPath, './public/locales')
    }])
  ]

  if (isProd) {
    console.log('------------------------------------ OPTIMIZATIONS -----------------------------------')
    addOptimizationPlugins(plugins)
  }

  return plugins
}

const nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

module.exports = (params) => {
  const baseConfig = getConfig(params)
  const config = Object.assign({}, baseConfig)
  config.outputPath = path.join(__dirname, '../dist-' + config.app)

  return {
    entry: config.sourcePath + '/server/server.js',
    context: config.sourcePath,
    devtool: config.devTools,
    target: 'node',
    externals: nodeModules,
    output: {
      path: config.outputPath,
      filename: 'backend.js'
    },
    stats: {
      colors: true,
      reasons: true,
      chunks: false
    },
    cache: buildCache,
    plugins: getNodeServerPlugins(config),
    module: {
      rules: [generateBabelEnvLoader({node: 'current'}, config)]
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: baseConfig.aliases
    },
    devServer: {
      contentBase: config.sourcePath
    }
  }
}

