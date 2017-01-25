import config from './config'
import { Actions, ActionCreators } from './actions'
import { createBaseSaga, createBaseSagaWatcher } from '../helpers/sagas'

// Saga
const baseSaga = createBaseSaga(config.entityName, Actions, ActionCreators)

export default createBaseSagaWatcher(Actions, baseSaga)
