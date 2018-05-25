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
          return next({httpStatus: 403, error: 'Invalid credentials'})
        } else {
          req.user = decoded
        }
      })
    }
    next()
  }
}
