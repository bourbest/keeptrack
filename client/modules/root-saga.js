import { fork } from 'redux-saga/effects'
import appSaga from './app/saga'
import clientSaga from './clients/saga'
import accountSaga from './accounts/saga'
import authenticationSaga from './authentication/saga'

export default function * rootSaga () {
  yield [
    fork(appSaga),
    fork(clientSaga),
    fork(accountSaga),
    fork(authenticationSaga)
  ]
}
