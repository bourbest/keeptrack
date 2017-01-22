
import { browserHistory } from 'react-router'

import { call, put, select } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'

import { getService } from '../selectors/app-selectors'

import {
  Actions,
  ActionCreators as ClientFileActionCreators
} from '../modules/client-file'

function * clientFileSaga (action) {
  const svc = yield select(getService, 'client-files')

  switch (action.type) {
    case Actions.FETCH_FILES:
      const optionalId = action.id || null

      yield put(ClientFileActionCreators.setFetching(true))

      const files = yield call(svc.get, optionalId)
      yield put(ClientFileActionCreators.setFiles(files, true))

      yield put(ClientFileActionCreators.setFetching(false))
      break

    case Actions.CREATE_FILE:
      try {
        const newFile = yield call(svc.save, action.file)
        yield put(ClientFileActionCreators.setFiles(newFile))
        browserHistory.replace(`/client/${newFile.id}`)
        browserHistory.push('/client/')
      } catch (error) {
        yield put(ClientFileActionCreators.setFetchError(error))
      }
      break

    case Actions.DELETE_FILES:
      yield call(svc.delete, action.remoteIds)
      yield put(ClientFileActionCreators.clearSelectedItems())
      yield put(ClientFileActionCreators.fetchFiles())
      break

    case Actions.UPDATE_FILE:
      const newFile = yield call(svc.save, action.file)
      yield put(ClientFileActionCreators.setFiles(newFile))
      browserHistory.push('/client/')
      break

    case Actions.LOAD_EDITED_FILE:
      const file = yield call(svc.get, action.id)
      yield put(ClientFileActionCreators.setEditedFile(file))
      break

    default:
      throw new Error('Unsupported trigger action in client-file saga', action)
  }
}

export default function * clientFileSagaWatcher () {
  yield * takeLatest([
    Actions.FETCH_FILES,
    Actions.CREATE_FILE,
    Actions.UPDATE_FILE,
    Actions.LOAD_EDITED_FILE,
    Actions.DELETE_FILES
  ], clientFileSaga)
}
