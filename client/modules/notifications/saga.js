import config from './config'
import { Actions, ActionCreators } from './actions'
import {getService} from '../app/selectors'
import Selectors from './selectors'
import { handleError } from '../commonHandlers'

import { call, put, select, takeEvery, delay, take, race } from 'redux-saga/effects'

// handleError(entityName, error) : must be a global error handler that returns null or an action to perform
function * notificationSaga (action) {
  let errorAction = null
  const svc = yield select(getService, config.entityName)
  switch (action.type) {
    case Actions.FETCH_NOTIFICATIONS:
      try {
        const fromDate = yield select(Selectors.getYoungestNotificationDate)
        yield put(ActionCreators.setFetchingList(true))
        const filters = {fromDate, isRead: false}
        const response = yield call(svc.list, filters)

        yield put(ActionCreators.setNotifications(response.entities))
      } catch (ex) {
        errorAction = handleError('notification', ex)
      }
      yield put(ActionCreators.setFetchingList(false))
      break

    case Actions.MARK_REMOTE_AS_READ:
      try {
        yield call(svc.delete, action.id)
        yield put(ActionCreators.markLocalAsRead(action.id))
      } catch (ex) {
        errorAction = handleError('notification', ex)
      }
      break

    default:
      throw new Error('Unsupported trigger action in notification saga', action)
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

function * pollSagaWorker () {
  while (true) {
    yield put(ActionCreators.fetchNotifications())
    yield delay(5 * 60 * 1000) // 5 minutes
  }
}

function * pollSagaWatcher () {
  yield race([
    call(pollSagaWorker),
    take(Actions.STOP_POLLING)
  ])
}

export default [
  takeEvery([
    Actions.FETCH_NOTIFICATIONS,
    Actions.MARK_REMOTE_AS_READ
  ], notificationSaga),
  takeEvery([Actions.START_POLLING], pollSagaWatcher)
]
