import fs from 'fs'
import path from 'path'

const context = {}

const initPath = () => {
  if (process.env.NODE_ENV === 'production') {
    context.appPath = './'
  } else {
    context.appPath = './dist-kt/'
  }
}

const loadManifestFile = () => {
  const manifestPath = path.join(context.appPath, 'public/manifest.json')
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  if (!manifest || !manifest['runtime.js']) {
    return false
  }

  context.runtime = fs.readFileSync(path.join(context.appPath, manifest['runtime.js']), 'utf8')
  context.scripts = [
    manifest['vendor.js'],
    manifest['main.js']
  ]
  return true
}

const ensureManifestIsLoaded = () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('loading prod config')
    if (!loadManifestFile()) {
      throw new Error('public/manifest.json not found or invalid')
    }
  } else {
    const timerId = setInterval(() => {
      if (loadManifestFile()) {
        console.log('manifest loaded')
        clearInterval(timerId)
      } else {
        console.log('failed to load manifest, will retry in 2 seconds')
      }
    }, 1000)
  }
}

const loadServerConfiguration = () => {
  const configPath = path.join(context.appPath, 'config.json')
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  if (!config) {
    throw new Error(`Could not find configuration file at path '${configPath}'`)
  }
  context.configuration = config
}

export const loadContext = () => {
  initPath()
  loadServerConfiguration()
  ensureManifestIsLoaded()
}

export const getContext = () => context
