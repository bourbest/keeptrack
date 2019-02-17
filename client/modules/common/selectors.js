import { createSelector } from 'reselect'
import { omit, filter, get, values, map, pick } from 'lodash'
import { isSubmitting, getFormValues, getFormError, getFormSyncErrors, isPristine, isValid } from 'redux-form'

export const PAGE_SIZE = 25

// these allow to use the same reference each time there a selector cannot produce result so we can save a couple render
export const EMPTY_OBJECT = {}
export const EMPTY_ARRAY = []

export const getLocationQuery = (state, props) => props.location ? props.location.query : EMPTY_OBJECT
export const getParams = (state, props) => props.params

export const PAGING_PARAM_NAMES = ['page', 'limit', 'sortBy', 'sortDirection']
export const createBaseSelectors = (entityName, defaultPagingParams = {}) => {
  const selectors = {}

  // fetch
  selectors.isFetchingList = (state) => state[entityName].isFetchingList
  selectors.isFetchingEntity = (state) => state[entityName].isFetchingEntity
  selectors.fetchError = (state) => state[entityName].fetchError

  // list selectors
  selectors.getEntities = (state) => state[entityName].byId
  selectors.getEntitiesPage = createSelector(
    [selectors.getEntities],
    (entities) => values(entities)
  )

  selectors.getCurrentPageContext = (state) => state[entityName].currentPageContext

  // selected list items
  selectors.getSelectedItemIds = (state) => state[entityName].selectedItemIds
  selectors.getSelectedEntities = createSelector(
    [selectors.getEntities, selectors.getSelectedItemIds],
    (entitiesById, selectedIds) => {
      return values(pick(entitiesById, selectedIds))
    }
  )

  selectors.getUrlParams = getLocationQuery
  selectors.getFilters = createSelector(
    [getLocationQuery],
    (query) => {
      const filters = omit(query, PAGING_PARAM_NAMES)
      filters.isArchived = filter.isArchived === 'true'

      return filters
    }
  )

  selectors.getPagingParams = createSelector(
    [getLocationQuery],
    (query) => {
      return {
        ...defaultPagingParams,
        limit: PAGE_SIZE,
        ...pick(query, PAGING_PARAM_NAMES)
      }
    }
  )

  selectors.getTotalItems = state => state[entityName].totalCount
  selectors.getTotalPages = (state, props) => {
    const query = getLocationQuery(state, props)
    const limit = query.limit ? parseInt(query.limit) : PAGE_SIZE
    const totalNumber = selectors.getTotalItems(state)
    let pageCount = Math.floor(totalNumber / limit)
    if (totalNumber % limit > 0) pageCount++
    return pageCount
  }

  selectors.isListDisplayingArchived = (state, props) => selectors.getUrlParams(state, props).isArchived === 'true'
  selectors.isListDeleteEnabled = (state) => selectors.getSelectedItemIds(state).length > 0
  selectors.isListRestoreEnabled = (state) => selectors.getSelectedItemIds(state).length > 0
  selectors.isListCreateEnabled = (state) => true

  // edited entity selectors
  selectors.buildNewEntity = (state) => {
    throw new Error(`buildNewEntity not overriden for ${entityName}`)
  }

  selectors.getEditedEntity = getFormValues(entityName)
  selectors.getSubmitError = getFormError(entityName)
  selectors.getSyncErrors = getFormSyncErrors(entityName)
  selectors.isSubmitting = isSubmitting(entityName)
  selectors.isNewEntity = (state) => {
    const entity = selectors.getEditedEntity(state) || EMPTY_OBJECT
    return !entity.id
  }
  selectors.isPristine = isPristine(entityName)
  selectors.isValid = isValid(entityName)

  selectors.canSaveEditedEntity = (state) => {
    return !selectors.isPristine(state) &&
           selectors.isValid(state) &&
           !selectors.isSubmitting(state)
  }
  selectors.canDeleteEditedEntity = (state) => !selectors.isEditedNew(state)

  return selectors
}

export const buildSortedOptionList = (entities, nameProperty, idProperty = 'id') => {
  const list = map(entities, (entity) => {
    const label = get(entity, nameProperty, '')

    return {
      id: entity[idProperty],
      value: entity[idProperty],
      label
    }
  })
  list.sort((l, r) => compareStrings(l.label, r.label))
  return list
}

const stringCmp = new Intl.Collator(undefined, {sensitivity: 'base'})

export const compareStrings = stringCmp.compare
