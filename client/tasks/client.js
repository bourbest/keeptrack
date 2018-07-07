const webpack = require('webpack')
const path = require('path')
const ManifestPlugin = require('webpack-manifest-plugin')
const {generateBabelEnvLoader, addOptimizationPlugins, getConfig} = require('./common')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const md5 = require('md5')
const buildCache = {}
const NameAllModulesPlugin = require('name-all-modules-plugin')

const getFrontEndPlugins = ({sourcePath, outputPath, appConfig, isProd, useAnalyse}) => {
  const plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isProd ? '"production"' : '"development"',
      'process.env.appConfig': JSON.stringify(appConfig),
      'process.env.target': '"client"'
    }),

    // Give modules a deterministic name for better long-term caching:
    // https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273023082
    new webpack.NamedModulesPlugin(),

    // Give dynamically `import()`-ed scripts a deterministic name for better
    // long-term caching. Solution adapted from:
    // https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
    new webpack.NamedChunksPlugin((chunk) => chunk.name ? chunk.name :
      md5(chunk.mapModules((m) => m.identifier()).join()).slice(0, 10)),

    new webpack.optimize.CommonsChunkPlugin({
      // A name of the chunk that will include the dependencies.
      // This name is substituted in place of [name] from step 1
      name: 'vendor',

      // A function that determines which modules to include into this chunk
      minChunks: module => module.context &&
        module.context.includes('node_modules')
    }),

    // Extract runtime code so updates don't affect app-code caching:
    // https://webpack.js.org/guides/caching/
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',

      // minChunks: Infinity means that no app modules
      // will be included into this chunk
      minChunks: Infinity
    }),

    // Give deterministic names to all webpacks non-"normal" modules
    // https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
    new NameAllModulesPlugin(),

    new ManifestPlugin({
      publicPath: '/public/',
      filename: 'manifest.json'
    })
  ]

  if (isProd) {
    console.log('------------------------------------ OPTIMIZATIONS -----------------------------------')
    addOptimizationPlugins(plugins, useAnalyse)
  }

  if (useAnalyse) {
    console.log('Generating ANALYSE REPORT')
    plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: true
    }))
  }

  return plugins
}

// returns the webpack config required to build the FrontEnd part
module.exports = (params) => {
  const baseConfig = getConfig(params)
  const config = Object.assign({}, baseConfig)
  config.outputPath = path.join(__dirname, '../dist-' + config.app, '/public/')
  config.outputName = config.isProd ? '[name].[chunkhash:10].js' : '[name].js'

  return {
    context: config.sourcePath,
    devtool: config.devTools,
    entry: {
      main: path.join(config.sourcePath, './index.js')
    },
    stats: {
      colors: true,
      reasons: true,
      chunks: false
    },
    output: {
      path: config.outputPath,
      filename: config.outputName,
      publicPath: '/public/'
    },
    cache: buildCache,
    plugins: getFrontEndPlugins(config),
    module: {
      rules: [{
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      generateBabelEnvLoader(['last 2 Chrome versions', 'not Chrome < 60'], config)
    ]},
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: baseConfig.aliases
    },
    devServer: {
      contentBase: config.sourcePath
    }
  }
}

