import {omit} from 'lodash'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import {UserAccountRepository} from '../repository'
import {COOKIE_NAMES} from '../../config/const'

const omitSensitiveUserData = (user) => omit(user, ['passwordHash'])

const UNAUTH_EX = {httpStatus: 401, error: 'Code utilisateur ou mot de passe invalide'}
const ACCOUNT_DISABLED_EX = {httpStatus: 401, error: 'Le compte a été désactivé'}

function ensureAcccountExists (user) {
  if (!user) {
    throw UNAUTH_EX
  }
  return user
}
function ensureAccountIsActive (user) {
  if (user.isArchived) {
    throw ACCOUNT_DISABLED_EX
  }
  return user
}

function ensurePasswordMatch (password) {
  return function (user) {
    return bcrypt.compare(password, user.passwordHash)
      .then(isValid => {
        if (isValid) {
          return user
        }
        throw UNAUTH_EX
      })
  }
}

export default (router, secret) => {
  router.route('/authenticate')
    .post(function (req, res, next) {
      const repo = new UserAccountRepository(req.database)
      return repo.findByUsername(req.body.username)
        .then(ensureAcccountExists)
        .then(ensureAccountIsActive)
        .then(ensurePasswordMatch(req.body.password))
        .then(function (user) {
          user = omitSensitiveUserData(user)
          const token = jwt.sign(user, secret, {
            expiresIn: '1d' // expires in 24 hours
          })
          res.cookie(COOKIE_NAMES.auth, token, { maxAge: 900000, httpOnly: true })
          const csrfToken = req.csrf.generateToken(req, res)
          res.json({success: true, user, csrfToken})
        })
        .catch(next)
    })
    .delete(function (req, res, next) {
      res.clearCookie(COOKIE_NAMES.auth)
      res.json({})
    })
}
