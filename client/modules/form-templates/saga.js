import config from './config'
import {call, put, select, takeEvery, all} from 'redux-saga/effects'
import {omit} from 'lodash'

import { Actions, ActionCreators } from './actions'
import { createBaseSaga, createBaseSagaWatcher } from '../common/sagas'
import {getService} from '../app/selectors'
import Selectors from './selectors'

import { handleError } from '../commonHandlers'

// Saga
const baseSaga = createBaseSaga(config.entityName, Actions, ActionCreators, getService, Selectors, handleError)

const specificFormSaga = function * baseSaga (action) {
  let errorAction = null

  switch (action.type) {
    case Actions.FETCH_EDITED_FORM:
      yield put(ActionCreators.setFetchingEntity(true))
      try {
        const svc = yield select(getService, config.entityName)
        const entity = yield call(svc.get, action.id)
        const formData = omit(entity, 'fields')
        yield all([
          put(ActionCreators.setEditedEntity(formData)),
          put(ActionCreators.setEditedFormFields(entity.fields)),
          put(ActionCreators.resetEditedEntity())
        ])
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      yield put(ActionCreators.setFetchingEntity(false))
      break

    case Actions.ADD_FIELD:
      yield put(ActionCreators.setEditedField(action.field))
      break

    case Actions.DELETE_FIELD:
      yield put(ActionCreators.setEditedField(null))
      break

    default:
      throw new Error('Unsupported trigger action in default saga', action)
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default [
  takeEvery([
    Actions.FETCH_EDITED_FORM,
    Actions.ADD_FIELD,
    Actions.DELETE_FIELD
  ], specificFormSaga),
  createBaseSagaWatcher(Actions, baseSaga)
]
