import {validate, transform} from 'sapin'
import {endsWith, size} from 'lodash'

export const entityFromBody = function (schema) {
  return function (req, res, next) {
    if (!endsWith(req.originalUrl, 'archive') && (req.method === 'POST' || req.method === 'PUT')) {
      let errors = validate(req.body, schema, null, true)
      if (size(errors)) {
        return next({httpStatus: 400, message: 'Given entity does not respect Schema', errors})
      }
      req.entity = transform(req.body, schema)
    }
    next()
  }
}
