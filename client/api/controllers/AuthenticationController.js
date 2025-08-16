import {omit, map} from 'lodash'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import {UserAccountRepository, BlockedFileRepository} from '../repository'
import {COOKIE_NAMES} from '../../config/const'

const omitSensitiveUserData = (user) => omit(user, ['passwordHash'])

const UNAUTH_EX = {httpStatus: 401, message: 'Code utilisateur ou mot de passe invalide'}
const ACCOUNT_DISABLED_EX = {httpStatus: 401, message: 'Le compte a été désactivé'}

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

function loadBlockedFiles (database) {
  return function (user) {
    const repo = new BlockedFileRepository(database)
    return repo.findByUserId(user.id)
      .then(result => {
        user.blockedFiles = map(result, 'clientId')
        return user
      })
  }
}

function authenticateUser (secret) {
  return function (req, res, next) {
    const accountRepo = new UserAccountRepository(req.database)
    accountRepo.findByUsername(req.body.username)
      .then(ensureAcccountExists)
      .then(ensureAccountIsActive)
      .then(ensurePasswordMatch(req.body.password))
      .then(loadBlockedFiles(req.database))
      .then(function (user) {
        user = omitSensitiveUserData(user)
        const token = jwt.sign(user, secret, {
          expiresIn: '1d' // expires in 24 hours
        })
        res.cookie(COOKIE_NAMES.auth, token, { httpOnly: true })
        const csrfToken = req.csrf.generateToken(req, res)
        res.json({success: true, user, csrfToken})
      })
      .catch(next)
  }
}

export default (router, secret) => {
  router.route('/authenticate')
    .post([authenticateUser(secret)])
    .delete(function (req, res, next) {
      res.clearCookie(COOKIE_NAMES.auth)
      res.result = {}
      next()
    })
}
