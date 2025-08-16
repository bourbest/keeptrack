import React from 'react'
import PropTypes from 'prop-types'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// module
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as BlockedFilesActions } from '../../modules/blocked-files/actions'
import { ActionCreators as ClientActions } from '../../modules/clients/actions'
import { ActionCreators as AccountActions } from '../../modules/accounts/actions'
import BlockedFileSelectors from '../../modules/blocked-files/selectors'
import AccountSelectors from '../../modules/accounts/selectors'
import { getLocale } from '../../modules/app/selectors'

// components
import {createTranslate} from '../../locales/translate'
import { FormError } from '../components/forms/FormError'
import ClientLinkForm from '../clients/components/ClientLinkForm'
import {SmartTable, Column} from '../components/SmartTable'
import AddressTile from '../components/AddressTile'
import Toolbar from '../components/Toolbar/Toolbar'
import ConfirmButton from '../components/controls/ConfirmButton'

const labelNamespace = 'blocked-files'

const mapDispatchToProps = (dispatch) => {
  return {
    blockedFilesActions: bindActionCreators(BlockedFilesActions, dispatch),
    clientActions: bindActionCreators(ClientActions, dispatch),
    accountActions: bindActionCreators(AccountActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class ManageBlockedFilesPage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate(labelNamespace, this)
    this.handleClientSelected = this.handleClientSelected.bind(this)
    this.handleCreateBlockedFile = this.handleCreateBlockedFile.bind(this)
    this.handleDeleteConfirmed = this.handleDeleteConfirmed.bind(this)
  }

  componentWillMount () {
    const userId = this.props.params.userId
    this.props.blockedFilesActions.loadBlockedFilesForUser(userId)
    this.props.clientActions.fetchClientForm()
    this.props.accountActions.fetchEntity(userId)
  }

  handleClientSelected (client) {
    this.props.blockedFilesActions.setSelectedClient(client)
  }

  handleCreateBlockedFile () {
    const {appActions, blockedFilesActions, selectedClient} = this.props
    const userId = this.props.params.userId
    const newLink = {
      userId,
      clientId: selectedClient.id
    }

    blockedFilesActions.create(userId, selectedClient, newLink, createdLink => {
      appActions.notify('common.save', 'common.saved')
      blockedFilesActions.setSelectedClient(null)
    })
  }

  handleDeleteConfirmed () {
    const {appActions, blockedFilesActions, selectedItemIds} = this.props
    const userId = this.props.params.userId
    blockedFilesActions.delete(userId, selectedItemIds, count => {
      appActions.notify('common.delete', 'common.deleted')
      blockedFilesActions.clearSelectedItems()
    })
  }

  renderAddress (entity, columnName, column, globals) {
    if (entity.client.address) {
      return <AddressTile address={entity.client.address} />
    }
    return null
  }

  render () {
    const {formError, locale, user} = this.props

    if (!user) return null

    const title = `${user.firstName} ${user.lastName} - ${this.message('titleSuffix')}`

    return (
      <div>
        <Toolbar title={title} backTo="/accounts">
          <ConfirmButton locale={locale} onClick={this.handleDeleteConfirmed} disabled={this.props.selectedItemIds.length === 0}>
            {this.message('delete', 'common')}
          </ConfirmButton>
        </Toolbar>
        <FormError error={formError} locale={locale} />
        <div style={{height: '500px'}}>
          <SmartTable
            selectable
            rows={this.props.blockedFiles}
            messageWhenEmpty={this.message('noLinks')}
            clientTypesById={this.props.clientTypesById}
            locale={locale}
            selectedItemIds={this.props.selectedItemIds}
            onRowSelected={this.props.blockedFilesActions.toggleSelectedItem}
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
            onCreateLink={this.handleCreateBlockedFile}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    blockedFiles: BlockedFileSelectors.getBlockedFiles(state),
    selectedClient: BlockedFileSelectors.getSelectedClient(state),
    canCreateLink: BlockedFileSelectors.canCreateLink(state, props),
    selectedItemIds: BlockedFileSelectors.getSelectedItemIds(state),
    user: AccountSelectors.getEditedEntity(state),
    locale: getLocale(state)
  }
}

ManageBlockedFilesPage.propTypes = {
  blockedFiles: PropTypes.array.isRequired,
  selectedClient: PropTypes.object,
  canCreateLink: PropTypes.bool.isRequired,
  selectedItemIds: PropTypes.array.isRequired,
  user: PropTypes.object,

  locale: PropTypes.string.isRequired,
  formError: PropTypes.any,

  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

const ConnectedManageBlockedFilesPage = connect(mapStateToProps, mapDispatchToProps)(ManageBlockedFilesPage)

export default ConnectedManageBlockedFilesPage
