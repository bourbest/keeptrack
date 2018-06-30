import config from './config'
import { getLocale } from '../app/selectors'
import { createBaseSelectors, buildSortedOptionList } from '../common/selectors'
import { createSelector } from 'reselect'
const Selectors = createBaseSelectors(config.entityName)

Selectors.buildNewEntity = () => {
  let newEntity = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    organismRole: '',
    roles: [],
    isArchived: false
  }
  return newEntity
}

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
