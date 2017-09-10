import { createSelector } from 'reselect'
import { filter, get, values, map, pick } from 'lodash'
import { isSubmitting, getFormValues, getFormSubmitErrors, getFormSyncErrors } from 'redux-form'

export const createBaseSelectors = (storeBranch, entityName) => {
  const selectors = {}
  selectors.getListFilter = (state) => state[storeBranch].listFilterValue
  selectors.getEntities = (state) => state[storeBranch].byId
  selectors.getServerListCount = (state) => state[storeBranch].serverListCount
  selectors.getSelectedItemIds = (state) => state[storeBranch].selectedItemIds
  selectors.getEditedEntity = getFormValues(entityName)
  selectors.isFetching = (state) => state[storeBranch].isFetching
  selectors.fetchError = (state) => state[storeBranch].fetchError
  selectors.getSortParams = (state) => state[storeBranch].sortParams
  selectors.getSubmitError = getFormSubmitErrors(entityName)
  selectors.getFormSyncErrors = getFormSyncErrors(entityName)
  selectors.isSubmitting = isSubmitting(entityName)

  selectors.getSelectedEntities = createSelector(
    [selectors.getEntities, selectors.getSelectedItemIds],
    (entitiesById, selectedIds) => {
      return values(pick(entitiesById, selectedIds))
    }
  )

  return selectors
}

export const buildSortedOptionList = (entities, nameProperty, idProperty = 'id') => {
  const list = map(entities, (entity) => {
    const label = get(entity, nameProperty, '')

    return {
      value: entity[idProperty],
      label
    }
  })
  list.sort((l, r) => compareStrings(l.label, r.label))
  return list
}

export const filterListWithContains = (list, filterValue, fields) => {
  filterValue = filterValue || ''
  filterValue = filterValue.toUpperCase()

  if (filterValue === '') return list

  const rowMatch = (listRow) => {
    const val = values(pick(listRow, fields)).join(' ').toUpperCase()
    return val.indexOf(filterValue) >= 0
  }

  return filter(list, rowMatch)
}

export const createFilteredListSelector = (Selectors, concatFunc) => {
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

export const createFilteredListSelectorWithLocale = (Selectors, concatFunc, getLocale) => {
  const filterSelector = createSelector(
    [Selectors.getEntities, Selectors.getListFilter, getLocale],
    (entities, filterValue, locale) => {
      filterValue = filterValue || ''
      filterValue = filterValue.toUpperCase()

      let filteredEntities = []
      if (filterValue.length > 0) {
        filteredEntities = filter(entities, (entity) => concatFunc(entity, locale).toUpperCase().indexOf(filterValue) >= 0)
      } else {
        filteredEntities = filter(entities, (entity) => true)
      }

      return filteredEntities
    }
  )
  return filterSelector
}

const stringCmp = new Intl.Collator(undefined, {sensitivity: 'base'})

export const compareStrings = stringCmp.compare
/* sortParams doit avoir la structure suivante : {
  field: 'nom.de.propriété',
  direction: 'DESC' ou 'ASC',
  cmp: function(a.b) qui retourne < 0 lorsque a est < b
 }
  */
export const makeCompareEntities = (sortParams) => {
  return (a, b) => {
    sortParams = sortParams || []
    let ret = 0
    for (let i = 0; i < sortParams.length; i++) {
      const param = sortParams[i]
      const order = param.direction === 'DESC' ? -1 : 1
      ret = param.cmp(get(a, param.field), get(b, param.field)) * order

      if (ret !== 0) return ret
    }

    return ret
  }
}

export const getSortParamsForStringsOnlyTable = (_sortParams) => {
  const sortParams = []
  if (!_sortParams) return sortParams

  for (let i = 0; i < _sortParams.length; i++) {
    const param = _sortParams[i]
    sortParams.push({
      ...param,
      cmp: compareStrings
    })
  }

  return sortParams
}
