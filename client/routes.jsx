import React from 'react'
import { Route } from 'react-router'

import Authorization from './containers/components/Authorization'
import LoginPage from './containers/LoginPage'
import ErrorPage from './containers/ErrorPage'

import ListClientsPage from './containers/clients/ListClientsPage'
import EditClientPage from './containers/clients/EditClientPage'

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
    </Route>,
    <Route path='/*' component={ErrorPage} code={'404'} />
  ]
)
