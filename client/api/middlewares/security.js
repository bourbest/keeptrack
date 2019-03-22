import jwt from 'jsonwebtoken'
import {COOKIE_NAMES} from '../../config/const'

export function loadUser (secret) {
  return function (req, res, next) {
    const userCookie = req.cookies[COOKIE_NAMES.auth]
    req.user = null
    if (userCookie) {
      // verifies secret and checks exp
      jwt.verify(userCookie, secret, function (err, decoded) {
        if (err) {
          req.user = null
        } else {
          req.user = decoded
        }
      })
    }
    next()
  }
}

export function requiresRole(role, forWriteOnly = true) {
  return function (req, res, next) {
    if (req.method !== 'GET' || !forWriteOnly) {
      if (req.user.roles.indexOf(role) === -1) return next({httpStatus: 403, message: 'Access denied'})
    }
    
    next()
  }
}

export function mustBeAuthenticated (req, res, next) {
  if (req.baseUrl === '/authenticate') return next()
  if (!req.user) return next({httpStatus: 401, message: 'Not authenticated'})
  next()
}
