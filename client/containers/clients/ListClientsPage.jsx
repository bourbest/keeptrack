import React from 'react'
import { browserHistory } from 'react-router'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// module
import { ActionCreators as ClientActions } from '../../modules/clients/actions'
import { ActionCreators as AppActions } from '../../modules/app/actions'
import ClientSelectors from '../../modules/clients/selectors'
import { getLocale } from '../../modules/app/selectors'

// components
import ClientList from './components/ClientList'
import { FormError } from '../components/forms/FormError'
import { Button, Confirm } from 'semantic-ui-react'
import Toolbar from '../components/Toolbar'
import {createTranslate} from '../../locales/translate'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class ListClientsPage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleFilterEvent = this.handleFilterEvent.bind(this)
    this.create = this.create.bind(this)
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this)
    this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this)
    this.handleDeleteCancel = this.handleDeleteCancel.bind(this)
    this.setSort = this.setSort.bind(this)
    this.state = {displayConfirmModal: false}

    this.message = createTranslate('clients', this)
  }

  showDeleteConfirm () {
    this.setState({displayConfirmModal: true})
  }

  handleDeleteConfirm () {
    const {actions, appActions} = this.props
    const count = this.props.selectedItemIds.length
    this.setState({displayConfirmModal: false})
    actions.deleteEntities(this.props.selectedItemIds, () => {
      actions.clearSelectedItems()
      appActions.notify('common.delete', 'common.deleted', {count})
    })
  }

  handleDeleteCancel () {
    this.setState({displayConfirmModal: false})
  }

  componentWillMount () {
    this.props.actions.clearSelectedItems()
    this.props.actions.setEditedEntity(null)
  }

  componentDidMount () {
    this.props.actions.fetchAll({catalogId: this.props.catalogId})
  }
  handleFilterEvent (event) {
    this.props.actions.setListFilter(event.target.value)
  }

  create () {
    browserHistory.push('/clients/create')
  }

  setSort ({sortBy, sortDirection}) {
    if (sortBy === 'names') {
      sortBy = `${sortBy}.${this.props.locale}`
    }
    this.props.actions.setSortParams([{field: sortBy, direction: sortDirection}])
  }

  render () {
    const { formError, locale, selectedItemIds } = this.props
    return (
      <div>
        <Toolbar title={this.message('list-title')}>
          <div className="ui right icon input search-input">
            <i className="search icon"></i>
            <input type='text' placeholder={this.message('filterSearch', 'common')}
              value={this.props.productsFilter} onChange={this.handleFilterEvent} />
          </div>
          <Button primary onClick={this.create}>
            {this.message('create')}
          </Button>
          <Button secondary onClick={this.showDeleteConfirm} disabled={selectedItemIds.length === 0}>
            {this.message('delete', 'common')}
          </Button>
        </Toolbar>
        <Confirm
          content={this.message('confirm-delete', 'common')}
          cancelButton={this.message('no', 'common')}
          confirmButton={this.message('yes', 'common')}
          open={this.state.displayConfirmModal}
          onCancel={this.handleDeleteCancel}
          onConfirm={this.handleDeleteConfirm}
        />
        <div className="main-content">
          <FormError error={formError} locale={locale} />

          <ClientList
            clients={this.props.clients}
            onToggleSelected={this.props.actions.toggleSelectedItem}
            setSort={this.setSort}
            sortParams={this.props.sortParams}
            selectedItemIds={this.props.selectedItemIds}
            locale={this.props.locale}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    clients: ClientSelectors.getFilteredSortedList(state),
    listFilter: ClientSelectors.getListFilter(state),
    sortParams: ClientSelectors.getSortParams(state),
    selectedItemIds: ClientSelectors.getSelectedItemIds(state),
    locale: getLocale(state),

    formError: ClientSelectors.getSubmitError(state),
    isSubmitting: ClientSelectors.isSubmitting(state)
  }
}

ListClientsPage.propTypes = {
  clients: React.PropTypes.array.isRequired,
  listFilter: React.PropTypes.string.isRequired,
  sortParams: React.PropTypes.array.isRequired,
  selectedItemIds: React.PropTypes.array.isRequired,
  locale: React.PropTypes.string.isRequired,

  formError: React.PropTypes.string,
  isSubmitting: React.PropTypes.bool.isRequired
}
const ClientsPageConnected = connect(mapStateToProps, mapDispatchToProps)(ListClientsPage)
export default ClientsPageConnected
