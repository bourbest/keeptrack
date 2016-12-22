
import { browserHistory } from 'react-router'

import { call, put } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'

import {
  Actions,
  ActionCreators as ClientFileActionCreators
} from '../modules/client-file'

import ClientFileService from '../../services/client-file-service'

function * clientFileSaga (action) {
  switch (action.type) {
    case Actions.FETCH_FILES:
      try {
        const optionalId = action.id || null
        const files = yield call(ClientFileService.fetchFiles, optionalId)
        yield put(ClientFileActionCreators.setFiles(files))
      } catch (error) {
        yield put(ClientFileActionCreators.setError(error))
      }
      break

    case Actions.CREATE_FILE:
      try {
        const newFile = yield call(ClientFileService.saveFile, action.file)
        yield put(ClientFileActionCreators.setFiles(newFile))
        browserHistory.replace(`/client/${newFile.id}`)
      } catch (error) {
        yield put(ClientFileActionCreators.setError(error))
      }
      break

    case Actions.UPDATE_FILE:
      const newFile = yield call(ClientFileService.saveFile, action.file)
      yield put(ClientFileActionCreators.setFiles(newFile))
      break

    default:
      throw new Error('Unsupported trigger action in client-file saga', action)
  }
}

export default function * clientFileSagaWatcher () {
  yield * takeLatest([
    Actions.FETCH_FILES,
    Actions.CREATE_FILE
  ], clientFileSaga)
}
