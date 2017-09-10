import { call, put, select } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'
import { isArray } from 'lodash'
import { startSubmit, stopSubmit, initialize } from 'redux-form'

// errorHandler(entityName, error) : must be a global error handler that returns null or an action to perform
export const createBaseSaga = (entityName, Actions, ActionCreators, getService, ModuleSelectors, errorHandler = () => null) => {
  function * baseSaga (action) {
    const svc = yield select(getService, entityName)
    let errorAction = null
    switch (action.type) {
      case Actions.FETCH_ALL:
        yield put(ActionCreators.setFetching(true))
        try {
          const optionalId = action.id || null
          const requestHeaders = {}
          requestHeaders.fetchReferences = action.fetchReferences || false

          const entities = yield call(svc.get, optionalId)
          if (isArray(entities)) {
            yield put(ActionCreators.setEntities(entities, action.replace))
          } else if (entities.content) {
            yield put(ActionCreators.setEntities(entities.content, action.replace))
            yield put(ActionCreators.setServerListCount(entities.totalElements))
          } else {
            throw new Error('Invalid entities data format')
          }
        } catch (error) {
          errorAction = errorHandler(entityName, error)
        }
        yield put(ActionCreators.setFetching(false))
        break

      case Actions.CREATE_REMOTE_ENTITY:
        yield put(startSubmit(entityName))
        try {
          const newEntity = yield call(svc.save, action.entity)
          yield put(ActionCreators.setEntities(newEntity))
          let serverListCount = yield select(ModuleSelectors.getServerListCount)
          yield put(ActionCreators.setServerListCount(serverListCount + 1))

          if (action.callback) {
            yield call(action.callback, newEntity)
          }
          yield put(stopSubmit(entityName, {}))
        } catch (error) {
          errorAction = errorHandler(entityName, error)
        }
        break

      case Actions.DELETE_REMOTE_ENTITIES:
        yield put(startSubmit(entityName))
        try {
          yield call(svc.delete, action.remoteIds)
          yield put(ActionCreators.clearSelectedItems()) // put in callback
          yield put(ActionCreators.fetchAll())
          if (action.callback) {
            yield call(action.callback)
          }
          yield put(stopSubmit(entityName, {}))
        } catch (error) {
          errorAction = errorHandler(entityName, error)
        }
        break

      case Actions.UPDATE_REMOTE_ENTITY:
        yield put(startSubmit(entityName))
        try {
          const newEntity = yield call(svc.save, action.entity)

          yield put(ActionCreators.setEntities(newEntity))
          if (action.callback) {
            yield call(action.callback, newEntity)
          }
          yield put(stopSubmit(entityName, {}))
        } catch (error) {
          errorAction = errorHandler(entityName, error)
        }
        break

      case Actions.FETCH_EDITED_ENTITY:
        yield put(ActionCreators.setFetching(true))
        try {
          const entity = yield call(svc.get, action.id)
          yield put(ActionCreators.setEditedEntity(entity))
          yield put(initialize(entityName, entity))
        } catch (error) {
          errorAction = errorHandler(entityName, error)
        }
        yield put(ActionCreators.setFetching(false))
        break

      case Actions.CREATE_REMOTE_ENTITIES:
        yield put(startSubmit(entityName))
        try {
          const createdEntities = yield call(svc.createEntities, action.entities)

          yield put(ActionCreators.clearSelectedItems()) // put in callback
          if (action.callback) {
            yield call(action.callback, createdEntities)
          }
          yield put(stopSubmit(entityName, {}))
        } catch (error) {
          errorAction = errorHandler(entityName, error)
        }
        break

      case Actions.UPDATE_REMOTE_ENTITIES:
        yield put(startSubmit(entityName))
        try {
          const updatedEntities = yield call(svc.updateEntities, action.entities)

          yield put(ActionCreators.clearSelectedItems()) // put in callback
          if (action.callback) {
            yield call(action.callback, updatedEntities)
          }
          yield put(stopSubmit(entityName, {}))
        } catch (error) {
          errorAction = errorHandler(entityName, error)
        }
        break

      default:
        throw new Error('Unsupported trigger action in default saga', action)
    }

    if (errorAction) {
      yield put(errorAction)
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
