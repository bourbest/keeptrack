import config from './config'
import { getLocale } from '../app/selectors'
import { createBaseSelectors, createFilteredListSelectorWithLocale, getSortParamsForStringsOnlyTable, makeCompareEntities } from '../common/selectors'
import { createSelector } from 'reselect'
const Selectors = createBaseSelectors(config.storeBranch, config.entityName)

const concatInfo = (client, locale) => client.lastName + client.firstName

Selectors.getFilteredList = createFilteredListSelectorWithLocale(Selectors, concatInfo, getLocale)

Selectors.buildNewClient = () => {
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
