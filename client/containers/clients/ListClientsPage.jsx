import React from 'react'

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

import { FormError } from '../components/forms/FormError'
import makeStandardToolbar from '../components/behavioral/StandardListToolbar'
import ClientList from './components/ClientList'

const labelNamespace = 'clients'
const StandardToolbar = makeStandardToolbar(ClientActions, ClientSelectors, labelNamespace, 'clients')

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class ListClientsPage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.setSort = this.setSort.bind(this)
    this.message = createTranslate(labelNamespace, this)
  }

  componentWillMount () {
    this.props.actions.clearSelectedItems()
    this.props.actions.setEditedEntity(null)
  }

  componentDidMount () {
    this.props.actions.fetchAll()
  }

  setSort ({sortBy, sortDirection}) {
    this.props.actions.setSortParams([{field: sortBy, direction: sortDirection}])
  }

  render () {
    const {formError, locale} = this.props
    return (
      <div>
        <div className="main-content">
          <FormError error={formError} locale={locale} />

          <StandardToolbar />
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
