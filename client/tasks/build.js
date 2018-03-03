const {createCompiler, getBuildParameters} = require('./common')
const makeFeConfig = require('./client')
const makeNodeConfig = require('./server')

const baseConfig = getBuildParameters(process.argv)
const feBuildConfig = makeFeConfig(baseConfig)
const nodeBuildConfig = makeNodeConfig(baseConfig)

const compilers = [
  createCompiler(feBuildConfig),
  createCompiler(nodeBuildConfig)
];

(async () => {
  await Promise.all(compilers);
})();
