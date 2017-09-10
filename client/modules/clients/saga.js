import config from './config'
import { Actions, ActionCreators } from './actions'
import { createBaseSaga, createBaseSagaWatcher } from '../common/sagas'
import {getService} from '../app/selectors'
import Selectors from './selectors'
import { handleError } from '../commonHandlers'
// Saga
const baseSaga = createBaseSaga(config.entityName, Actions, ActionCreators, getService, Selectors, handleError)

export default createBaseSagaWatcher(Actions, baseSaga)
