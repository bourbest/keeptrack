import config from './config'
import { call, put, select, takeEvery, all } from 'redux-saga/effects'
import { Actions, ActionCreators } from './actions'
import {getService} from '../app/selectors'
import { handleError } from '../commonHandlers'

function * clientLinkSaga (action) {
  let errorAction = null
  const linkSvc = yield select(getService, 'client-links')

  switch (action.type) {
    case Actions.LOAD_LINKS_FOR_CLIENT:
      yield put(ActionCreators.setFetching(true))
      try {
        const links = yield call(linkSvc.getForClientId, action.clientId)
        yield all([
          put(ActionCreators.setLinks(links)),
          put(ActionCreators.setFetching(false))
        ])
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      break

    case Actions.CREATE:
      try {
        const newLink = yield call(linkSvc.create, action.clientId, action.link)
        newLink.client = {...action.otherClient}
        yield put(ActionCreators.addLocalLink(newLink))
        if (action.cb) {
          yield call(action.cb, newLink)
        }
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      break

    case Actions.DELETE:
      try {
        yield call(linkSvc.delete, action.clientId, action.ids)
        yield put(ActionCreators.removeLocalLinks(action.ids))
        if (action.cb) {
          yield call(action.cb, action.ids.length)
        }
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      break
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default takeEvery([
  Actions.LOAD_LINKS_FOR_CLIENT,
  Actions.CREATE,
  Actions.DELETE
], clientLinkSaga)
