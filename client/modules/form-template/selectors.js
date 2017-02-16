import config from './config'

import { createBaseSelectors, createFilteredListSelector } from '../helpers/selectors'

const Selectors = createBaseSelectors(config.storeBranch)

const concatInfo = (template) => template.name

Selectors.getFilteredList = createFilteredListSelector(Selectors, concatInfo, 'id')

export default Selectors
