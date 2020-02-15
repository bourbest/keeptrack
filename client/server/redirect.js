import express from 'express'
import http from 'http'

export default function createRedirectToHttps (context) {
  const app = express()

  app.use(function(req, res, next) {
    if(!req.secure) {
      return res.redirect(['https://', req.get('Host'), req.baseUrl].join(''));
    }
    next();
  })

  return http.createServer(app)
}
