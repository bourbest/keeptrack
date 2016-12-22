import React from 'react'
import store from '../redux/store'
import { Provider } from 'react-redux'
import ManageClientFiles from './client-file/ManageClientFiles'
import EditClientFile from './client-file/EditClientFile'
import ErrorPage from './ErrorPage'
import Layout from './Layout'

import { Router, Route, IndexRoute, browserHistory } from 'react-router'

const App = React.createClass({
  render () {
    return (
      <Provider store={store} >
        <Router history={browserHistory}>
          <Route path='/' component={Layout}>
            <IndexRoute component={ManageClientFiles} />
            <Route path='/client/:id' component={EditClientFile} />
            <Route path="*" component={ErrorPage} code={"404"} />
          </Route>
        </Router>
      </Provider>
    )
  }
})

module.exports = App
