const {createRevision} = require('./common')
const {CLIENT_FORM_ID} = require('../../modules/const')
const {ObjectId} = require('mongodb')
const {find} = require('lodash')

function correctClientForm (db) {
  console.log('Adding missing properties to ClientForm')
  const formRepo = db.collection('FormTemplate')
  const _id = ObjectId(CLIENT_FORM_ID)
  return formRepo.findOne({_id})
    .then(function (clientForm) {
      
      clientForm.clientLink = 'NO_LINK'
      clientForm.documentDate = 'USE_CREATION_DATE'
      clientForm.documentDateLabels = {fr: 'Date de création', en: 'Creation date'}
      clientForm.documentStatus = 'NO_DRAFT'

      const addressField = find(clientForm.fields, {id: 'address'})
      if (addressField) {
        console.log('field found, updating')
        addressField.labels = {
          fr: 'adresse',
          en: 'address'
        }
      }
      return formRepo.replaceOne({_id}, clientForm)
    })
    .then(function() {
      return db
    })
}

function applyRevision (db) {
  if (db.revision < 2) {
    console.log('************* Apply revision 1 *****************')
    return correctClientForm(db)
      .then(createRevision(2, 'Ajout des propriétés manquantes au formulaire Participant'))
      .then(function(db) {
        console.log('------------ Revision 1 completed ---------------') 
        return db
      })
  }
  return Promise.resolve(db)
}

module.exports = applyRevision