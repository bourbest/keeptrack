import {omit, pick, isEmpty} from 'lodash'
import {string, number, isInteger, oneOf, Schema, validate, transform} from 'sapin'

const basePaginationSchema = {
  page: number(isInteger),
  limit: number(isInteger),
  sortDirection: string(oneOf(['asc', 'desc']))
}

const PAGINATION_PARAMS = ['page', 'limit', 'sortBy', 'sortDirection']

export function parsePagination (acceptedSortBy, maxLimit = 1000, defaultLimit) {
  const paginationSchema = new Schema({
    ...basePaginationSchema,
    sortBy: string(oneOf(acceptedSortBy))
  })

  return (req, res, next) => {
    if (req.query) {
      let pagination = pick(req.query, PAGINATION_PARAMS)
      const error = validate(pagination, paginationSchema)

      if (error) {
        return next({httpStatus: 400, message: 'Invalid pagination parameters', error})
      }

      pagination = transform(pagination, paginationSchema)

      if (pagination.page && !pagination.limit && defaultLimit) {
        pagination.limit = defaultLimit
      }

      if (pagination.limit && pagination.limit > maxLimit) {
        pagination.limit = maxLimit
      }

      if (pagination.sortBy && !pagination.sortDirection) {
        pagination.sortDirection = 'asc'
      }

      if (!isEmpty(pagination)) {
        req.pagination = pagination
      }

      req.query = omit(req.query, PAGINATION_PARAMS)
    }

    next()
  }
}
