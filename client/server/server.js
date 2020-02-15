import 'babel-polyfill'
import express from 'express'
import cookieParser from 'cookie-parser'
import https from 'https'
import path from 'path'
import {match} from 'react-router'

import {loadContext, getContext} from './config'
import routes from '../routes'
import createApiRouter from '../api/routes'
import renderReact from './renderReact'
import {connectDatabase} from '../api/repository/connect'
import {COOKIE_NAMES} from '../config/const'
import {CsrfTokenLayer} from '../api/middlewares/csrf'
import {injectGlobals} from '../api/middlewares/injectGlobals'
import {loadCache} from './cache'
import {loadUser} from '../api/middlewares/security'
import redirectToHttps from './redirect'

// remove this if running in a production envrionment
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

const app = express()

loadContext()
const context = getContext()

app.use(function(req, res, next) {
  if(!req.secure) {
    return res.redirect(['https://', req.get('Host'), req.baseUrl].join(''));
  }
  next();
})

app.use('/public', express.static(path.join(context.appPath, '/public')))

app.get('/public/favicon.ico', function (req, res) {
  res.status(404).send('Not found')
})

app.use(cookieParser())
app.use(loadUser(context.configuration.secret))

const csrf = new CsrfTokenLayer({
  cookie: {
    key: COOKIE_NAMES.csrfToken,
    secure: process.env.env === 'prod'
  }
})

const globals = {
  csrf
}

app.use(injectGlobals(globals))

// create servers
const httpsServer = https.createServer(context.credentials, app);
const httpServer = redirectToHttps()

// Connection url
const dbConfig = context.configuration.db
connectDatabase(dbConfig.server, dbConfig.dbName)
  .then(database => {
    return loadCache(database)
      .then(cache => {
        context.cache = cache
        return database
      })
  })
  .then(database => {
    // api related
    app.use('/api', createApiRouter(context, context.configuration, database))

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
          console.log("not found")
          res.status(404).send('Not found')
        }
      })
    })

    console.log('api endpoint : ' + context.configuration.apiEndpoint)
    console.log('listening on port ' + context.configuration.port)
    httpsServer.listen(context.configuration.port)
    httpServer.listen(80)
  })
  .catch(error => {
    console.log('error connecting to database', error)
  })
