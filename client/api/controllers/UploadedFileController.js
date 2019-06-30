import {isArray} from 'lodash'
import {ObjectId} from 'mongodb'
import {UploadedFileRepository} from '../repository'
import {makeFindAllHandler, makeFindById, makeHandlePost, makeHandleDelete, makeHandlePut, setAuthor} from './StandardController'
import {requiresRole, parseFilters, entityFromBody} from '../middlewares'
import {uploadedFileSchema} from '../../modules/uploaded-files/schema'
import {NotificationTypes} from '../../modules/notifications/schema'
import {createClientNotifications} from './notifications/create-notifications'
import ROLES from '../../modules/accounts/roles'
import {Schema} from 'sapin'
import {objectId} from '../../modules/common/validate'
import fs from 'fs'
import path from 'path'
import multiparty  from 'multiparty'

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
            outputStream.on('finish', () => {
              outputStream.close()
              res.json({success: true})
              next()
            })

            const form = new multiparty.Form();

            // Errors may be emitted
            form.on('error', function(err) {
              next({httpStatus: 500, message: err})
            })

            // Parts are emitted when parsing the form
            form.on('part', function(part) {
              // You *must* act on the part by reading it
              // NOTE: if you want to ignore it, just call "part.resume()"
              if (!part.filename) {
                part.resume()
              }

              if (part.filename) {
                part.pipe(outputStream)
                part.resume()
              }

              part.on('error', function(err) {
                console.log('Error on stream: ', err) 
                next({httpStatus: 500, message: err})
              })
            });

            // Parse req
            form.parse(req);
          })
      })
      .catch(next)
    }
}

function deleteLocalFiles (appPath) {
  return function (req, res, next) {
    const fileRepo = new UploadedFileRepository(req.database)

    if (!isArray(req.body) || req.body.length === 0) {
      throw {httpStatus: 400, message: 'no ids provided in the body'}
    } else {
      const ids = req.body.map(ObjectId)
      fileRepo.findByIds(ids)
        .then(files => {
          const promises = []
          for (let i = 0; i < files.length; i++) {
            let fullPath = path.join(appPath, files[i].uri) 
            promises.push(fs.promises.unlink(fullPath))
          }
          return Promise.all(promises)
        })
        .then(() => next())
        .catch(next)
    }
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
      setAuthor,
      makeHandlePost(UploadedFileRepository),
      createClientNotifications({type: NotificationTypes.ClientFileCreated })
    ])
    .delete([
      deleteLocalFiles(context.appPath),
      makeHandleDelete(UploadedFileRepository)
    ])

  router.route('/uploaded-files/:id')
    .get(makeFindById(UploadedFileRepository))
    .put([entityFromBody(uploadedFileSchema), makeHandlePut(UploadedFileRepository)])
    

  router.route('/uploaded-files/:id/content')
    .put(saveFile(context.appPath))
}
