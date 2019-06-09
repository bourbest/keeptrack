import config from './config'
import { Actions, ActionCreators } from './actions'
import {getService} from '../app/selectors'
import { handleError } from '../commonHandlers'
import {select, put, call, takeEvery} from 'redux-saga/effects'
import { formatDate } from '../../services/string-utils';

// Saga
function * fileSaga (action) {
  let errorAction = null
  const fileSvc = yield select(getService, config.entityName)

  switch (action.type) {
    case Actions.UPLOAD_FILE:
    try {
        let fileMeta = {
          isArchived: false,
          name: action.filePointer.name,
          documentDate: formatDate(new Date(action.filePointer.lastModified)),
          ...action.fileMetadata
        }
        
        fileMeta = yield call(fileSvc.save, fileMeta)

        yield call(fileSvc.uploadFile, fileMeta.id, action.filePointer, action.onProgressCallback)
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }

      break

    case Actions.DELETE_FILE:
      yield call(svc.deleteFile, action.file)
      break

    case Actions.UPDATE_FILE_INFO:
      try {
        const updatedFileInfo = yield call(fileSvc.save, action.fileInfo)
        if (action.cb) {
          yield call(action.cb, updatedFileInfo)
        }
      } catch (ex) {
        errorAction = handleError(config.entityName, ex)
      }
      break
    default:
      throw new Error('Unexpected action in uploadedFileSaga')
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default takeEvery([
  Actions.UPLOAD_FILE,
  Actions.DELETE_FILE,
  Actions.UPDATE_FILE_INFO
], fileSaga)
