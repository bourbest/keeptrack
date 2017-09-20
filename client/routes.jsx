import React from 'react'
import { Route } from 'react-router'

import Authorization from './containers/components/Authorization'
import LoginPage from './containers/LoginPage'
import ErrorPage from './containers/ErrorPage'

import ListClientsPage from './containers/clients/ListClientsPage'
import EditClientPage from './containers/clients/EditClientPage'

import ListAccountsPage from './containers/accounts/ListAccountsPage'
import EditAccountsPage from './containers/accounts/EditAccountPage'

import ListFormTemplatesPage from './containers/form-templates/ListFormTemplatesPage'

import Layout from './containers/Layout'

// checkRoles example
const SimpleUser = Authorization('USER')

export default (
  [
    <Route path='/login' component={LoginPage} />,
    <Route path='/error/:code' component={ErrorPage} />,
    <Route path='/' component={Layout}>
      <Route path='clients' component={SimpleUser(ListClientsPage)} />
      <Route path='clients/:id' component={SimpleUser(EditClientPage)} />
      <Route path='accounts' component={SimpleUser(ListAccountsPage)} />
      <Route path='accounts/:id' component={SimpleUser(EditAccountsPage)} />
      <Route path='form-templates' component={ListFormTemplatesPage} />
    </Route>,
    <Route path='/*' component={ErrorPage} code={'404'} />
  ]
)
