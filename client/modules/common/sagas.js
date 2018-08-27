import {isEqual} from 'lodash'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { startSubmit, stopSubmit } from 'redux-form'
import {PAGE_SIZE} from './selectors'

// errorHandler(entityName, error) : must be a global error handler that returns null or an action to perform
export const createBaseSaga = (entityName, Actions, ActionCreators, getService, ModuleSelectors, errorHandler = () => null) => {
  function * baseSaga (action) {
    const svc = yield select(getService, entityName)
    let errorAction = null
    switch (action.type) {
      case Actions.FETCH_LIST:
        const previousContext = yield select(ModuleSelectors.getCurrentPageContext)
        const newContext = {...action.serverFilters}
        if (!newContext.limit) {
          newContext.limit = PAGE_SIZE
        }
        if (!newContext.page) {
          newContext.page = 1
        }
        // fetch only if we do not already have the page
        const shouldFetch = !isEqual(previousContext, newContext)
        if (shouldFetch) {
          yield put(ActionCreators.setFetchingList(true))

          const response = yield call(svc.list, newContext)

          yield put(ActionCreators.setEntitiesPage(action.serverFilters, response.entities, response.totalCount))
          yield put(ActionCreators.setFetchingList(false))
        }
        break

      case Actions.SAVE_REMOTE_ENTITY:
        try {
          yield put(startSubmit(entityName))
          const newEntity = yield call(svc.save, action.entity)
          yield put(ActionCreators.resetFetchContext())
          if (action.callback) {
            yield call(action.callback, newEntity)
          }
          yield put(stopSubmit(entityName, {}))
        } catch (error) {
          errorAction = errorHandler(entityName, error)
        }
        break

      case Actions.ARCHIVE_REMOTE_ENTITIES:
      case Actions.RESTORE_REMOTE_ENTITIES:
      case Actions.DELETE_REMOTE_ENTITIES:
        yield put(startSubmit(entityName))
        try {
          if (action.type === Actions.ARCHIVE_REMOTE_ENTITIES) {
            yield call(svc.archive, action.remoteIds)
          } else if (action.type === Actions.DELETE_REMOTE_ENTITIES) {
            yield call(svc.delete, action.remoteIds)
          } else {
            yield call(svc.restore, action.remoteIds)
          }
          yield put(ActionCreators.removeLocalEntities(action.remoteIds))
          if (action.callback) {
            yield call(action.callback)
          }
          yield put(stopSubmit(entityName, {}))
        } catch (error) {
          errorAction = errorHandler(entityName, error)
        }
        break

      case Actions.FETCH_ENTITY:
        try {
          let entity = yield select(ModuleSelectors.getEditedEntity)
          if (!entity || entity.id !== action.id) {
            yield put(ActionCreators.setFetchingEntity(true))
            entity = yield call(svc.get, action.id)
            yield put(ActionCreators.setFetchingEntity(false))
          }
          yield put(ActionCreators.setEditedEntity(entity))
          yield put(ActionCreators.resetEditedEntity())
        } catch (error) {
          console.log(error)
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
  return takeEvery([
    Actions.FETCH_LIST,
    Actions.FETCH_ENTITY,
    Actions.SAVE_REMOTE_ENTITY,
    Actions.DELETE_REMOTE_ENTITIES,
    Actions.ARCHIVE_REMOTE_ENTITIES,
    Actions.RESTORE_REMOTE_ENTITIES
  ], saga)
}
