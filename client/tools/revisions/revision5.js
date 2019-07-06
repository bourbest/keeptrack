const {createRevision} = require('./common')
const {canInteractWithClient, canCreateClientFiles} = require('../../modules/accounts/roles')
const {forEach} = require('lodash')

const REV_NUMBER = 5

function updateExistingUsersToAddCreateClientFileWhenApplicable (db) {
  console.log('MAJ des utilisateurs qui avaient accès aux dossiers clients pour leur ajouter la permission canCreateClientFiles')
  const accountRepo = db.collection('UserAccount')
  return accountRepo.find({}).toArray()
    .then((accounts) => {
      const updatePromises = []
      forEach(accounts, account => {
        if (account.roles.indexOf(canInteractWithClient) >= 0 && account.roles.indexOf(canCreateClientFiles) === -1) {
          account.roles.push(canCreateClientFiles)
          updatePromises.push(accountRepo.update({_id: account._id}, account))
        }
      })
      return Promise.all(updatePromises)
    })
    .then(() => db)
}

function addPermission (db) {
  console.log('ajout de la permission dans la liste')
  const optionRepo = db.collection('ListOption')
  return optionRepo.insert({
    _id: 305,
    value: canCreateClientFiles,
    listId: 'AppRole',
    name: 'Créer des dossiers clients'
  })
  .then(() => db)
}

function adjustLabelOfCanInteractWithClient (db) {
  console.log('correction du libellé pour la modification de dossiers clients')
  const optionRepo = db.collection('ListOption')
  return optionRepo.update({_id: 301}, {
    value: canInteractWithClient,
    listId: 'AppRole',
    name: 'Consulter les notes et documents dans les dossiers clients'
  })
    .then(() => db)
}


function applyRevision (db) {
  if (db.revision < REV_NUMBER) {
    console.log(`************* Apply revision ${REV_NUMBER} *****************`)
    return adjustLabelOfCanInteractWithClient(db)
      .then(updateExistingUsersToAddCreateClientFileWhenApplicable)
      .then(addPermission)
      .then(createRevision(REV_NUMBER, 'Permission - permettre de créer des dossiers sans en voir les détails'))
      .then(function(db) {
        console.log(`------------ Revision ${REV_NUMBER} completed ---------------`) 
        return db
      })
  }
  return Promise.resolve(db)
}

module.exports = applyRevision