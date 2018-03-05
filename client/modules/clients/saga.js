import config from './config'
import { Actions, ActionCreators } from './actions'
import { createBaseSaga, createBaseSagaWatcher } from '../common/sagas'
import {getService} from '../app/selectors'
import Selectors from './selectors'
import { handleError } from '../commonHandlers'
import {select, put, call, takeEvery} from 'redux-saga/effects'
// Saga
const baseSaga = createBaseSaga(config.entityName, Actions, ActionCreators, getService, Selectors, handleError)

// Saga
function * clientSaga (action) {
  let errorAction = null
  const clientSvc = yield select(getService, 'clients')
  switch (action.type) {
    case Actions.LOAD_CLIENT:
      yield put(ActionCreators.setFetching(true))
      try {
        const promises = [
          clientSvc.get(action.clientId),
          clientSvc.getDocumentsByClientId(action.clientId)
        ]
        const results = yield call([Promise, Promise.all], promises)
        const client = results[0]
        client.documents = results[1]
        yield put(ActionCreators.setEditedEntity(client))
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      yield put(ActionCreators.setFetching(false))
      break

    default:
      throw new Error('Unexpected action in clientSaga')
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default [
  createBaseSagaWatcher(Actions, baseSaga),
  takeEvery(Actions.LOAD_CLIENT, clientSaga)
]
