import {validate, transform} from 'sapin'

export const entityFromBody = function (schema) {
  return function (req, res, next) {
    if (req.method === 'POST' || req.method === 'PUT') {
      let error = validate(req.body, schema, true)
      if (error) {
        return next({httpStatus: 400, message: 'Given entity does not respect Schema', error})
      }
      req.entity = transform(req.body, schema)
    }
    next()
  }
}
