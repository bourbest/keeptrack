import { Actions, ActionCreators } from './actions'
import {getService} from '../app/selectors'
import { handleError } from '../commonHandlers'

import { call, put, select, takeLatest } from 'redux-saga/effects'

// handleError(entityName, error) : must be a global error handler that returns null or an action to perform
function * myClientsSaga (action) {
  let errorAction = null
  try {
    const clientSvc = yield select(getService, 'clients')
    yield put(ActionCreators.setFetchingMyClients(true))
    const response = yield call(clientSvc.getMyClients)

    yield put(ActionCreators.setMyClients(response))
  } catch (ex) {
    errorAction = handleError('dashboard', ex)
    if (errorAction) {
      yield put(errorAction)
    }
  }
  yield put(ActionCreators.setFetchingMyClients(false))
}

export default [
  takeLatest(Actions.FETCH_MY_CLIENTS, myClientsSaga)
]
