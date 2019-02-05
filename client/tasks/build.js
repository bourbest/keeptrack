const {createCompiler, getBuildParameters} = require('./common')
const makeFeConfig = require('./client')
const makeNodeConfig = require('./server')
const makeTools = require('./tool-initdb')

const baseConfig = getBuildParameters(process.argv)
const feBuildConfig = makeFeConfig(baseConfig)
const nodeBuildConfig = makeNodeConfig(baseConfig)
const toolBuildConfig = makeTools(baseConfig)

const compilers = [
  createCompiler(feBuildConfig),
  createCompiler(nodeBuildConfig),
  createCompiler(toolBuildConfig)
];

(async () => {
  await Promise.all(compilers);
})();
