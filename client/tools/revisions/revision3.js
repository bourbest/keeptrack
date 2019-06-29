const {createRevision} = require('./common')

function createNewIndexes (db) {
  console.log('creating uploadFile index')
  const promises = [
    db.ensureIndex('UploadedFile', {clientId: 1})
  ]

  return Promise.all(promises)
    .then(() => {
      return db
    })
}

function applyRevision (db) {
  if (db.revision < 3) {
    console.log('************* Apply revision 3 *****************')
    return createNewIndexes(db)
      .then(createRevision(3, 'Ajout des index pour upload de fichiers'))
      .then(function(db) {
        console.log('------------ Revision 3 completed ---------------') 
        return db
      })
  }
  return Promise.resolve(db)
}

module.exports = applyRevision