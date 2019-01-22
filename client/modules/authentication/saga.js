import config from './config'
import { browserHistory } from 'react-router'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { getService } from '../app/selectors'
import { startSubmit, stopSubmit } from 'redux-form'
import {handleError} from '../commonHandlers'

import {
  Actions,
  ActionCreators as AuthActionCreators
} from './actions'

import { ActionCreators as AppActions } from '../app/actions'
import { ActionCreators as NotfActions } from '../notifications/actions'

function * authSaga (action) {
  const svc = yield select(getService, 'auth')
  let errorAction = null
  switch (action.type) {
    case Actions.LOG_IN:
      try {
        yield put(startSubmit(config.entityName))
        const ret = yield call(svc.login, action.username, action.password)

        if (ret && ret.user) {
          yield put(AppActions.setCsrfToken(ret.csrfToken))

          yield put(AuthActionCreators.setUser(ret.user))
          yield put(NotfActions.startPolling())

          // redirect to target location if any
          const targetLocation = action.redirect || '/'
          browserHistory.push(targetLocation)
        } else {
          errorAction = stopSubmit(config.entityName, ret.message)
        }
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      break

    case Actions.LOG_OUT:
      try {
        yield call(svc.logout)
      } catch (error) {
        console.log('logout error', error)
      } finally {
        yield put(NotfActions.stopPolling())
        yield put(AuthActionCreators.setUser({}))
        browserHistory.push('/login')
      }
      break

    default:
      throw new Error('Unsupported trigger action in auth saga', action)
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default takeLatest([
  Actions.LOG_IN,
  Actions.LOG_OUT
], authSaga)
