const {createRevision} = require('./common')
const {forEach, filter, find, omit} = require('lodash')
const {ObjectId} = require('mongodb')

const REV_NUMBER = 7

function AllowEditGender (form, document) {
  if (form) {
    const field = find(form.fields, {id: 'gender'})
    field.lockChoiceValues = false
    field.lockRequired = false
  }
}

function correctPresence (form, document) {
  if (form) {
    form.fields = filter(form.fields, field => field.id !== 'c6' && field.id !== 'c8')
    const c8Field =  {
      columnCount: '2',
      id: 'c8',
      controlType: 'grid',
      order: 2,
      parentId: 'c0'
    }
    form.fields.push(c8Field)
  } else {
    const values = document.values
    if (values.c6[0] === '1') {
      values.c10 = '2'
    } else if (values.c6[0] === '2') {
      values.c10 = '3'
    }
    document.values = omit(values, 'c6')
  }
}

const formsToUpdate = [{
  formId: ObjectId('5ceea3b147f13c1bc4aae5f0'),
  otherTransforms: [correctPresence]
}, {
  formId: ObjectId('5bf88f6c0eb2621ae8703175'),
  otherTransforms: [AllowEditGender]
}]

function updateFormAndDocuments(db, formUpdate){
  const formsRepo = db.collection('FormTemplate')
  const docRepo = db.collection('ClientDocument')
  return formsRepo.findOne({_id: formUpdate.formId})
    .then(form => {
      console.log('updating form ' + form.name)
      forEach(formUpdate.otherTransforms, transform => transform(form))
      return formsRepo.replaceOne({_id: form._id}, form)
    }).then(() => {
      console.log('finding documents related to form')
      return docRepo.find({formId: formUpdate.formId}).toArray()
    }).then(documents => {
      console.log(`${documents.length} documents found`)
      const promises = []
      forEach(documents, document => {
        console.log('updating document id ' + document._id)
        if (formUpdate.fields) {
          for (let i = 0; i < formUpdate.fields.length; i++) {
            const propertyName = formUpdate.fields[i].id
            if (document.values[propertyName]) {
              document.values[propertyName] = document.values[propertyName][0]
            }
          }
        }
        if (formUpdate.otherTransforms) {
          forEach(formUpdate.otherTransforms, transform => {transform(null, document)})
        }
        promises.push(docRepo.replaceOne({_id: document._id}, document))
      })
      return Promise.all(promises)
    })
}

function updateForms (db) {
  const promises = []
  forEach(formsToUpdate, formData => {
    promises.push(updateFormAndDocuments(db, formData))
  })
  return Promise.all(promises)
    .then(() => db)
}

function applyRevision (db) {
  if (db.revision < REV_NUMBER) {
    console.log(`************* Apply revision ${REV_NUMBER} *****************`)
    return updateForms(db)
      .then(createRevision(REV_NUMBER, 'Correction des formulaires'))
      .then(function(db) {
        console.log(`------------ Revision ${REV_NUMBER} completed ---------------`) 
        return db
      })
  }
  return Promise.resolve(db)
}

module.exports = applyRevision