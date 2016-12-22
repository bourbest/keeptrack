import clientFiles from '../mock-data/client-files.json'
import { keyBy, get, maxBy } from 'lodash'

let nextClientFileId = maxBy(clientFiles, 'id').id + 1
console.log(nextClientFileId)
const fakeRequest = (returnValue) => {
  const simulatedDelay = Math.random() * 500 + 200

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(returnValue)
    }, simulatedDelay)
  })
}

const ClientFileService = {
  fetchFiles (id) {
    let ret = clientFiles
    if (id) {
      const filesById = keyBy(clientFiles, 'id')
      ret = {...get(filesById, parseInt(id), null)}
      if (ret) {
        ret.documents = [{name: 'fichier 1', type: 'déclaration'}]
      }
    }
    return fakeRequest(ret)
  },

  saveFile (file) {
    console.log(file)
    if (!file.id) {
      file.id = nextClientFileId
      nextClientFileId++
    }

    return fakeRequest(file)
  }
}

export default ClientFileService
