import config from './config'
import { Actions, ActionCreators } from './actions'
import {getService} from '../app/selectors'
import Selectors from './selectors'
import { handleError } from '../commonHandlers'

import {isEqual} from 'lodash'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { startSubmit, stopSubmit } from 'redux-form'

// handleError(entityName, error) : must be a global error handler that returns null or an action to perform
function * feedSaga (action) {
  const svc = yield select(getService, config.entityName)
  let errorAction = null
  switch (action.type) {
    case Actions.FETCH_LIST:
      const previousContext = yield select(Selectors.getCurrentPageContext)
      const newContext = {...action.serverFilters}

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
        yield put(startSubmit(config.entityName))
        const newEntity = yield call(svc.save, action.entity)
        if (action.callback) {
          yield call(action.callback, newEntity)
        }
        yield put(ActionCreators.addLocalEntities([newEntity]))
        yield put(stopSubmit(config.entityName, {}))
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      break

    case Actions.DELETE_REMOTE_ENTITIES:
      yield put(startSubmit(config.entityName))
      try {
        yield call(svc.delete, action.remoteIds)
        yield put(ActionCreators.removeLocalEntities(action.remoteIds))
        if (action.callback) {
          yield call(action.callback)
        }
        yield put(stopSubmit(config.entityName, {}))
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      break

    default:
      throw new Error('Unsupported trigger action in clientFeed saga', action)
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default [
  takeEvery([
    Actions.FETCH_LIST,
    Actions.SAVE_REMOTE_ENTITY,
    Actions.DELETE_REMOTE_ENTITIES
  ], feedSaga)
]

