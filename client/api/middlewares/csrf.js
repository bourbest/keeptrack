import Cookie from 'cookie'
import {sign} from 'cookie-signature'
import Tokens from 'csrf'

export function CsrfTokenLayer (options) {
  var opts = options || {}

  this.cookieOptions = getCookieOptions(opts.cookie)
  this.getTokenFromRequest = opts.getValue || defaultGetValue
  this.tokens = new Tokens(opts)
  this.ignoreMethod = getIgnoredMethods(['GET', 'HEAD', 'OPTIONS'])
}

CsrfTokenLayer.prototype.generateToken = function (req, res) {
  var secret = this.tokens.secretSync()
  setSecret(req, res, secret, this.cookieOptions)

  var token = this.tokens.create(secret)
  return token
}

CsrfTokenLayer.prototype.checkCsrf = function (req) {
  // verify the incoming token
  if (!this.ignoreMethod[req.method]) {
    var secret = getSecret(req, this.cookieOptions)
    var token = this.getTokenFromRequest(req)

    return this.tokens.verify(secret, token)
  }

  return true
}

export function checkCsrf (req, res, next) {
  // verify the incoming token
  if (!req.csrf.checkCsrf(req)) {
    return next({httpStatus: 403, error: 'Invalid csrf token'})
  }

  next()
}

/**
 * Default value function, checking the `req.body`
 * and `req.query` for the CSRF token.
 *
 * @param {IncomingMessage} req
 * @return {String}
 * @api private
 */

function defaultGetValue (req) {
  return (req.body && req.body._csrf) ||
    (req.query && req.query._csrf) ||
    (req.headers['csrf-token']) ||
    (req.headers['xsrf-token']) ||
    (req.headers['x-csrf-token']) ||
    (req.headers['x-xsrf-token'])
}

/**
 * Get options for cookie.
 *
 * @param {boolean|object} [options]
 * @returns {object}
 * @api private
 */

function getCookieOptions (options) {
  var opts = {
    key: '_csrf',
    path: '/'
  }

  if (options && typeof options === 'object') {
    for (var prop in options) {
      var val = options[prop]

      if (val !== undefined) {
        opts[prop] = val
      }
    }
  }

  return opts
}

/**
 * Get a lookup of ignored methods.
 *
 * @param {array} methods
 * @returns {object}
 * @api private
 */

function getIgnoredMethods (methods) {
  var obj = Object.create(null)

  for (var i = 0; i < methods.length; i++) {
    var method = methods[i].toUpperCase()
    obj[method] = true
  }

  return obj
}

/**
 * Get the token secret from the request.
 *
 * @param {IncomingMessage} req
 * @param {String} sessionKey
 * @param {Object} [cookieOptions]
 * @api private
 */

function getSecret (req, cookieOptions) {
  // get the bag & key
  var bagName = cookieOptions.signed
    ? 'signedCookies'
    : 'cookies'

  var cookieBag = req[bagName]

  // return secret from bag
  return cookieBag[cookieOptions.key]
}

/**
 * Set a cookie on the HTTP response.
 *
 * @param {OutgoingMessage} res
 * @param {string} name
 * @param {string} val
 * @param {Object} [cookieOptions]
 * @api private
 */

function setCookie (res, name, val, cookieOptions) {
  var data = Cookie.serialize(name, val, cookieOptions)

  var prev = res.getHeader('set-cookie') || []
  var header = Array.isArray(prev) ? prev.concat(data)
    : Array.isArray(data) ? [prev].concat(data)
      : [prev, data]

  res.setHeader('set-cookie', header)
}

/**
 * Set the token secret on the request.
 *
 * @param {IncomingMessage} req
 * @param {OutgoingMessage} res
 * @param {string} sessionKey
 * @param {string} val
 * @param {Object} [cookieOptions]
 * @api private
 */

function setSecret (req, res, secret, cookieOptions) {
  // set secret on cookie
  var val = secret
  if (cookieOptions.signed) {
    if (!req.secret) {
      throw 'Invalid csrf configuration : using signed cookies while cookie-parser was not initialized with a secret'
    }
    val = 's:' + sign(val, req.secret)
  }

  setCookie(res, cookieOptions.key, val, cookieOptions)
}
