import RestService from './base/rest-service'
const url = 'uploaded-files'

export default class UploadedFileService extends RestService {
  constructor (apiClient) {
    super(url, apiClient)
    this.uploadFile = this.uploadFile.bind(this)
  }

  uploadFile (fileId, filePointer, onProgressCallback) {
    return this.apiClient.putFile(`/uploaded-files/${fileId}/content`, filePointer, onProgressCallback)
  }
}
