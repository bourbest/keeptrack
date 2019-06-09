const AppRoles = require('../modules/accounts/roles')
const {values} = require('lodash')
const {MongoClient, ObjectId} = require('mongodb')

const bcrypt = require('bcryptjs')
const fs = require('fs')
const bluebird = require('bluebird')

const LIST_OPTIONS = [
  {_id: 201, value: 'INTER', listId: 'OrganismRole', name: 'Intervenante'},
  {_id: 202, value: 'BENEV', listId: 'OrganismRole', name: 'Bénévole'},
  {_id: 203, value: 'ADJ.ADM', listId: 'OrganismRole', name: 'Adjointe administrative'},
  {_id: 204, value: 'DIREC', listId: 'OrganismRole', name: 'Directrice'},

  {_id: 301, value: AppRoles.canInteractWithClient, listId: 'AppRole', name: 'Créer et modifier un dossier de participant'},
  {_id: 302, value: AppRoles.formsManager, listId: 'AppRole', name: 'Gérer les formulaires'},
  {_id: 303, value: AppRoles.statsProducer, listId: 'AppRole', name: 'Consulter les rapports'},
  {_id: 304, value: AppRoles.usersManager, listId: 'AppRole', name: 'Administrer les comptes utilisateurs'}
]

const clientFormData = require('./client-form-data')
const evolutiveNoteFormData = require('./evolutive-note-data')
const {CLIENT_FORM_ID, EVOLUTIVE_NOTE_FORM_ID} = require('../modules/const')

const initializeListOptions = (db) => {
  console.log('init option list')
  const optionRepo = db.collection('ListOption')
  const promises = []
  const options = {upsert: true}
  for (let i = 0; i < LIST_OPTIONS.length; i++) {
    const filters = {_id: LIST_OPTIONS[i]._id}
    promises.push(optionRepo.replaceOne(filters, LIST_OPTIONS[i], options))
  }
  return Promise.all(promises)
    .then(() => {
      console.log('init option list done')
      return db
    })
}

const createAdminUser = () => {
  return bcrypt.hash('admin', 8)
    .then(passwordHash => {
      return {
        username: 'admin',
        email: '',
        passwordHash,
        fullName: 'Administrateur',
        firstName: 'Administrateur',
        lastName: 'admin',
        isArchived: false,
        roles: values(AppRoles),
        organismRole: null,
        createdOn: new Date(),
        modifiedOn: new Date()
      }
  })
}

const initializeAdminUser = (db) => {
  console.log('initializing admin')
  const users = db.collection('UserAccount')
  const filters = {username: 'admin'}
  return users.findOne(filters).then(user => {
      if (!user) {
        console.log('creating user')
        return createAdminUser()
          .then(user => users.insertOne(user))
      } else {
        console.log('user already exists')
      }
    })
    .then(() => {
      console.log('initializeAdminUser done')
      return db
    })
}

const createIndexes = (db) => {
  console.log('creating index')
  const promises = [
    db.ensureIndex('ClientFile', {fullName: 1}, {collation: {locale: 'fr', strength: 2}}),

    db.ensureIndex('ClientDocument', 'clientId'),
    db.ensureIndex('ClientDocument', 'intervenantId'),

    db.ensureIndex('UserAccount', 'username', {unique: true}),
    db.ensureIndex('UserAccount', 'fullName'),

    db.ensureIndex('ClientFeedSubscription', {userId: 1, clientId: 1}, {unique: true}),

    db.ensureIndex('Notification', {userId: 1, createdOn: -1, type: 1}),

    db.ensureIndex('UploadedFile', {clientId: 1})
  ]

  return Promise.all(promises)
    .then(() => {
      console.log('createIndexes done')
      return db
    })
}

getDbConfig = function () {
  const configPath = './config.json'
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  console.log('db config', config.db)
  return config.db
}

const createSystemForms = (db) => {
  console.log('create system forms')
  const formRepo = db.collection('FormTemplate')
  const promises = []
  const options = {upsert: true}

  const clientForm = {...clientFormData, _id: new ObjectId(CLIENT_FORM_ID)}
  promises.push(formRepo.replaceOne({_id: clientForm._id}, clientForm, options))

  const evolutiveNoteForm = {...evolutiveNoteFormData, _id: new ObjectId(EVOLUTIVE_NOTE_FORM_ID)}
  promises.push(formRepo.replaceOne({_id: evolutiveNoteForm._id}, evolutiveNoteForm, options))

  return Promise.all(promises)
    .then(() => {
      console.log('forms inserted')
      return db
    })
}

const dbConfig = getDbConfig();

(async () => {
  let client
  await MongoClient.connect(dbConfig.server, {promiseLibrary: bluebird})
    .then(mongoClient => {
      client = mongoClient
      return mongoClient.db(dbConfig.dbName)
    })
    .then(createIndexes)
    .then(initializeListOptions)
    .then(initializeAdminUser)
    .then(createSystemForms)
    .then(() => {
      console.log('initdb complete')
    })
    .catch(error => {
      console.log('error encountered', error)
    })
    .finally(() => {
      client.close()
  })
})();
