import React from 'react'
import { Route } from 'react-router'
import { canInteractWithClient, formsManager, usersManager, statsProducer, canCreateClientFiles } from './modules/accounts/roles'

import Authorization from './containers/components/Authorization'
import LoginPage from './containers/LoginPage'
import ErrorPage from './containers/ErrorPage'

import ListClientsPage from './containers/clients/ListClientsPage'
import EditClientPage from './containers/clients/EditClientPage'
import ViewClientPage from './containers/clients/ViewClientPage'
import EditFileInfoPage from './containers/clients/EditFileInfoPage'
import ManageClientLinksPage from './containers/clients/ManageClientLinksPage'

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
import GenerateReportPage from './containers/reports/GenerateReportPage'

import ChangePasswordPage from './containers/my-account/ChangePasswordPage'
import Layout from './containers/Layout'

// checkRoles example
const FormManager = Authorization(formsManager)
const AccountManager = Authorization(usersManager)
const InteractWithClient = Authorization(canInteractWithClient)
const ReportUser = Authorization(statsProducer)
const CreateClientFiles = Authorization(canCreateClientFiles)

export default (
  [
    <Route path='/login' component={LoginPage} />,
    <Route path='/error/:code' component={ErrorPage} />,
    <Route path='/' component={Layout}>
      <Route path='dashboard' component={DashboardPage} />
      <Route path='clients' component={CreateClientFiles(ListClientsPage)} />
      <Route path='clients/create' component={CreateClientFiles(EditClientPage)} />
      <Route path='clients/:id' component={CreateClientFiles(ViewClientPage)} />
      <Route path='clients/:id/edit' component={CreateClientFiles(EditClientPage)} />
      <Route path='clients/:clientId/documents/create/:formId' component={CreateClientFiles(EditClientDocumentPage)} />
      <Route path='clients/:clientId/manage-client-links' component={CreateClientFiles(ManageClientLinksPage)} />
      <Route path='client-documents/:documentId' component={EditClientDocumentPage} />
      <Route path='uploaded-files/review' component={InteractWithClient(EditFileInfoPage)} />
      <Route path='accounts' component={AccountManager(ListAccountsPage)} />
      <Route path='accounts/:id' component={AccountManager(EditAccountsPage)} />
      <Route path='form-templates' component={FormManager(ListFormTemplatesPage)} />
      <Route path='form-templates/:id' component={FormManager(EditFormTemplatePage)} />
      <Route path='reports/distribution-list' component={ReportUser(DistributionListPage)} />
      <Route path='reports/generate' component={ReportUser(GenerateReportPage)} />
      <Route path='change-password' component={ChangePasswordPage} />
      <Route path='form-shortcuts' component={AccountManager(ListFormShortcutPage)} />
      <Route path='form-shortcuts/:id' component={AccountManager(EditFormShortcutPage)} />
      <Route path='fill-form/:formId' component={FillFormDocumentPage} />
    </Route>
  ]
)
