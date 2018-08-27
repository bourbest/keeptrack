import express from 'express'
import {loadUser} from './middlewares/security'
import {injectGlobals} from './middlewares/injectGlobals'
import registerClients from './controllers/ClientsController'
import registerAuthentication from './controllers/AuthenticationController'
import registerListOptions from './controllers/ListOptionsController'
import registerFormTemplates from './controllers/FormTemplateController'
import registerAccounts from './controllers/AccountsController'
import registerEvolutionNotes from './controllers/EvolutionNoteController'
import registerClientDocuments from './controllers/ClientDocumentsController'
import registerClientFeedSubscriptions from './controllers/ClientFeedSubscriptionController'
import registerNotifications from './controllers/NotificationsController'

import corser from 'corser'
import bodyParser from 'body-parser'
import {checkCsrf} from './middlewares/csrf'

function createApiRouter (config, database) {
  const apiRouter = express.Router()

  const globals = {
    database
  }

  apiRouter.use(corser.create())
  apiRouter.use(bodyParser.json())
  apiRouter.use(injectGlobals(globals))

  // auth routes before csrf so user can POST its credentials
  registerAuthentication(apiRouter, config.secret)

  // CSRF protection on all non idempotent request
  apiRouter.use(checkCsrf)

  apiRouter.use(loadUser(config.secret))

  // middleware pour loguer dans la console tous les calls recus
  apiRouter.use(function (req, res, next) {
    // do logging
    console.log('api', req.originalUrl)
    next() // make sure we go to the next routes and don't stop here
  })

  registerClients(apiRouter)
  registerListOptions(apiRouter)
  registerFormTemplates(apiRouter)
  registerAccounts(apiRouter)
  registerEvolutionNotes(apiRouter)
  registerClientDocuments(apiRouter)
  registerClientFeedSubscriptions(apiRouter)
  registerNotifications(apiRouter)

  // 404 on all other routes
  apiRouter.all('*', function (req, res, next) {
    res.status(404)
    res.json({error: `route not found ${req.originalUrl}`})
  })

  // error handling
  apiRouter.use(function (err, req, res, next) {
    if (err.httpStatus) {
      res.status(err.httpStatus)
        .json({error: err.error})
    } else if (err.code === 'EBADCSRFTOKEN') {
      res.status(403).json({error: 'Bad CSRF Token'})
    } else {
      res.status(500)
        .json({error: err.stack})
    }
  })

  return apiRouter
}

export default createApiRouter
