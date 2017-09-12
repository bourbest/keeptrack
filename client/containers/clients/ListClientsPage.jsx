import React from 'react'
import { browserHistory } from 'react-router'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// module
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as ClientActions } from '../../modules/clients/actions'
import ClientSelectors from '../../modules/clients/selectors'
import { getLocale } from '../../modules/app/selectors'

// components
import {createTranslate} from '../../locales/translate'
import { Confirm } from 'semantic-ui-react'
import { FormError } from '../components/forms/FormError'
import StandardToolbar from '../components/behavioral/StandardListToolbar'
import ClientList from './components/ClientList'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

const baseUrl = '/clients/'
const labelNamespace = 'clients'

class ListClientsPage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleFilterEvent = this.handleFilterEvent.bind(this)
    this.create = this.create.bind(this)
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this)
    this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this)
    this.handleDeleteCancel = this.handleDeleteCancel.bind(this)
    this.setSort = this.setSort.bind(this)
    this.message = createTranslate(labelNamespace, this)
  }

  showDeleteConfirm () {
    this.props.actions.showModal('delete')
  }

  handleDeleteConfirm () {
    const {actions, appActions} = this.props
    const count = this.props.selectedItemIds.length
    actions.hideModal()
    actions.deleteEntities(this.props.selectedItemIds, () => {
      actions.clearSelectedItems()
      appActions.notify('common.delete', 'common.deleted', {count})
    })
  }

  handleDeleteCancel () {
    this.props.actions.hideModal()
  }

  componentWillMount () {
    this.props.actions.clearSelectedItems()
    this.props.actions.setEditedEntity(null)
  }

  componentDidMount () {
    this.props.actions.fetchAll()
  }

  handleFilterEvent (event) {
    this.props.actions.setListLocalFilters({contains: event.target.value})
  }

  create () {
    browserHistory.push(`${baseUrl}create`)
  }

  setSort ({sortBy, sortDirection}) {
    this.props.actions.setSortParams([{field: sortBy, direction: sortDirection}])
  }

  render () {
    const {formError, locale} = this.props
    return (
      <div>
        <Confirm
          content={this.message('confirm-delete', 'common')}
          cancelButton={this.message('no', 'common')}
          confirmButton={this.message('yes', 'common')}
          open={this.props.displayedModalName === 'delete'}
          onCancel={this.handleDeleteCancel}
          onConfirm={this.handleDeleteConfirm}
        />
        <div className="main-content">
          <FormError error={formError} locale={locale} />

          <StandardToolbar locale={locale}
            onDeleteClicked={this.showDeleteConfirm}
            onCreateClicked={this.create}
            onContainsFilterChanged={this.handleFilterEvent}
            labelNamespace={labelNamespace}
            listContainsFilter={this.props.listFilters.contains}
            isDeleteEnabled={this.props.isDeleteEnabled}
            title={this.message('list-title')}
          />
          <ClientList
            entities={this.props.entities}
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
    entities: ClientSelectors.getFilteredSortedList(state),
    listFilters: ClientSelectors.getListLocalFilters(state),
    sortParams: ClientSelectors.getSortParams(state),
    selectedItemIds: ClientSelectors.getSelectedItemIds(state),
    locale: getLocale(state),

    displayedModalName: ClientSelectors.getDisplayedModalName(state),
    formError: ClientSelectors.getSubmitError(state),
    isDeleteEnabled: ClientSelectors.isListDeleteEnabled(state)
  }
}

ListClientsPage.propTypes = {
  entities: React.PropTypes.array.isRequired,
  listFilters: React.PropTypes.object.isRequired,
  sortParams: React.PropTypes.array.isRequired,
  selectedItemIds: React.PropTypes.array.isRequired,
  locale: React.PropTypes.string.isRequired
}

const ConnectedListClientsPage = connect(mapStateToProps, mapDispatchToProps)(ListClientsPage)

export default ConnectedListClientsPage
