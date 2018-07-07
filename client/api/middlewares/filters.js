import {omit} from 'lodash'
import {validate, transform} from 'sapin'

// validate route query parameters against schema and set isArchived to false by default
// if it is not provided
export function parseFilters (filtersSchema) {
  return (req, res, next) => {
    if (req.query) {
      const error = validate(req.query, filtersSchema, true)

      if (error) {
        return next({httpStatus: 400, message: 'Invalid filters parameters', error})
      }

      let filters = transform(req.query, filtersSchema)

      if (filters.includeArchived) {
        filters = omit(filters, 'includeArchived')
      } else if (filters.isArchived !== true) {
        filters.isArchived = false
      }

      req.filters = filters
    }

    next()
  }
}
