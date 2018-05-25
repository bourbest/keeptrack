import {omit} from 'lodash'
import {UserAccountRepository} from '../repository'
import {makeFindAllHandler, makeFindById, makeHandlePost, makeHandleDelete} from './StandardController'
import {entityFromBody} from '../middlewares/entityFromBody'
import {accountSchema, newAccountSchema} from '../../modules/accounts/validate'
import bcrypt from 'bcryptjs'

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
  router.route('/accounts')
    .get(makeFindAllHandler(UserAccountRepository))
    .post([
      entityFromBody(newAccountSchema),
      hashPassword,
      makeHandlePost(UserAccountRepository)
    ])
    .delete(makeHandleDelete(UserAccountRepository))
  router.route('/accounts/:id')
    .get(makeFindById(UserAccountRepository))
    .put([
      entityFromBody(accountSchema),
      hashPassword,
      updateAccount
    ])
}
