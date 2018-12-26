import config from './config'
import { select, takeEvery, call, put } from 'redux-saga/effects'
import { startSubmit, stopSubmit } from 'redux-form'
import { Actions } from './actions'
import {getService} from '../app/selectors'
import { handleError } from '../commonHandlers'

function * MyAccountSaga (action) {
  let errorAction = null
  const accountSvc = yield select(getService, 'accounts')
  switch (action.type) {
    case Actions.SUBMIT_CHANGE_PASSWORD:
      try {
        yield put(startSubmit(config.entityName))
        yield call(accountSvc.changePassword, action.changePasswordForm)

        if (action.cb) {
          yield call(action.cb)
        }
        yield put(stopSubmit(config.entityName, {}))
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      break

    default:
      throw new Error('Unexpected action in MyAccountSaga')
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default takeEvery(Actions.SUBMIT_CHANGE_PASSWORD, MyAccountSaga)
