import { Actions, ActionCreators } from './actions'
import {getService} from '../app/selectors'
import { handleError } from '../commonHandlers'

import { call, put, select, takeLatest } from 'redux-saga/effects'

function * myClientsSaga (action) {
  let errorAction = null
  try {
    const clientSvc = yield select(getService, 'clients')
    yield put(ActionCreators.setFetchingMyClients(true))
    const response = yield call(clientSvc.getMyClients)

    yield put(ActionCreators.setMyClients(response))
  } catch (ex) {
    errorAction = handleError('dashboard', ex)
    if (errorAction) {
      yield put(errorAction)
    }
  }
  yield put(ActionCreators.setFetchingMyClients(false))
}

function * myIncompleteDocumentsSaga (action) {
  let errorAction = null
  try {
    const clientDocSvc = yield select(getService, 'client-documents')
    yield put(ActionCreators.setFetchingMyIncompleteDocuments(true))
    const response = yield call(clientDocSvc.getMyIncompleteDocuments)

    yield put(ActionCreators.setMyIncompleteDocuments(response))
  } catch (ex) {
    errorAction = handleError('dashboard', ex)
    if (errorAction) {
      yield put(errorAction)
    }
  }
  yield put(ActionCreators.setFetchingMyIncompleteDocuments(false))
}

export default [
  takeLatest(Actions.FETCH_MY_CLIENTS, myClientsSaga),
  takeLatest(Actions.FETCH_MY_INCOMPLETE_DOCUMENTS, myIncompleteDocumentsSaga)
]
