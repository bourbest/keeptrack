import config from './config'
const entityName = config.entityName
import {Actions, ActionCreators as DocumentActions} from './actions'
import {getService} from '../app/selectors'
import DocumentSelectors from '../client-documents/selectors'
import { handleError } from '../commonHandlers'
import {call, put, select, takeEvery, all} from 'redux-saga/effects'
import {startSubmit, stopSubmit} from 'redux-form'

// Saga
function * clientDocumentSaga (action) {
  let errorAction = null
  const [clientSvc, docSvc, formSvc] = yield all([
    select(getService, 'clients'),
    select(getService, 'client-documents'),
    select(getService, 'form-templates')
  ])

  switch (action.type) {
    case Actions.LOAD_DOCUMENT:
      try {
        yield all([
          put(DocumentActions.setFetchingEntity(true)),
          put(DocumentActions.setTemplate(null))
        ])

        const document = yield call(docSvc.get, action.documentId)

        const promises = [formSvc.get(document.formId)]
        if (document.clientId) {
          promises.push(clientSvc.get(document.clientId))
        }

        const results = yield call([Promise, Promise.all], promises)
        const formTemplate = results[0]
        const client = results[1]

        yield all([
          put(DocumentActions.setClient(client)),
          put(DocumentActions.setEditedEntity(document)),
          put(DocumentActions.setTemplate(formTemplate))
        ])
      } catch (error) {
        errorAction = handleError(entityName, error)
      }
      yield put(DocumentActions.setFetchingEntity(false))
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
      try {
        yield put(DocumentActions.setFetchingEntity(true))

        const promises = [formSvc.get(action.formTemplateId)]
        if (action.clientId) {
          promises.push(clientSvc.get(action.clientId))
        }

        const results = yield call([Promise, Promise.all], promises)
        const formTemplate = results[0]
        const client = results[1]
        const newDoc = DocumentSelectors.buildNewEntity(formTemplate, action.clientId)
        yield all([
          put(DocumentActions.setTemplate(formTemplate)),
          put(DocumentActions.setEditedEntity(newDoc)),
          put(DocumentActions.setClient(client))
        ])
      } catch (error) {
        errorAction = handleError(entityName, error)
      }
      yield put(DocumentActions.setFetchingEntity(false))
      break

    case Actions.RESET_FORM:
      const formTemplate = yield select(DocumentSelectors.getTemplate)
      const newDoc = DocumentSelectors.buildNewEntity(formTemplate, null)
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
