import config from './config'
const entityName = config.entityName
import {Actions, ActionCreators as DocumentActions} from './actions'
import {ActionCreators as ClientActions} from '../clients/actions'
import {ActionCreators as FormActionCreators, Actions as FormActions} from '../form-templates/actions'
import {getService} from '../app/selectors'
import DocumentSelectors from '../client-documents/selectors'
import FormSelectors from '../form-templates/selectors'
import { handleError } from '../commonHandlers'
import {call, put, select, takeEvery, all, take} from 'redux-saga/effects'
import {startSubmit, stopSubmit} from 'redux-form'

// Saga
function * clientDocumentSaga (action) {
  let errorAction = null
  const [clientSvc, docSvc] = yield all([
    select(getService, 'clients'),
    select(getService, 'client-documents')
  ])

  switch (action.type) {
    case Actions.LOAD_DOCUMENT:
      try {
        const promises = [
          clientSvc.get(action.clientId),
          docSvc.get(action.documentId)
        ]

        const results = yield call([Promise, Promise.all], promises)
        const client = results[0]
        const document = results[1]
        if (document) {
          yield put(FormActionCreators.fetchEditedEntity(document.formId))
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
        const newEntity = yield call(docSvc.save, action.entity)
        yield put(DocumentActions.setEditedEntity(newEntity))
        if (action.callback) {
          yield call(action.callback, newEntity)
        }
        yield put(stopSubmit(entityName, {}))
      } catch (error) {
        errorAction = handleError(entityName, error)
      }
      break

    case Actions.INITIALIZE_NEW_DOCUMENT:
      yield all([
        put(FormActionCreators.fetchEditedEntity(action.formTemplateId)),
        take(action => action.type === FormActions.SET_FETCHING_ENTITY && action.isFetching === false)
      ])

      yield put(DocumentActions.resetForm())
      break

    case Actions.RESET_FORM:
      const template = yield select(FormSelectors.getEditedEntity)
      const newDoc = DocumentSelectors.buildNewEntity(template, null)
      yield all([
        put(DocumentActions.setClient(null)),
        put(DocumentActions.setEditedEntity(newDoc))
      ])
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
  Actions.SAVE_DOCUMENT,
  Actions.INITIALIZE_NEW_DOCUMENT,
  Actions.RESET_FORM
], clientDocumentSaga)
