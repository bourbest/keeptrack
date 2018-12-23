import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// module
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as DashboardActions } from '../../modules/dashboard/actions'
import DashboardSelectors from '../../modules/dashboard/selectors'
import { getLocale } from '../../modules/app/selectors'

// components
import {createTranslate} from '../../locales/translate'
import {SmartTable, Column} from '../components/SmartTable'
import Toolbar from '../components/Toolbar/Toolbar'
import {buildUrl} from '../../services/url-utils'

const labelNamespace = 'dashboard'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(DashboardActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

const renderLinkToClient = (entity, columnName, column, globals) => {
  const location = globals.location
  const backTo = encodeURIComponent(buildUrl(location.pathname, location.query))
  const to = `/clients/${entity.id}?backTo=${backTo}`
  return <Link to={to}>{entity[columnName]}</Link>
}

class DashboardPage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate(labelNamespace, this)
  }

  componentWillMount () {
    this.props.actions.fetchMyClients()
  }

  render () {
    return (
      <div>
        <Toolbar title={this.message('my-clients')} />
        <SmartTable
          rows={this.props.clients}
          location={this.props.location}
        >
          <Column name="lastName" label={this.message('lastName')} renderer={renderLinkToClient} />
          <Column name="firstName" label={this.message('firstName')} renderer={renderLinkToClient} />
        </SmartTable>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    clients: DashboardSelectors.getOrderedClients(state),
    locale: getLocale(state)
  }
}

DashboardPage.propTypes = {
  clients: PropTypes.array.isRequired,
  locale: PropTypes.string.isRequired
}

const ConnectedDashboardPage = connect(mapStateToProps, mapDispatchToProps)(DashboardPage)

export default ConnectedDashboardPage
