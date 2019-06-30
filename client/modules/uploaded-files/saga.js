import config from './config'
import { Actions, ActionCreators } from './actions'
import {getService} from '../app/selectors'
import { handleError } from '../commonHandlers'
import {select, put, call, takeEvery, all} from 'redux-saga/effects'
import { formatDate } from '../../services/string-utils'
import {getStore} from '../../store'
// Saga
function * fileSaga (action) {
  let errorAction = null
  const fileSvc = yield select(getService, config.entityName)
  let promises = []
  switch (action.type) {
    case Actions.UPLOAD_FILES:
      try {
        const files = action.filePointers
        const reviewFilesForm = {
          files: []
        }

        // prepare file info
        for (let i = 0; i < files.length; i++) {
          reviewFilesForm.files.push({
            isArchived: false,
            name: files[i].name,
            documentDate: formatDate(new Date(files[i].lastModified)),
            ...action.metadata
          })
        }

        // create remote files
        for (let i = 0; i < reviewFilesForm.files.length; i++) {
          promises.push(fileSvc.save(reviewFilesForm.files[i]))
        }

        // initialize review form
        reviewFilesForm.files = yield call([Promise, Promise.all], promises)
        yield all([
          put(ActionCreators.initializeUploadProgresses(files.length)),
          put(ActionCreators.initializeReviewFilesForm(reviewFilesForm))
        ])

        // upload
        const actions = []
        let cb = null
        for (let i = 0; i < files.length; i++) {
          // create progress callback
          cb = function (progressEvent) {
            const store = getStore()
            const progress = Math.round(progressEvent.loaded * 100 / progressEvent.total)
            store.dispatch(ActionCreators.updateUploadProgress(i, progress))
          }

          // start upload of file
          actions.push(call(fileSvc.uploadFile, reviewFilesForm.files[i].id, files[i], cb))
        }
        yield all(actions)
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      break

    case Actions.DELETE_FILES:
      try {
        yield call(fileSvc.delete, action.fileIds)
        if (action.cb) {
          yield call(action.cb, action.fileIds.length)
        }
      } catch (ex) {
        errorAction = handleError(config.entityName, ex)
      }
      break

    case Actions.UPDATE_FILES_INFO:
      try {
        for (let i = 0; i < action.files.length; i++) {
          promises.push(fileSvc.save(action.files[i]))
        }
        const cbParam = yield call([Promise, Promise.all], promises)
        if (action.cb) {
          yield call(action.cb, cbParam)
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
  Actions.UPLOAD_FILES,
  Actions.DELETE_FILES,
  Actions.UPDATE_FILES_INFO
], fileSaga)
