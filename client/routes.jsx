import React from 'react'
import { Route, IndexRoute } from 'react-router'

import ManageClientFiles from './containers/client-file/ManageClientFiles'
import LoginPage from './containers/LoginPage'
import EditClientFile from './containers/client-file/EditClientFile'
import ErrorPage from './containers/ErrorPage'
import Layout from './containers/Layout'

export default (
  <Route path='/' component={Layout}>
    <IndexRoute component={ManageClientFiles} />
    <Route path='client' component={ManageClientFiles} />
    <Route path='client/:id' component={EditClientFile} />
    <Route path='login' component={LoginPage} />
    <Route path="*" component={ErrorPage} code={"404"} />
  </Route>
)
