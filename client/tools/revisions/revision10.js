const {createRevision} = require('./common')
const {CLIENT_FORM_ID} = require('../../modules/const')
const {ObjectId} = require('mongodb')
const {find} = require('lodash')

const REV_NUMBER = 10

const clientPronounField = {
  labels: {
    fr: 'Pronom',
    en: 'Pronoun'
  },
  required: true,
  choices: [
    {
      labels: {
        fr: 'Il',
        en: 'He'
      },
      id: '1'
    },
    {
      labels: {
        fr: 'Elle',
        en: 'She'
      },
      id: '2'
    },
    {
      labels: {
        fr: 'Iel',
        en: 'They'
      },
      id: '3'
    }
  ],
  id: 'pronoun',
  controlType: 'radio-list',
  order: 2.5,
  isSystem: true,
  parentId: 'c1'
}

function addPronounFieldToClientForm (db) {
  console.log('Adding pronoun field to client form')
  const formRepo = db.collection('FormTemplate')
  const _id = ObjectId(CLIENT_FORM_ID)
  return formRepo.findOne({_id})
    .then(function (clientForm) {
      
      const typeField = find(clientForm.fields, {id: clientPronounField.id})
      if (!typeField) {
        clientForm.fields.push(clientPronounField)
      }

      return formRepo.replaceOne({_id}, clientForm)
    })
    .then(function() {
      return db
    })
}

function applyRevision (db) {
  if (db.revision < REV_NUMBER) {
    console.log(`************* Apply revision ${REV_NUMBER} *****************`)
    return addPronounFieldToClientForm(db)
      .then(createRevision(REV_NUMBER, 'Ajout de la table pour bloquer dossier client'))
      .then(function (db) {
        console.log(`------------ Revision ${REV_NUMBER} completed ---------------`)
        return db
      })
  }
  return Promise.resolve(db)
}

module.exports = applyRevision
