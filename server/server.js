import express from 'express'
import cookieParser from 'cookie-parser'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import routes from '../client/routes'
import renderReact from './renderReact'
const port = 5050


const app = express()

app.use('/public', express.static('./public'))

app.use(cookieParser())
app.use((req, res) => {
  match({ routes: routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      renderReact(req, res, renderProps)
    } else {
      res.status(404).send('Not found')
    }
  })
})

console.log('listening on port ' + port)
app.listen(port)
