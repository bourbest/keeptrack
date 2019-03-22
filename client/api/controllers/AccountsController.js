import {omit} from 'lodash'
import {UserAccountRepository} from '../repository'
import {makeFindAllHandler, makeFindById, makeHandlePost, makeHandleArchive, makeHandleRestore} from './StandardController'
import {entityFromBody} from '../middlewares/entityFromBody'
import {accountSchema, newAccountSchema} from '../../modules/accounts/schema'
import bcrypt from 'bcryptjs'
import {boolean, Schema, string} from 'sapin'
import {parseFilters, parsePagination, requiresRole} from '../middlewares'
import ROLES from '../../modules/accounts/roles'

const ACCEPTED_SORT_PARAMS = ['fullName']
const OMITED_FIELDS = ['passwordHash']

const filtersSchema = new Schema({
  contains: string,
  isArchived: boolean
})

const hashPassword = (req, res, next) => {
  const password = req.entity.password
  if (password && password.length > 0) {
    bcrypt.hash(password, 8)
      .then(hashedPassword => {
        req.entity = omit(req.entity, ['password', 'confirmPassword'])
        req.entity.passwordHash = hashedPassword
        next()
      })
  } else {
    req.entity = omit(req.entity, ['password', 'confirmPassword'])
    next()
  }
}

const updateAccount = (req, res, next) => {
  const repo = new UserAccountRepository(req.database)

  repo.findById(req.entity.id)
    .then(function (entity) {
      if (entity) {
        entity.firstName = req.entity.firstName
        entity.lastName = req.entity.lastName
        entity.roles = req.entity.roles
        entity.organismRole = req.entity.organismRole
        entity.email = req.entity.email
        entity.modifiedOn = new Date()

        if (req.entity.passwordHash) {
          entity.passwordHash = req.entity.passwordHash
        }

        return repo.update(entity)
          .then(function () {
            const ret = omit(entity, 'passwordHash')
            res.json(ret) // return untransformed entity so id is used instead of _id
          })
          .catch(next)
      } else {
        res.status(404).json({error: 'entity not found'})
      }
    })
    .catch(next)
}

export default (router) => {
  router.use('/accounts', requiresRole(ROLES.usersManager, false))
  router.route('/accounts')
    .get([
      parsePagination(ACCEPTED_SORT_PARAMS),
      parseFilters(filtersSchema),
      makeFindAllHandler(UserAccountRepository, OMITED_FIELDS)
    ])
    .post([
      entityFromBody(newAccountSchema),
      hashPassword,
      makeHandlePost(UserAccountRepository)
    ])
  router.route('/accounts/archive')
    .post(makeHandleArchive(UserAccountRepository))

  router.route('/accounts/restore')
    .post(makeHandleRestore(UserAccountRepository))

  router.route('/accounts/:id')
    .get(makeFindById(UserAccountRepository, OMITED_FIELDS))
    .put([
      entityFromBody(accountSchema),
      hashPassword,
      updateAccount
    ])
}
