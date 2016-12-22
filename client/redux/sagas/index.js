import { fork } from 'redux-saga/effects'
import clientFileSaga from './client-file-saga'

export default function * rootSaga () {
  yield [
    fork(clientFileSaga)
  ]
}
