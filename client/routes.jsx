import React from 'react'
import { Route } from 'react-router'
import { FORM_MANAGER, ACCOUNT_MANAGER, INTERACT_WITH_CLIENT } from './modules/app/roles'

import Authorization from './containers/components/Authorization'
import LoginPage from './containers/LoginPage'
import ErrorPage from './containers/ErrorPage'

import ListClientsPage from './containers/clients/ListClientsPage'
import EditClientPage from './containers/clients/EditClientPage'
import ViewClientPage from './containers/clients/ViewClientPage'

import CreateNotePage from './containers/evolution-note/CreateEvolutionNotePage'

import ListAccountsPage from './containers/accounts/ListAccountsPage'
import EditAccountsPage from './containers/accounts/EditAccountPage'

import ListFormTemplatesPage from './containers/form-templates/ListFormTemplatesPage'
import EditFormTemplatePage from './containers/form-templates/EditFormTemplate'
import EditClientDocumentPage from './containers/clients/EditClientDocumentPage'
import Layout from './containers/Layout'

// checkRoles example
const FormManager = Authorization(FORM_MANAGER)
const AccountManager = Authorization(ACCOUNT_MANAGER)
const InteractWithClient = Authorization(INTERACT_WITH_CLIENT)

export default (
  [
    <Route path='/login' component={LoginPage} />,
    <Route path='/error/:code' component={ErrorPage} />,
    <Route path='/' component={Layout}>
      <Route path='clients' component={InteractWithClient(ListClientsPage)} />
      <Route path='clients/create' component={InteractWithClient(EditClientPage)} />
      <Route path='clients/:id' component={InteractWithClient(ViewClientPage)} />
      <Route path='clients/:id/edit' component={InteractWithClient(EditClientPage)} />
      <Route path='clients/:clientId/documents/create/:formId' component={InteractWithClient(EditClientDocumentPage)} />
      <Route path='clients/:clientId/documents/:documentId' component={InteractWithClient(EditClientDocumentPage)} />
      <Route path='new-evolution-note' component={CreateNotePage} />
      <Route path='accounts' component={AccountManager(ListAccountsPage)} />
      <Route path='accounts/:id' component={AccountManager(EditAccountsPage)} />
      <Route path='form-templates' component={FormManager(ListFormTemplatesPage)} />
      <Route path='form-templates/:id' component={FormManager(EditFormTemplatePage)} />
    </Route>,
    <Route path='/*' component={ErrorPage} code={'404'} />
  ]
)
