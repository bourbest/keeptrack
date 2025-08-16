import config from './config'
import { call, put, select, takeEvery, all } from 'redux-saga/effects'
import { Actions, ActionCreators } from './actions'
import {getService} from '../app/selectors'
import { handleError } from '../commonHandlers'

function * blockedFilesSaga (action) {
  let errorAction = null
  const linkSvc = yield select(getService, 'blocked-files')

  switch (action.type) {
    case Actions.LOAD_BLOCKED_FILES_FOR_USER:
      yield put(ActionCreators.setFetching(true))
      try {
        const files = yield call(linkSvc.getForUserId, action.userId)
        yield all([
          put(ActionCreators.setBlockedFiles(files)),
          put(ActionCreators.setFetching(false))
        ])
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      break

    case Actions.CREATE:
      try {
        const newLink = yield call(linkSvc.create, action.userId, action.blockedFile)
        newLink.client = action.client
        yield put(ActionCreators.addLocalBlockedFile(newLink))
        if (action.cb) {
          yield call(action.cb, newLink)
        }
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      break

    case Actions.DELETE:
      try {
        yield call(linkSvc.delete, action.userId, action.ids)
        yield put(ActionCreators.removeLocalBlockedFile(action.ids))
        if (action.cb) {
          yield call(action.cb, action.ids.length)
        }
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      break
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default takeEvery([
  Actions.LOAD_BLOCKED_FILES_FOR_USER,
  Actions.CREATE,
  Actions.DELETE
], blockedFilesSaga)
