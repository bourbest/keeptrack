import 'babel-polyfill'
import express from 'express'
import cookieParser from 'cookie-parser'
import { match } from 'react-router'
import path from 'path'

import {loadContext, getContext} from './config'
import routes from '../routes'
import createApiRouter from '../api/routes'
import renderReact from './renderReact'
import {connectDatabase} from '../api/repository/connect'

const app = express()

loadContext()
const context = getContext()

app.use('/public', express.static(path.join(context.appPath, '/public')))

app.get('/public/favicon.ico', function (req, res) {
  res.status(404).send('Not found')
})

app.use(cookieParser())

// Connection url
const dbConfig = context.configuration.db
connectDatabase(dbConfig.server, dbConfig.dbName)
  .then(database => {
    // api related
    app.use('/api', createApiRouter(context.configuration, database))

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

    console.log('listening on port ' + context.configuration.port)
    app.listen(context.configuration.port)
  })
  .catch(error => {
    console.log('error connecting to database', error)
  })
