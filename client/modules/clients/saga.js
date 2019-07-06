import config from './config'
import { Actions, ActionCreators } from './actions'
import { ActionCreators as LinkActionCreators } from '../client-links/actions'
import { createBaseSaga, createBaseSagaWatcher } from '../common/sagas'
import {getService} from '../app/selectors'
import {canSeeClientFileContent} from '../authentication/selectors'
import Selectors from './selectors'
import { handleError } from '../commonHandlers'
import {select, put, call, takeEvery, all} from 'redux-saga/effects'
import { CLIENT_FORM_ID } from '../const'
// Saga
const baseSaga = createBaseSaga(config.entityName, Actions, ActionCreators, getService, Selectors, handleError)

// Saga
function * clientSaga (action) {
  let errorAction = null
  switch (action.type) {
    case Actions.LOAD_CLIENT:
      const [clientSvc, fileSvc, fetchDocuments] = yield all([
        select(getService, 'clients'),
        select(getService, 'uploaded-files'),
        select(canSeeClientFileContent),
        put(ActionCreators.setClientDocuments([])),
        put(ActionCreators.setFiles([], true)),
        put(LinkActionCreators.setLinks([])),
        put(LinkActionCreators.loadLinksForClient(action.clientId)),
        put(ActionCreators.setFetchingEntity(true))
      ])

      try {
        const promises = [
          clientSvc.get(action.clientId)
        ]
        if (fetchDocuments) {
          promises.push(clientSvc.getDocumentsByClientId(action.clientId))
          promises.push(fileSvc.list({clientId: action.clientId}))
        }
        const results = yield call([Promise, Promise.all], promises)

        const setActions = [
          put(ActionCreators.setEditedEntity(results[0]))
        ]
        if (fetchDocuments) {
          setActions.push(put(ActionCreators.setClientDocuments(results[1].entities)))
          setActions.push(put(ActionCreators.setFiles(results[2].entities, true)))
        }
        yield all(setActions)
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      yield put(ActionCreators.setFetchingEntity(false))
      break

    case Actions.FETCH_CLIENT_FORM:
      const formSvc = yield select(getService, 'form-templates')
      yield put(ActionCreators.setFetchingClientForm(true))
      try {
        const form = yield call(formSvc.get, CLIENT_FORM_ID)
        yield put(ActionCreators.setClientForm(form))
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      yield put(ActionCreators.setFetchingClientForm(false))
      break

    default:
      throw new Error('Unexpected action in clientSaga')
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default [
  createBaseSagaWatcher(Actions, baseSaga),
  takeEvery([Actions.LOAD_CLIENT, Actions.FETCH_CLIENT_FORM], clientSaga)
]
