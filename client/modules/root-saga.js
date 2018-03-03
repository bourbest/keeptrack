import { all } from 'redux-saga/effects'
import appSaga from './app/saga'
import clientSaga from './clients/saga'
import accountSaga from './accounts/saga'
import authenticationSaga from './authentication/saga'
import formTemplateSaga from './form-templates/saga'

export default function * rootSaga () {
  yield all([
    appSaga,
    clientSaga,
    accountSaga,
    ...formTemplateSaga,
    authenticationSaga
  ])
}
