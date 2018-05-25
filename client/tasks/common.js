const webpack = require('webpack')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const generateBabelEnvLoader = (browserList, {isProd, aliases}) => {
  // si array, browserList, sinon objet avec les targets
  const targets = browserList.length ? {browsers: browserList} : browserList
  const ret = {
    test: /\.jsx?$/,
    use: {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        cacheDirectory: true,
        presets: [
          ['env', {
            debug: false,
            modules: false,
            useBuiltIns: true,
            targets
          }],
          'react'
        ],
        plugins: [
          'transform-object-rest-spread',
          'lodash',
          'lodash-fp'
        ]
      }
    }
  }

  ret.use.options.plugins.push(['module-resolver', {
    alias: aliases
  }])

  if (isProd) {
    ret.use.options.plugins.push('transform-semantic-ui-react-imports')

    ret.use.options.plugins.push(
      ['transform-react-remove-prop-types', {
        removeImport: true
      }]
    )
  }

  return ret
}

const addOptimizationPlugins = (plugins, useAnalyse) => {
  plugins.push(new UglifyJsPlugin({
    parallel: true,
    uglifyOptions: {
      ecma: 8,
      compress: {warnings: false},
      sourceMap: false,
      output: {comments: false, beautify: false}
    }
  }))

  // module concatenation produces bad tree dependencies in Analyse report
  if (!useAnalyse) {
    plugins.push(new webpack.optimize.ModuleConcatenationPlugin())
  }
}

const createCompiler = (config) => {
  const compiler = webpack(config)
  return new Promise((resolve, reject) => {
    console.log('compiling...', config.target)
    compiler.run((err, stats) => {
      if (err) {
        console.log('compile err', err)
        return reject(err)
      }
      console.log(stats.toString({colors: true}) + '\n')
      resolve()
    })
  })
}

const getBuildParameters = (argv) => {
  const KNOWN_ENV = ['prod', 'dev']
  // the first 2 parameters are node and build.js, so skip them
  const ret = {server: 'dev'}
  for (let i = 2; i < argv.length; i++) {
    const param = argv[i]
    if (KNOWN_ENV.indexOf(param) > -1) {
      ret.server = param
    } else if (param === 'source-map') {
      ret.useSourceMap = true
    } else if (param === 'analyse') {
      ret.useAnalyse = true
    } else {
      const knownEnvs = KNOWN_ENV.join(', ')
      throw new Error(`unknown parameter "${param}". Known env are : [${knownEnvs}]. You can specify 'source-map' if you want to build them`)
    }
  }

  ret.app = 'kt'
  return ret
}

const getConfig = (params) => {
  const ENV = params.server || 'dev'
  const app = params.app || 'kt'
  const isProd = ENV !== 'dev'

  let devTools = void 0

  if (params.useSourceMap) {
    devTools = 'source-map'
  } else if (!isProd) {
    devTools = 'cheap-module-eval-source-map'
  }

  const sourcePath = path.join(__dirname, '../')

  const aliases = {}
  /*
    'lodash-es': path.resolve(sourcePath, 'node_modules/lodash'),
    'lodash': path.resolve(sourcePath, 'node_modules/lodash')
  }
  */

  return {
    app,
    env: ENV,
    isProd,
    useAnalyse: params.useAnalyse,
    sourcePath,
    devTools,
    aliases
  }
}

module.exports = {
  generateBabelEnvLoader,
  addOptimizationPlugins,
  createCompiler,
  getConfig,
  getBuildParameters
}
