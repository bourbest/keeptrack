import {validate, transform} from 'sapin'
import {endsWith} from 'lodash'

export const entityFromBody = function (schema) {
  return function (req, res, next) {
    if (!endsWith(req.originalUrl, 'archive') && (req.method === 'POST' || req.method === 'PUT')) {
      let error = validate(req.body, schema, true)
      if (error) {
        return next({httpStatus: 400, message: 'Given entity does not respect Schema', error})
      }
      req.entity = transform(req.body, schema)
    }
    next()
  }
}
