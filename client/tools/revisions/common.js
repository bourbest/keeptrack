function createRevision (_id, description) {
  const today = new Date()
  const revision = {_id, appliedOn: today.toISOString(), description}
  return function (db) {
    const revRepo = db.collection('DbRevision')
  
    return revRepo.insertOne(revision)
      .then(function () {return db})
  }
}

module.exports = {
  createRevision: createRevision
}
