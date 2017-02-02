import { call, put, select } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

import { getService } from '../app/selectors'

export const createBaseSaga = (entityName, Actions, ActionCreators) => {
  function * baseSaga (action) {
    const svc = yield select(getService, entityName)

    switch (action.type) {
      case Actions.FETCH_ALL:
        const optionalId = action.id || null

        yield put(ActionCreators.setFetching(true))

        const entities = yield call(svc.get, optionalId)
        yield put(ActionCreators.setEntities(entities, true))

        yield put(ActionCreators.setFetching(false))
        break

      case Actions.CREATE_REMOTE_ENTITY:
        try {
          const newEntity = yield call(svc.save, action.entity)
          if (action.callback) {
            yield call(action.callback, newEntity)
          }
          yield put(ActionCreators.setFiles(newEntity))
        } catch (error) {
          yield put(ActionCreators.setFetchError(error))
        }
        break

      case Actions.DELETE_REMOTE_ENTITIES:
        yield call(svc.delete, action.remoteIds)
        yield put(ActionCreators.clearSelectedItems()) // put in callback
        yield put(ActionCreators.fetchAll())
        break

      case Actions.UPDATE_REMOTE_ENTITY:
        const newEntity = yield call(svc.save, action.entity)
        yield put(ActionCreators.setEntities(newEntity))
        if (action.callback) {
          yield call(action.callback, newEntity)
        }
        break

      case Actions.FETCH_EDITED_ENTITY:
        const file = yield call(svc.get, action.id)
        yield put(ActionCreators.setEditedEntity(file))
        break

      default:
        throw new Error('Unsupported trigger action in default saga', action)
    }
  }

  return baseSaga
}

export const createBaseSagaWatcher = (Actions, saga) => {
  function * sagaWatcher () {
    yield * takeEvery([
      Actions.FETCH_ALL,
      Actions.CREATE_REMOTE_ENTITY,
      Actions.UPDATE_REMOTE_ENTITY,
      Actions.FETCH_EDITED_ENTITY,
      Actions.DELETE_REMOTE_ENTITIES
    ], saga)
  }

  return sagaWatcher
}
