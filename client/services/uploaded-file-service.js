import {Promise} from 'bluebird'
import RestService from './base/rest-service'
const url = 'uploaded-files'

export default class UploadedFileService extends RestService {
  constructor (apiClient) {
    super(url, apiClient)
    this.uploadFile = this.uploadFile.bind(this)
  }

  uploadFile (fileId, filePointer, onProgressCallback) {
    return fileReader(filePointer)
      .then(result => {
        this.apiClient.putFile(`/uploaded-files/${fileId}/content`, result, onProgressCallback)
      })
  }
}

function fileReader (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(reader.result)
    }
    
    reader.readAsArrayBuffer (file)
  })
}
