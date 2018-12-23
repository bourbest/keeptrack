import config from './config'
import {orderBy, map} from 'lodash'
import { getLocale } from '../app/selectors'
import {
  createBaseSelectors, buildSortedOptionList, EMPTY_ARRAY
} from '../common/selectors'
import { createSelector } from 'reselect'
const Selectors = createBaseSelectors(config.entityName)

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

Selectors.buildNewEntity = () => {
  let newEntity = {
    firstName: '',
    lastName: '',
    isArchived: false,
    gender: '',
    email: '',
    birthDate: '',
    originId: '',
    mainPhoneNumber: {
      value: '',
      messageOption: ''
    },
    alternatePhoneNumber: {
      value: '',
      messageOption: ''
    },
    address: {
      civicNumber: '',
      streetName: '',
      app: '',
      city: '',
      postalCode: ''
    },
    acceptPublipostage: false
  }
  return newEntity
}

Selectors.getSelectedFormId = (state) => state[config.entityName].selectedFormId

Selectors.getClientDocumentsOrderByDate = createSelector(
  [Selectors.getEditedEntity],
  (client) => {
    if (!client) return EMPTY_ARRAY
    const ret = orderBy(client.documents, ['createdOn'], ['desc'])
    return ret
  }
)

Selectors.getClientNotesOrderByDate = createSelector(
  [Selectors.getEditedEntity],
  (client) => {
    if (!client || !client.evolutionNotes) return EMPTY_ARRAY
    const ret = orderBy(client.evolutionNotes, ['createdOn'], ['desc'])
    return ret
  }
)

Selectors.getClientOptions = createSelector(
  [Selectors.getEntities],
  (clientsById) => {
    return map(clientsById, (client) => {
      return {
        label: `${client.firstName} ${client.lastName}`,
        value: client
      }
    })
  }
)

Selectors.isCreateNoteEnabled = (state) => Selectors.getSelectedItemIds(state).length === 1

export default Selectors
