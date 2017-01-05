import { fork } from 'redux-saga/effects'
import clientFileSaga from './client-file-saga'
import authenticationSaga from './authentication-saga'

export default function * rootSaga () {
  yield [
    fork(authenticationSaga),
    fork(clientFileSaga)
  ]
}
