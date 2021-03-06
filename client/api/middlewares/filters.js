import {omit} from 'lodash'
import {validate, transform} from 'sapin'
import {ObjectId} from 'mongodb'

// validate route query parameters against schema and set isArchived to false by default
// if it is not provided
export function parseFilters (filtersSchema, useLoggedUserAsFilter = false) {
  return (req, res, next) => {
    if (req.query) {
      const error = validate(req.query, filtersSchema, null, true)

      if (error) {
        return next({httpStatus: 400, message: 'Invalid filters parameters', error})
      }

      let filters = transform(req.query, filtersSchema)

      if (filters.includeArchived) {
        filters = omit(filters, 'includeArchived')
      } else if (filters.isArchived !== true) {
        filters.isArchived = false
      }

      if (useLoggedUserAsFilter) {
        if (req.user) {
          filters.userId = ObjectId(req.user.id)
        } else {
          filters.userId = null
        }
      }

      req.filters = filters
    }

    next()
  }
}
