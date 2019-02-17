import React from 'react'
import { Route } from 'react-router'
import { canInteractWithClient, formsManager, usersManager, statsProducer } from './modules/accounts/roles'

import Authorization from './containers/components/Authorization'
import LoginPage from './containers/LoginPage'
import ErrorPage from './containers/ErrorPage'

import ListClientsPage from './containers/clients/ListClientsPage'
import EditClientPage from './containers/clients/EditClientPage'
import ViewClientPage from './containers/clients/ViewClientPage'

import ListAccountsPage from './containers/accounts/ListAccountsPage'
import EditAccountsPage from './containers/accounts/EditAccountPage'

import ListFormTemplatesPage from './containers/form-templates/ListFormTemplatesPage'
import EditFormTemplatePage from './containers/form-templates/EditFormTemplatePage'
import EditClientDocumentPage from './containers/clients/EditClientDocumentPage'
import FillFormDocumentPage from './containers/fill-form/FillFormPage'

import DashboardPage from './containers/dashboard/DashboardPage'

import ListFormShortcutPage from './containers/admin/ListFormShortcutPage'
import EditFormShortcutPage from './containers/admin/EditFormShortcutPage'
import DistributionListPage from './containers/reports/DistributionListPage'

import ChangePasswordPage from './containers/my-account/ChangePasswordPage'
import Layout from './containers/Layout'

// checkRoles example
const FormManager = Authorization(formsManager)
const AccountManager = Authorization(usersManager)
const InteractWithClient = Authorization(canInteractWithClient)
const ReportUser = Authorization(statsProducer)

export default (
  [
    <Route path='/login' component={LoginPage} />,
    <Route path='/error/:code' component={ErrorPage} />,
    <Route path='/' component={Layout}>
      <Route path='dashboard' component={InteractWithClient(DashboardPage)} />
      <Route path='clients' component={InteractWithClient(ListClientsPage)} />
      <Route path='clients/create' component={InteractWithClient(EditClientPage)} />
      <Route path='clients/:id' component={InteractWithClient(ViewClientPage)} />
      <Route path='clients/:id/edit' component={InteractWithClient(EditClientPage)} />
      <Route path='clients/:clientId/documents/create/:formId' component={InteractWithClient(EditClientDocumentPage)} />
      <Route path='clients/:clientId/documents/:documentId' component={InteractWithClient(EditClientDocumentPage)} />
      <Route path='accounts' component={AccountManager(ListAccountsPage)} />
      <Route path='accounts/:id' component={AccountManager(EditAccountsPage)} />
      <Route path='form-templates' component={FormManager(ListFormTemplatesPage)} />
      <Route path='form-templates/:id' component={FormManager(EditFormTemplatePage)} />
      <Route path='reports/distribution-list' component={ReportUser(DistributionListPage)} />
      <Route path='change-password' component={ChangePasswordPage} />
      <Route path='form-shortcuts' component={AccountManager(ListFormShortcutPage)} />
      <Route path='form-shortcuts/:id' component={AccountManager(EditFormShortcutPage)} />
      <Route path='fill-form/:formId' component={FillFormDocumentPage} />
    </Route>
  ]
)
