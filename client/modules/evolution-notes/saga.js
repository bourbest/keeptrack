import config from './config'
const entityName = config.entityName
import {Actions, ActionCreators} from './actions'
import {getService} from '../app/selectors'
import {handleError} from '../commonHandlers'
import {startSubmit, stopSubmit, initialize} from 'redux-form'
import {call, put, select, takeEvery} from 'redux-saga/effects'

function * noteSaga (action) {
  const svc = yield select(getService, entityName)
  let errorAction = null
  switch (action.type) {
    case Actions.SAVE_NOTE:
      yield put(startSubmit(entityName))
      try {
        const newEntity = yield call(svc.save, action.note)

        if (action.callback) {
          yield call(action.callback, newEntity)
        }
        yield put(stopSubmit(entityName, {}))
      } catch (error) {
        console.log('noteSaga', error)
        errorAction = handleError(entityName, error)
      }
      break

    case Actions.RESET_FORM:
      yield put(initialize(entityName, {}))
      yield put(ActionCreators.setClient(null))
      break
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default takeEvery([
  Actions.SAVE_NOTE,
  Actions.RESET_FORM
], noteSaga)
