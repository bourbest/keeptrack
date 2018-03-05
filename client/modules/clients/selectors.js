import config from './config'
import {orderBy} from 'lodash'
import { getLocale } from '../app/selectors'
import {
  createBaseSelectors, createFilteredListSelectorWithLocale, getSortParamsForStringsOnlyTable,
  makeCompareEntities, buildSortedOptionList, EMPTY_ARRAY
} from '../common/selectors'
import { createSelector } from 'reselect'
const Selectors = createBaseSelectors(config.entityName)

const concatInfo = (client, locale) => client.lastName + client.firstName

const genders = [
  {en: 'Male', fr: 'Homme', id: 'M'},
  {en: 'Female', fr: 'Femme', id: 'F'}
]

Selectors.getGenderOptionList = createSelector(
  [getLocale],
  (locale) => {
    return buildSortedOptionList(genders, locale)
  }
)

Selectors.getFilteredList = createFilteredListSelectorWithLocale(Selectors, concatInfo, getLocale)

Selectors.buildNewEntity = () => {
  let newEntity = {
    'firstName': '',
    'lastName': ''
  }
  return newEntity
}

Selectors.getSortParams = createSelector(
  [Selectors.getSortParams],
  getSortParamsForStringsOnlyTable
)

Selectors.getFilteredSortedList = createSelector(
  [Selectors.getFilteredList, Selectors.getSortParams], (clients, sortParams) => {
    return clients.sort(makeCompareEntities(sortParams))
  }
)

Selectors.getSelectedFormId = (state) => state[config.entityName].selectedFormId

Selectors.getClientDocumentsOrderByDate = createSelector(
  [Selectors.getEditedEntity],
  (client) => {
    if (!client) return EMPTY_ARRAY
    const ret = orderBy(client.documents, ['createdOn'], ['desc'])
    return ret
  }
)
export default Selectors
