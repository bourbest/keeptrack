import { Actions, ActionCreators } from './actions'
import {getService} from '../app/selectors'
import { handleError } from '../commonHandlers'

import { call, put, select, takeEvery } from 'redux-saga/effects'

// handleError(entityName, error) : must be a global error handler that returns null or an action to perform
function * dashboardSaga (action) {
  let errorAction = null
  switch (action.type) {
    case Actions.FETCH_MY_CLIENTS:
      try {
        const clientSvc = yield select(getService, 'clients')
        yield put(ActionCreators.setFetchingMyClients(true))
        const response = yield call(clientSvc.getMyClients)

        yield put(ActionCreators.setMyClients(response))
      } catch (ex) {
        errorAction = handleError('dashboard', ex)
      }
      yield put(ActionCreators.setFetchingMyClients(false))
      break

    case Actions.FETCH_NOTIFICATIONS:
      break

    default:
      throw new Error('Unsupported trigger action in dashboard saga', action)
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default
  takeEvery([
    Actions.FETCH_NOTIFICATIONS,
    Actions.FETCH_MY_CLIENTS
  ], dashboardSaga)
