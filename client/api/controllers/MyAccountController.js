import {UserAccountRepository} from '../repository'
import {entityFromBody} from '../middlewares/entityFromBody'
import {changePasswordSchema} from '../../modules/my-account/schema'
import bcrypt from 'bcryptjs'

const updateUserPassword = (newPassword) => {
  return function (user) {
    return bcrypt.hash(newPassword, 8)
      .then(hashedPassword => {
         user.passwordHash = hashedPassword
         return user
      })
  }
}

function ensurePasswordMatch (password) {
  return function (user) {
    return bcrypt.compare(password, user.passwordHash)
      .then(isValid => {
        if (isValid) {
          return user
        }
        throw {httpStatus: 400, message: 'Mot de passe invalide'}
      })
  }
}

export default (router) => {
  router.route('/my-account/change-password')
    .post([entityFromBody(changePasswordSchema),
      function (req, res, next) {
        const repo = new UserAccountRepository(req.database)
        return repo.findByUsername(req.user.username)
          .then(ensurePasswordMatch(req.entity.oldPassword))
          .then(updateUserPassword(req.entity.newPassword))
          .then(user => {
            return repo.update(user)
          })
          .then(cmdResult => {
            if (cmdResult.result.nModified === 1 && cmdResult.result.ok === 1) {
              res.status(200)
              res.result = {}
              next()
            } else {
              next({httpStatus: 500, message: 'database error', errors: cmdResult.result})
            }
          })
          .catch(next)
      }])
}
