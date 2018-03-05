import config from './config'
const entityName = config.entityName
import {Actions, ActionCreators as DocumentActions} from './actions'
import {ActionCreators as ClientActions} from '../clients/actions'
import {ActionCreators as FormActions} from '../form-templates/actions'
import {getService} from '../app/selectors'
import { handleError } from '../commonHandlers'
import {call, put, select, takeEvery} from 'redux-saga/effects'
import {startSubmit, stopSubmit} from 'redux-form'

// Saga
function * clientDocumentSaga (action) {
  let errorAction = null
  const clientSvc = yield select(getService, 'clients')
  switch (action.type) {
    case Actions.LOAD_DOCUMENT:
      try {
        const promises = [
          clientSvc.get(action.clientId),
          clientSvc.getDocument(action.documentId)
        ]

        const results = yield call([Promise, Promise.all], promises)
        const client = results[0]
        const document = results[1]
        if (document) {
          yield put(FormActions.fetchEditedEntity(document.formId))
        }

        yield put(ClientActions.setEditedEntity(client))
        yield put(DocumentActions.setEditedEntity(document))
      } catch (error) {
        errorAction = handleError(entityName, error)
      }
      break

    case Actions.SAVE_DOCUMENT:
      yield put(startSubmit(entityName))
      try {
        const newEntity = yield call(clientSvc.saveDocument, action.entity)
        yield put(DocumentActions.setEditedEntity(newEntity))
        if (action.callback) {
          yield call(action.callback, newEntity)
        }
        yield put(stopSubmit(entityName, {}))
      } catch (error) {
        errorAction = handleError(entityName, error)
      }
      break

    default:
      throw new Error('Unsupported trigger action client saga', action)
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default takeEvery([
  Actions.LOAD_DOCUMENT,
  Actions.SAVE_DOCUMENT
], clientDocumentSaga)
