import React from 'react'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// module
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as AccountActions } from '../../modules/form-templates/actions'
import AccountSelectors from '../../modules/form-templates/selectors'
import { getLocale } from '../../modules/app/selectors'

// components
import {createTranslate} from '../../locales/translate'

import { FormError } from '../components/forms/FormError'
import makeStandardToolbar from '../components/behavioral/StandardListToolbar'
import FormTemplateList from './components/FormTemplateList'

const labelNamespace = 'formTemplates'
const StandardToolbar = makeStandardToolbar(AccountActions, AccountSelectors, labelNamespace, 'form-templates')

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AccountActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class ListAccountsPage extends React.PureComponent {
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
    this.props.actions.fetchAll(this.props.listServerFilters)
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
          <FormTemplateList
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
    entities: AccountSelectors.getFilteredSortedList(state),
    listFilters: AccountSelectors.getListLocalFilters(state),
    listServerFilters: AccountSelectors.getListServerFilters(state),
    sortParams: AccountSelectors.getSortParams(state),
    selectedItemIds: AccountSelectors.getSelectedItemIds(state),
    locale: getLocale(state),

    formError: AccountSelectors.getSubmitError(state),
    isDeleteEnabled: AccountSelectors.isListDeleteEnabled(state)
  }
}

ListAccountsPage.propTypes = {
  entities: React.PropTypes.array.isRequired,
  listFilters: React.PropTypes.object.isRequired,
  listServerFilters: React.PropTypes.object.isRequired,
  sortParams: React.PropTypes.array.isRequired,
  selectedItemIds: React.PropTypes.array.isRequired,
  locale: React.PropTypes.string.isRequired
}

const ConnectedListAccountsPage = connect(mapStateToProps, mapDispatchToProps)(ListAccountsPage)

export default ConnectedListAccountsPage
