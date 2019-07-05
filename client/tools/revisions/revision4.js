const {createRevision} = require('./common')
const {CLIENT_FORM_ID} = require('../../modules/const')
const {ObjectId} = require('mongodb')
const {find} = require('lodash')

const clientTypeField = {
  labels: {
    fr: 'Type de client',
    en: 'Client type'
  },
  required: true,
  choices: [
    {
      labels: {
        fr: 'Participant',
        en: 'Participant'
      },
      id: '1'
    },
    {
      labels: {
        fr: 'Proche',
        en: 'Family'
      },
      id: '2'
    },
    {
      labels: {
        fr: 'Intervenant',
        en: 'Intervenant'
      },
      id: '3'
    }
  ],
  id: 'clientTypeId',
  controlType: 'combobox',
  order: 2.5,
  isSystem: true,
  parentId: 'c1'
}

function adjustClientForm (db) {
  const formRepo = db.collection('FormTemplate')
  const _id = ObjectId(CLIENT_FORM_ID)
  return formRepo.findOne({_id})
    .then(function (clientForm) {

      console.log('Change the Note field type to Rich Text')
      const noteField = find(clientForm.fields, {id: 'notes'})
      if (noteField) {
        console.log('field found, updating')
        noteField.controlType = 'rich-text'
      }

      console.log('Add client type to form')
      const typeField = find(clientForm.fields, {id: clientTypeField.id})
      if (!typeField) {
        clientForm.fields.push(clientTypeField)
      }

      return formRepo.replaceOne({_id}, clientForm)
    })
    .then(function() {
      return db
    })
}

function createClientLinkTable (db) {
  console.log('création des index pour ClientFileLink')
  const promises = [
    db.ensureIndex('ClientFileLink', 'clientId1'),
    db.ensureIndex('ClientFileLink', 'clientId2')
  ]

  return Promise.all(promises)
    .then(() => {
      console.log('index créés')
      return db
    })
}

function updateExistingClientFilesToSetDefaultType (db) {
  console.log('MAJ des dossiers clients existant pour mettre le type Participant par défaut')
  const clientRepo = db.collection('ClientFile')
  return clientRepo.update({}, {$set : {clientTypeId: '1'}}, {upsert: false, multi:true})
    .then(() => db)
}

function applyRevision (db) {
  if (db.revision < 4) {
    console.log('************* Apply revision 4 *****************')
    return adjustClientForm(db)
      .then(createClientLinkTable)
      .then(updateExistingClientFilesToSetDefaultType)
      .then(createRevision(4, 'ClientForm - modifier Note pour rich text et ajouter type de client et liens entre dossiers clients'))
      .then(function(db) {
        console.log('------------ Revision 4 completed ---------------') 
        return db
      })
  }
  return Promise.resolve(db)
}

module.exports = applyRevision