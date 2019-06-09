import {ObjectId} from 'mongodb'
import {UploadedFileRepository} from '../repository'
import {makeFindAllHandler, makeFindById, makeHandlePost, makeHandleDelete, makeHandlePut} from './StandardController'
import {requiresRole, parseFilters, entityFromBody} from '../middlewares'
import {uploadedFileSchema} from '../../modules/uploaded-files/schema'
import ROLES from '../../modules/accounts/roles'
import {Schema} from 'sapin'
import {objectId} from '../../modules/common/validate'
import fs from 'fs'
import path from 'path'

const filtersSchema = new Schema({
  clientId: objectId
})

function setFileUri (req, res, next) {
  const fileMeta = req.entity
  fileMeta.id = new ObjectId()
  const fileId = fileMeta.id.toString()
  const len = fileId.length
  const sub1 = fileId.substr(len - 3, 3)
  const sub2 = fileId.substr(len - 6, 3)
  const ext = fileMeta.name.split('.')
  fileMeta.uri = `/public/uploaded-files/${sub1}/${sub2}/${fileId}`
  if (ext.length > 1) {
    fileMeta.uri = fileMeta.uri + '.' + ext[ext.length - 1]
  } 
  next()
}

function saveFile (appPath) {
  return function (req, res, next) {
    const fileRepo = new UploadedFileRepository(req.database)

    fileRepo.findById(req.params.id)
      .then(file => {
        if (!file) {
          return next({httpStatus: 400, message: 'File does not exist'})
        }
        const fullPath = path.join(appPath, file.uri) 
        const subDirectories = fullPath.split('\\')
        subDirectories.splice(-1,1)
        const subDirPath = subDirectories.join('/')
        return fs.promises.mkdir(subDirPath, { recursive: true })
          .then(() => {
            const outputStream = fs.createWriteStream(fullPath)
            req.pipe(outputStream)
            outputStream.on('finish', () => {
              outputStream.close()
              res.json({success: true})
              next()
            })
          })
      })
      .catch(next)
    }
}

function deleteLocalFile (appPath) {
  return function (req, res, next) {
    const fileRepo = new UploadedFileRepository(req.database)

    fileRepo.findById(req.params.id)
      .then(file => {
        if (!file) {
          return next({httpStatus: 400, message: 'File does not exist'})
        }
        const fullPath = path.join(appPath, file.uri) 
        return fs.promises.unlink(fullPath)
          .then(() => next())
      })
      .catch(next)
    }
}

export default (router, context) => {
  router.use('/uploaded-files', requiresRole(ROLES.canInteractWithClient))
  router.route('/uploaded-files')
    .get([
      parseFilters(filtersSchema),
      makeFindAllHandler(UploadedFileRepository)
    ])
    .post([
      entityFromBody(uploadedFileSchema),
      setFileUri,
      makeHandlePost(UploadedFileRepository)
    ])

  router.route('/uploaded-files/:id')
    .get(makeFindById(UploadedFileRepository))
    .put([entityFromBody(uploadedFileSchema), makeHandlePut(UploadedFileRepository)])
    .delete([
      deleteLocalFile(context.appPath),
      makeHandleDelete(UploadedFileRepository)
    ])

  router.route('/uploaded-files/:id/content')
    .put(saveFile(context.appPath))

}
