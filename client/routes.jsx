import React from 'react'
import { Route } from 'react-router'

import Authorization from './containers/components/Authorization'
import LoginPage from './containers/LoginPage'
import ErrorPage from './containers/ErrorPage'

import ListClientsPage from './containers/clients/ListClientsPage'
import EditClientPage from './containers/clients/EditClientPage'
import ViewClientPage from './containers/clients/ViewClientPage'

import ListAccountsPage from './containers/accounts/ListAccountsPage'
import EditAccountsPage from './containers/accounts/EditAccountPage'

import ListFormTemplatesPage from './containers/form-templates/ListFormTemplatesPage'
import EditFormTemplatePage from './containers/form-templates/EditFormTemplate'
import EditClientDocumentPage from './containers/clients/EditClientDocumentPage'
import Layout from './containers/Layout'

// checkRoles example
const SimpleUser = Authorization('USER')

export default (
  [
    <Route path='/login' component={LoginPage} />,
    <Route path='/error/:code' component={ErrorPage} />,
    <Route path='/' component={Layout}>
      <Route path='clients' component={SimpleUser(ListClientsPage)} />
      <Route path='clients/:id' component={SimpleUser(ViewClientPage)} />
      <Route path='clients/:id/edit' component={SimpleUser(EditClientPage)} />
      <Route path='clients/:clientId/documents/create/:formId' component={EditClientDocumentPage} />
      <Route path='clients/:clientId/documents/:documentId' component={EditClientDocumentPage} />
      <Route path='accounts' component={SimpleUser(ListAccountsPage)} />
      <Route path='accounts/:id' component={SimpleUser(EditAccountsPage)} />
      <Route path='form-templates' component={ListFormTemplatesPage} />
      <Route path='form-templates/:id' component={EditFormTemplatePage} />
    </Route>,
    <Route path='/*' component={ErrorPage} code={'404'} />
  ]
)
