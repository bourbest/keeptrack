const fs = require('fs')
const path = require('path')
const {generateBabelEnvLoader, getConfig} = require('./common')

const buildCache = {}

module.exports = (params) => {
  const baseConfig = getConfig(params)
  const config = Object.assign({}, baseConfig)
  config.outputPath = path.join(__dirname, '../dist-' + config.app)

  return {
    entry: config.sourcePath + '/tools/initdb.js',
    context: config.sourcePath,
    target: 'node',
    output: {
      path: config.outputPath,
      filename: 'initdb.js'
    },
    stats: {
      colors: true,
      reasons: true,
      chunks: false
    },
    cache: buildCache,
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

