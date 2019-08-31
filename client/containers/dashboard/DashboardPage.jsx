import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// module
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as DashboardActions } from '../../modules/dashboard/actions'
import { ActionCreators as FormTemplateActions } from '../../modules/form-templates/actions'

import DashboardSelectors from '../../modules/dashboard/selectors'
import FormTemplateSelectors from '../../modules/form-templates/selectors'
import { getLocale } from '../../modules/app/selectors'
import {canSeeClientFileContent} from '../../modules/authentication/selectors'

// components
import {createTranslate} from '../../locales/translate'
import {SmartTable, Column} from '../components/SmartTable'
import Toolbar from '../components/Toolbar/Toolbar'
import {buildUrl} from '../../services/url-utils'
import {renderFormNameColumn, renderDateColumn, renderClientNameColumn} from '../clients/components/DocumentList'

const labelNamespace = 'dashboard'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(DashboardActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch),
    formTemplateActions: bindActionCreators(FormTemplateActions, dispatch)
  }
}

class DashboardPage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate(labelNamespace, this)
    this.renderNotifications = this.renderNotifications.bind(this)
  }

  componentWillMount () {
    this.props.actions.fetchMyClients()
    this.props.actions.fetchMyIncompleteDocuments()
    this.props.formTemplateActions.fetchList()
  }

  renderNotifications (entity, columnName, column, globals) {
    const {notificationsByClientId} = this.props
    const clientId = entity.id
    const notifications = notificationsByClientId[clientId]

    let newNotes = null
    let updatedNotes = null
    let newDocs = null
    let updatedDocs = null
    let newLinks = null

    if (notifications) {
      if (notifications.newNotes) {
        newNotes = <span>{this.message('newNotes', {count: notifications.newNotes})}<br /></span>
      }
      if (notifications.updatedNotes) {
        updatedNotes = <span>{this.message('updatedNotes', {count: notifications.updatedNotes})}<br /></span>
      }
      if (notifications.newDocuments) {
        newDocs = <span>{this.message('newDocuments', {count: notifications.newDocuments})}<br /></span>
      }
      if (notifications.updatedDocuments) {
        updatedDocs = <span>{this.message('updatedDocuments', {count: notifications.updatedDocuments})}<br /></span>
      }
      if (notifications.newLinks) {
        newLinks = <span>{this.message('newLinks', {count: notifications.newLinks})}<br /></span>
      }
    }

    return (
      <div>
        {newNotes}
        {updatedNotes}
        {newDocs}
        {updatedDocs}
        {newLinks}
      </div>
    )
  }

  renderLinkToClient (entity, columnName, column, globals) {
    const location = globals.location
    const backTo = encodeURIComponent(buildUrl(location.pathname, location.query))
    const to = `/clients/${entity.id}?backTo=${backTo}`
    return <Link to={to}>{entity[columnName]}</Link>
  }

  render () {
    return (
      <div>
        {this.props.canFollowClients &&
          <div>
            <Toolbar title={this.message('my-clients')} />
            <SmartTable
              rows={this.props.clients}
              location={this.props.location}
              messageWhenEmpty={this.message('notFollowingAnyClient')}
            >
              <Column name="lastName" label={this.message('lastName')} renderer={this.renderLinkToClient} />
              <Column name="firstName" label={this.message('firstName')} renderer={this.renderLinkToClient} />
              <Column name="clientType" label={this.message('clientType')} />
              <Column name="notifications" label={this.message('notifications')} renderer={this.renderNotifications} />
            </SmartTable>
          </div>
        }

        <h4>{this.message('incompleteDocuments')}</h4>
        <SmartTable
          rows={this.props.incompleteDocuments}
          location={this.props.location}
          formsById={this.props.formsById}
          messageWhenEmpty={this.message('noDocumentToComplete')}
        >
          <Column name="formName" label={this.message('formName')} renderer={renderFormNameColumn} />
          <Column name="client" label={this.message('clientName')} renderer={renderClientNameColumn} />
          <Column name="createdOn" label={this.message('createdOn')} renderer={renderDateColumn} />
          <Column name="documentDate" label={this.message('documentDate')} renderer={renderDateColumn} />
        </SmartTable>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    clients: DashboardSelectors.getOrderedClients(state),
    canFollowClients: canSeeClientFileContent(state),
    notificationsByClientId: DashboardSelectors.getClientsNotifications(state),
    incompleteDocuments: DashboardSelectors.getSortedIncompleteDocuments(state),
    formsById: FormTemplateSelectors.getEntities(state),
    locale: getLocale(state)
  }
}

DashboardPage.propTypes = {
  clients: PropTypes.array.isRequired,
  notificationsByClientId: PropTypes.object.isRequired,
  incompleteDocuments: PropTypes.array.isRequired,
  formsById: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
}

const ConnectedDashboardPage = connect(mapStateToProps, mapDispatchToProps)(DashboardPage)

export default ConnectedDashboardPage
