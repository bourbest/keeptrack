import React from 'react'
import PropTypes from 'prop-types'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// module
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as ClientLinkActions } from '../../modules/client-links/actions'
import { ActionCreators as ClientActions } from '../../modules/clients/actions'
import ClientLinkSelectors from '../../modules/client-links/selectors'
import ClientSelectors from '../../modules/clients/selectors'
import { getLocale } from '../../modules/app/selectors'

// components
import {createTranslate} from '../../locales/translate'
import { FormError } from '../components/forms/FormError'
import ClientLinkForm from './components/ClientLinkForm'
import {SmartTable, Column} from '../components/SmartTable'
import AddressTile from '../components/AddressTile'
import Toolbar from '../components/Toolbar/Toolbar'
import ConfirmButton from '../components/controls/ConfirmButton'

const labelNamespace = 'client-links'

const mapDispatchToProps = (dispatch) => {
  return {
    linkActions: bindActionCreators(ClientLinkActions, dispatch),
    clientActions: bindActionCreators(ClientActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class ManageClientLinksPage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate(labelNamespace, this)
    this.handleClientSelected = this.handleClientSelected.bind(this)
    this.handleCreateLink = this.handleCreateLink.bind(this)
    this.handleDeleteConfirmed = this.handleDeleteConfirmed.bind(this)
  }

  componentWillMount () {
    const clientId = this.props.params.clientId
    this.props.linkActions.loadLinksForClient(clientId)
    this.props.clientActions.fetchClientForm()
    this.props.clientActions.fetchEditedEntity(clientId)
  }

  handleClientSelected (client) {
    this.props.linkActions.setSelectedClient(client)
  }

  handleCreateLink () {
    const {appActions, linkActions, selectedClient} = this.props
    const clientId = this.props.params.clientId
    const newLink = {
      clientId1: clientId,
      clientId2: selectedClient.id
    }

    linkActions.create(clientId, selectedClient, newLink, createdLink => {
      appActions.notify('common.save', 'common.saved')
      linkActions.setSelectedClient(null)
    })
  }

  handleDeleteConfirmed () {
    const {appActions, linkActions, selectedItemIds} = this.props
    const clientId = this.props.params.clientId
    linkActions.delete(clientId, selectedItemIds, count => {
      appActions.notify('common.delete', 'common.deleted')
      linkActions.clearSelectedItems()
    })
  }

  renderAddress (entity, columnName, column, globals) {
    if (entity.client.address) {
      return <AddressTile address={entity.client.address} />
    }
    return null
  }

  render () {
    const {formError, locale, client} = this.props

    if (!client) return null

    const title = `${client.firstName} ${client.lastName} - ${this.message('titleSuffix')}`

    return (
      <div>
        <Toolbar title={title} backTo={`/clients/${client.id}`}>
          <ConfirmButton locale={locale} onClick={this.handleDeleteConfirmed} disabled={this.props.selectedItemIds.length === 0}>
            {this.message('delete', 'common')}
          </ConfirmButton>
        </Toolbar>
        <FormError error={formError} locale={locale} />
        <div style={{height: '500px'}}>
          <SmartTable
            selectable
            rows={this.props.links}
            messageWhenEmpty={this.message('noLinks')}
            clientTypesById={this.props.clientTypesById}
            locale={locale}
            selectedItemIds={this.props.selectedItemIds}
            onRowSelected={this.props.linkActions.toggleSelectedItem}
          >
            <Column label={this.message('firstName')} name="client.firstName" />
            <Column label={this.message('lastName')} name="client.lastName" />
            <Column label={this.message('clientType')} name="client.clientType" />
            <Column label={this.message('address')} renderer={this.renderAddress} />
          </SmartTable>
          <h2>{this.message('newLinkTitle')}</h2>
          <ClientLinkForm
            locale={locale}
            selectedClient={this.props.selectedClient}
            canCreateLink={this.props.canCreateLink}
            onClientSelected={this.handleClientSelected}
            onCreateLink={this.handleCreateLink}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    links: ClientLinkSelectors.getLinks(state),
    selectedClient: ClientLinkSelectors.getSelectedClient(state),
    canCreateLink: ClientLinkSelectors.canCreateLink(state, props),
    selectedItemIds: ClientLinkSelectors.getSelectedItemIds(state),
    client: ClientSelectors.getEditedEntity(state),
    locale: getLocale(state)
  }
}

ManageClientLinksPage.propTypes = {
  links: PropTypes.array.isRequired,
  selectedClient: PropTypes.object,
  canCreateLink: PropTypes.bool.isRequired,
  selectedItemIds: PropTypes.array.isRequired,
  client: PropTypes.object.isRequired,

  locale: PropTypes.string.isRequired,
  formError: PropTypes.any,

  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

const ConnectedManageClientLinksPage = connect(mapStateToProps, mapDispatchToProps)(ManageClientLinksPage)

export default ConnectedManageClientLinksPage
