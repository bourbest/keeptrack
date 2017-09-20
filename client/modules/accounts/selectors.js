import config from './config'
import { getLocale } from '../app/selectors'
import { createBaseSelectors, createFilteredListSelectorWithLocale, getSortParamsForStringsOnlyTable, makeCompareEntities, buildSortedOptionList } from '../common/selectors'
import { createSelector } from 'reselect'
const Selectors = createBaseSelectors(config.entityName)

const concatInfo = (account, locale) => account.lastName + account.firstName

Selectors.getFilteredList = createFilteredListSelectorWithLocale(Selectors, concatInfo, getLocale)

Selectors.buildNewEntity = () => {
  let newEntity = {
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    roles: []
  }
  return newEntity
}

Selectors.getSortParams = createSelector(
  [Selectors.getSortParams],
  getSortParamsForStringsOnlyTable
)

Selectors.getFilteredSortedList = createSelector(
  [Selectors.getFilteredList, Selectors.getSortParams], (accounts, sortParams) => {
    return accounts.sort(makeCompareEntities(sortParams))
  }
)

const roles = [
  {id: 'ADMIN', names: {fr: 'Administrateur', en: 'Administrator'}},
  {id: 'INTER', names: {fr: 'Intervenante', en: 'Intervenante'}},
  {id: 'SECAD', names: {fr: 'Secrétaire administrative', en: 'Secrétaire administrative'}}
]

Selectors.getRolesOptionList = createSelector(
  [getLocale],
  (locale) => {
    const prop = 'names.' + locale
    return buildSortedOptionList(roles, prop)
  }
)
export default Selectors
