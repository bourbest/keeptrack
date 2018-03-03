import 'babel-polyfill'
import express from 'express'
import corser from 'corser'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { match } from 'react-router'
import fs from 'fs'

import routes from '../routes'
import renderReact from './renderReact'

const port = 5050
const app = express()

app.use('/public', express.static('./dist-kt/public'))

app.get('/favicon.ico', function (req, res) {
  res.status(404).send('Not found')
})

let context = {}
const loadContext = () => {
  const manifest = JSON.parse(fs.readFileSync('./dist-kt/public/manifest.json', 'utf8'))
  if (!manifest || !manifest['runtime.js']) {
    return false
  }

  context.runtime = fs.readFileSync(`./dist-kt/${manifest['runtime.js']}`, 'utf8')
  context.scripts = [
    manifest['vendor.js'],
    manifest['main.js']
  ]
  return true
}

if (process.env.NODE_ENV === 'production') {
  console.log('loading prod config')
  if (!loadContext()) {
    throw new Error('public/manifest.json not found or invalid')
  }
} else {
  const timerId = setInterval(() => {
    if (loadContext()) {
      console.log('manifest loaded')
      clearInterval(timerId)
    } else {
      console.log('failed to load manifest, will retry in 2 seconds')
    }
  }, 1000)
}

app.use(cookieParser())

// api related
app.use(corser.create())
app.use(bodyParser.json())

// react related
app.use((req, res) => {
  match({routes: routes, location: req.url}, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      renderReact(req, res, renderProps, context)
    } else {
      res.status(404).send('Not found')
    }
  })
})

console.log('listening on port ' + port)
app.listen(port)
