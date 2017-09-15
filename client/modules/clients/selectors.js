import config from './config'
import { getLocale } from '../app/selectors'
import { createBaseSelectors, createFilteredListSelectorWithLocale, getSortParamsForStringsOnlyTable, makeCompareEntities, buildSortedOptionList } from '../common/selectors'
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
export default Selectors
