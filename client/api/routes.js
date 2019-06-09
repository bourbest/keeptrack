import express from 'express'
import {mustBeAuthenticated} from './middlewares/security'
import {injectGlobals} from './middlewares/injectGlobals'
import registerClients from './controllers/ClientsController'
import registerAuthentication from './controllers/AuthenticationController'
import registerListOptions from './controllers/ListOptionsController'
import registerFormTemplates from './controllers/FormTemplateController'
import registerAccounts from './controllers/AccountsController'
import registerClientDocuments from './controllers/ClientDocumentsController'
import registerClientFeedSubscriptions from './controllers/ClientFeedSubscriptionController'
import registerNotifications from './controllers/NotificationsController'
import registerMyAccount from './controllers/MyAccountController'
import registerFormShortcut from './controllers/FormShortcutController'
import registerReports from './controllers/ReportController'
import registerUploadedFiles from './controllers/UploadedFileController'

import corser from 'corser'
import bodyParser from 'body-parser'
import {checkCsrf} from './middlewares/csrf'

function createApiRouter (context, config, database) {
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

  // middleware pour loguer dans la console tous les calls recus
  apiRouter.use(function (req, res, next) {
    // do logging
    console.log('api', req.originalUrl)
    next() // make sure we go to the next routes and don't stop here
  })

  apiRouter.use(mustBeAuthenticated)

  registerClients(apiRouter)
  registerListOptions(apiRouter)
  registerFormTemplates(apiRouter)
  registerAccounts(apiRouter)
  registerClientDocuments(apiRouter)
  registerClientFeedSubscriptions(apiRouter)
  registerNotifications(apiRouter)
  registerMyAccount(apiRouter)
  registerFormShortcut(apiRouter)
  registerReports(apiRouter)
  registerUploadedFiles(apiRouter, context)
  
  apiRouter.all('*', function (req, res, next) {
    if (!res.headersSent) {
      res.status(404)
      res.json({error: `route not found ${req.originalUrl}`})
    }   
  })

  // error handling
  apiRouter.use(function (err, req, res, next) {
    if (!res.headersSent) {
      console.log("error handler", err)
      if (err.httpStatus) {
        res.status(err.httpStatus).json({message: err.message, errors: err.errors})
      } else if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({message: 'Bad CSRF Token'})
      } else {
        res.status(500)
          .json({message: 'Internal server error', stack: err.stack})
      }
    } 
  })

  return apiRouter
}

export default createApiRouter
