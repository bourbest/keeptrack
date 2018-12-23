import config from './config'
import { Actions, ActionCreators } from './actions'
import {getService} from '../app/selectors'
import Selectors from './selectors'
import { handleError } from '../commonHandlers'

import { call, put, select, takeEvery, all } from 'redux-saga/effects'

// handleError(entityName, error) : must be a global error handler that returns null or an action to perform
function * notificationSaga (action) {
  let errorAction = null
  const svc = yield select(getService, config.entityName)
  switch (action.type) {
    case Actions.FETCH_NOTIFICATIONS:
      try {
        // fetch only if we do not already have the page
        const [fromDate, fromId] = yield all([
          select(Selectors.getYoungestNotificationDate),
          select(Selectors.getYoungestNotificationId)
        ])

        yield put(ActionCreators.setFetchingList(true))
        const filters = {fromDate, fromId}
        const response = yield call(svc.list, filters)

        yield put(ActionCreators.setNotifications(response.entities))
      } catch (ex) {
        errorAction = handleError('notification', ex)
        yield put(ActionCreators.setFetchingList(false))
      }
      break

    case Actions.MARK_AS_READ:
      try {
        yield call(svc.markAsRead, action.id, action.isRead)
        yield put(ActionCreators.markLocalAsRead(action.id, action.isRead))
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

export default
  takeEvery([
    Actions.FETCH_NOTIFICATIONS,
    Actions.MARK_REMOTE_AS_READ
  ], notificationSaga)
