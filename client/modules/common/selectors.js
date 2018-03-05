import { createSelector } from 'reselect'
import { filter, get, values, map, pick } from 'lodash'
import { isSubmitting, getFormValues, getFormSubmitErrors, getFormSyncErrors, isPristine, isValid } from 'redux-form'

// these allow to use the same refenrece each time there a selector cannot produce result so we can save a couple render
export const EMPTY_OBJECT = {}
export const EMPTY_ARRAY = []
export const createBaseSelectors = (entityName) => {
  const selectors = {}

  // fetch
  selectors.isFetching = (state) => state[entityName].isFetching
  selectors.fetchError = (state) => state[entityName].fetchError

  // list selectors
  selectors.getListLocalFilters = (state) => state[entityName].listLocalFilters
  selectors.getListServerFilters = (state) => state[entityName].listServerFilters
  selectors.getEntities = (state) => state[entityName].byId

  selectors.getSelectedItemIds = (state) => state[entityName].selectedItemIds
  selectors.getSelectedEntities = createSelector(
    [selectors.getEntities, selectors.getSelectedItemIds],
    (entitiesById, selectedIds) => {
      return values(pick(entitiesById, selectedIds))
    }
  )
  selectors.getSortParams = (state) => state[entityName].sortParams

  selectors.isListDisplayingArchived = (state) => state[entityName].listServerFilters.isArchived === true
  selectors.isListDeleteEnabled = (state) => selectors.getSelectedItemIds(state).length > 0
  selectors.isListRestoreEnabled = (state) => selectors.getSelectedItemIds(state).length > 0
  selectors.isListCreateEnabled = (state) => true
  selectors.getFilteredSortedList = (state) => {
    throw new Error(`getFilteredSortedList not overriden for ${entityName}`)
  }

  // edited entity selectors
  selectors.buildNewEntity = (state) => {
    throw new Error(`buildNewEntity not overriden for ${entityName}`)
  }
  selectors.getEditedEntity = getFormValues(entityName)
  selectors.getSubmitError = getFormSubmitErrors(entityName)
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
    [Selectors.getEntities, Selectors.getListLocalFilters],
    (entities, filters) => {
      let filterValue = filters.contains || ''
      filterValue = filterValue.toUpperCase()

      let filteredEntities = null
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
    [Selectors.getEntities, Selectors.getListLocalFilters, getLocale],
    (entities, filters, locale) => {
      let filterValue = filters.contains || ''
      filterValue = filterValue.toUpperCase()

      let filteredEntities = null
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
