
import { browserHistory } from 'react-router'

import { call, put, select } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'

import { getService } from '../selectors/app-selectors'

import {
  Actions,
  ActionCreators as AuthActionCreators
} from '../modules/authentication'

function * authSaga (action) {
  const svc = yield select(getService, 'auth')

  switch (action.type) {
    case Actions.LOG_IN:
      try {
        const ret = yield call(svc.login, action.username, action.password)

        if (ret && ret.identity) {
          yield put(AuthActionCreators.setSessionInfo(ret))

          // redirect to target location if any
          const targetLocation = '/'
          browserHistory.push(targetLocation)
        } else {
          yield put(AuthActionCreators.setLoginError(ret.error))
        }
      } catch (error) {
        yield put(AuthActionCreators.setLoginError(error.message))
      }
      break

    case Actions.LOG_OUT:
      try {
        yield call(svc.logout)
      } catch (error) {
        console.log('logout error', error)
      } finally {
        yield put(AuthActionCreators.setSessionInfo, {user: null, expiresOn: null})
        browserHistory.replace('/login')
      }
      break

    default:
      throw new Error('Unsupported trigger action in auth saga', action)
  }
}

export default function * authenticationSagaWatcher () {
  yield * takeLatest([
    Actions.LOG_IN,
    Actions.LOG_OUT
  ], authSaga)
}
