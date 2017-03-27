import config from './config'

import { createBaseSelectors, createFilteredListSelector } from '../helpers/selectors'

const Selectors = createBaseSelectors(config.storeBranch)

const concatInfo = (template) => template.name

Selectors.getFilteredList = createFilteredListSelector(Selectors, concatInfo, 'id')

Selectors.getEditedFieldName = (state) => state[config.storeBranch].editedFieldName

export default Selectors
