import config from './config'

import { createBaseSelectors, createFilteredListSelector } from '../helpers/selectors'

const Selectors = createBaseSelectors(config.storeBranch)

const concatInfo = (file) => `${file.firstName} ${file.lastName} ${file.fileNo}`

Selectors.getFilteredList = createFilteredListSelector(Selectors, concatInfo, 'id')

export default Selectors
