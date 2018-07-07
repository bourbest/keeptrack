import {MongoClient} from 'mongodb'
import bluebird from 'bluebird'

export const connectDatabase = (url, dbName) => {
  return MongoClient.connect(url, {promiseLibrary: bluebird})
    .then(mongoClient => {
      return mongoClient.db(dbName)
    })
}
