import { all } from 'redux-saga/effects'
import appSaga from './app/saga'
import clientSaga from './clients/saga'
import clientDocumentSaga from './client-documents/saga'
import accountSaga from './accounts/saga'
import myAccountSaga from './my-account/saga'
import authenticationSaga from './authentication/saga'
import formTemplateSaga from './form-templates/saga'
import evolutionNoteSaga from './evolution-notes/saga'
import subscriptionSaga from './client-feed-subscriptions/saga'
import notificationSaga from './notifications/saga'
import dashboardSaga from './dashboard/saga'
import reportSaga from './reports/saga'

export default function * rootSaga () {
  yield all([
    ...appSaga,
    ...clientSaga,
    evolutionNoteSaga,
    clientDocumentSaga,
    accountSaga,
    myAccountSaga,
    ...subscriptionSaga,
    ...formTemplateSaga,
    authenticationSaga,
    notificationSaga,
    dashboardSaga,
    reportSaga
  ])
}
