import config from './config'
import { createActions } from '../common/actions'
import {initialize} from 'redux-form'
const prefix = config.entityName.toUpperCase()

export const Actions = createActions(prefix, [
  'UPLOAD_FILES',
  'UPDATE_FILES_INFO',
  'DELETE_FILE',

  'INITIALIZE_UPLOAD_PROGRESSES',
  'CLEAR_FILE_TO_UPLOAD_LIST',
  'UPDATE_UPLOAD_PROGRESS'
])

export const ActionCreators = {
  uploadFiles: (filePointers, metadata) => ({ type: Actions.UPLOAD_FILES, filePointers, metadata }),
  updateFilesInfo: (files, cb) => ({type: Actions.UPDATE_FILES_INFO, files, cb}),
  deleteFile: (fileId) => ({ type: Actions.DELETE_FILE, fileId }),

  initializeUploadProgresses: (count) => ({type: Actions.INITIALIZE_UPLOAD_PROGRESSES, count}),
  clearFileToUploadList: () => ({type: Actions.CLEAR_FILE_TO_UPLOAD_LIST}),
  updateUploadProgress: (index, progress) => ({type: Actions.UPDATE_UPLOAD_PROGRESS, index, progress}),
  initializeReviewFilesForm: (fileInfos) => initialize(config.entityName, fileInfos),
  resetReviewFilesForm: () => initialize(config.entityName, {files:[]})
}
