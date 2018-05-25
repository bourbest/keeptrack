import { browserHistory } from 'react-router'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { getService } from '../app/selectors'

import {
  Actions,
  ActionCreators as AuthActionCreators
} from './actions'

import { ActionCreators as AppActions } from '../app/actions'

function * authSaga (action) {
  const svc = yield select(getService, 'auth')

  switch (action.type) {
    case Actions.LOG_IN:
      try {
        const ret = yield call(svc.login, action.username, action.password)

        if (ret && ret.user) {
          yield put(AppActions.setCsrfToken(ret.csrfToken))

          yield put(AuthActionCreators.setUser(ret.user))

          // redirect to target location if any
          const targetLocation = action.redirect || '/'
          browserHistory.push(targetLocation)
        } else {
          yield put(AuthActionCreators.setLoginError(ret.error))
        }
      } catch (error) {
        yield put(AuthActionCreators.setLoginError(error))
      }
      break

    case Actions.LOG_OUT:
      try {
        yield call(svc.logout)
      } catch (error) {
        console.log('logout error', error)
      } finally {
        yield put(AuthActionCreators.setUser, null)
        browserHistory.push('/login')
      }
      break

    default:
      throw new Error('Unsupported trigger action in auth saga', action)
  }
}

export default takeLatest([
  Actions.LOG_IN,
  Actions.LOG_OUT
], authSaga)
