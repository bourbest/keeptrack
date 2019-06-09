import config from './config'
import { createActions } from '../common/actions'

const prefix = config.entityName.toUpperCase()

export const Actions = createActions(prefix, [
  'UPLOAD_FILE',
  'DELETE_FILE',
  'UPDATE_FILE_INFO'
])

export const ActionCreators = {
  uploadFile: (filePointer, fileMetadata, onProgressCallback) => ({ type: Actions.UPLOAD_FILE, filePointer, fileMetadata, onProgressCallback }),
  updateFileInfo: (fileInfo, cb) => ({type: Actions.UPDATE_FILE_INFO, fileInfo, cb}),
  deleteFile: (fileId) => ({ type: Actions.DELETE_FILE, fileId })
}
