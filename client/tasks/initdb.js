const AppRoles = require('../modules/accounts/roles')
const {values} = require('lodash')
const {MongoClient} = require('mongodb')

const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')
const bluebird = require('bluebird')

const LIST_OPTIONS = [
 {_id: 101, value: '03', listId: 'Origine', name: '03 - Québec'},
 {_id: 102, value: '06', listId: 'Origine', name: '06 - Lévis'},

  {_id: 201, value: 'INTER', listId: 'OrganismRole', name: 'Intervenante'},
  {_id: 202, value: 'BENEV', listId: 'OrganismRole', name: 'Bénévole'},
  {_id: 203, value: 'ADJ.ADM', listId: 'OrganismRole', name: 'Adjointe administrative'},
  {_id: 204, value: 'DIREC', listId: 'OrganismRole', name: 'Directrice'},

  {_id: 301, value: AppRoles.canInteractWithClient, listId: 'AppRole', name: 'Créer et modifier un dossier de participant'},
  {_id: 302, value: AppRoles.formsManager, listId: 'AppRole', name: 'Gérer les formulaires'},
  {_id: 303, value: AppRoles.statsProducer, listId: 'AppRole', name: 'Consulter et produire les statistiques'},
  {_id: 304, value: AppRoles.usersManager, listId: 'AppRole', name: 'Administrer les comptes utilisateurs'}
]

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

    db.ensureIndex('EvolutionNote', 'clientId'),

    db.ensureIndex('UserAccount', 'username', {unique: true}),
    db.ensureIndex('UserAccount', 'fullName')
  ]

  return Promise.all(promises)
    .then(() => {
      console.log('createIndexes done')
      return db
    })
}

getDbConfig = function (argv) {
  const KNOWN_ENV = ['prod', 'dev']
  // the first 2 parameters are node and build.js, so skip them
  let env = 'dev'
  for (let i = 2; i < argv.length; i++) {
    const param = argv[i]
    if (KNOWN_ENV.indexOf(param) > -1) {
      env = param
    } else {
      const knownEnvs = KNOWN_ENV.join(', ')
      throw new Error(`unknown parameter "${param}". Known env are : [${knownEnvs}].`)
    }
  }

  const configPath = path.join('./config', `config.${env}.json`)
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  console.log('db config', config.db)
  return config.db
}

const dbConfig = getDbConfig(process.argv);

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
