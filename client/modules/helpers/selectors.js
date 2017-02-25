import { createSelector } from 'reselect'
import { filter } from 'lodash'

export const createBaseSelectors = (storeBranch) => {
  const selectors = {}
  selectors.getListFilter = (state) => state[storeBranch].listFilterValue
  selectors.getEntities = (state) => state[storeBranch].byId
  selectors.getSelectedItemIds = (state) => state[storeBranch].selectedItemIds
  selectors.getEditedEntity = (state) => state[storeBranch].editedEntity
  selectors.isFetching = (state) => state[storeBranch].isFetching
  selectors.fetchError = (state) => state[storeBranch].fetchError
  return selectors
}

export const createFilteredListSelector = (Selectors, concatFunc, groupBy) => {
  return createSelector(
    [Selectors.getEntities, Selectors.getListFilter],
    (entities, filterValue) => {
      filterValue = filterValue || ''
      filterValue = filterValue.toUpperCase()

      let filteredEntities = []
      if (filterValue.length > 0) {
        filteredEntities = filter(entities, (entity) => concatFunc(entity).toUpperCase().indexOf(filterValue) >= 0)
      } else {
        filteredEntities = filter(entities, (entity) => true)
      }

      return filteredEntities
    }
  )
}
