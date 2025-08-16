const {createRevision} = require('./common')

const REV_NUMBER = 9

function createBlockedFileTable (db) {
  console.log('création des index pour BlockedFile')
  const promises = [
    db.ensureIndex('BlockedFile', 'userId')
  ]

  return Promise.all(promises)
    .then(() => {
      console.log('index créés')
      return db
    })
}

function applyRevision (db) {
  if (db.revision < REV_NUMBER) {
    console.log(`************* Apply revision ${REV_NUMBER} *****************`)
    return createBlockedFileTable(db)
      .then(createRevision(REV_NUMBER, 'Ajout de la table pour bloquer dossier client'))
      .then(function (db) {
        console.log(`------------ Revision ${REV_NUMBER} completed ---------------`)
        return db
      })
  }
  return Promise.resolve(db)
}

module.exports = applyRevision
