const {createRevision} = require('./common')

const REV_NUMBER = 8

const LIST_OPTIONS = [
  {_id: 205, value: 'STAG', listId: 'OrganismRole', name: 'Stagiaire'},
  {_id: 206, value: 'NUTRI', listId: 'OrganismRole', name: 'Nutritionniste'},
  {_id: 207, value: 'EEC', listId: 'OrganismRole', name: 'EEC'}
]


function addNewRoles (db) {
  console.log('adding new roles')
  const optionRepo = db.collection('ListOption')
  const promises = []
  const options = {upsert: true}
  for (let i = 0; i < LIST_OPTIONS.length; i++) {
    const filters = {_id: LIST_OPTIONS[i]._id}
    promises.push(optionRepo.replaceOne(filters, LIST_OPTIONS[i], options))
  }
  return Promise.all(promises)
    .then(() => {
      console.log('new roles added')
      return db
    })
}


function applyRevision (db) {
  if (db.revision < REV_NUMBER) {
    console.log(`************* Apply revision ${REV_NUMBER} *****************`)
    return addNewRoles(db)
      .then(createRevision(REV_NUMBER, 'Ajout de nouveaux rôles'))
      .then(function(db) {
        console.log(`------------ Revision ${REV_NUMBER} completed ---------------`) 
        return db
      })
  }
  return Promise.resolve(db)
}

module.exports = applyRevision