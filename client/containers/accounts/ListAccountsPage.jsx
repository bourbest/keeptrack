import React from 'react'
import PropTypes from 'prop-types'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// module
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as AccountActions } from '../../modules/accounts/actions'
import AccountSelectors from '../../modules/accounts/selectors'
import { getLocale } from '../../modules/app/selectors'

// components
import {createTranslate} from '../../locales/translate'
import { FormError } from '../components/forms/FormError'
import makeStandardToolbar from '../components/behavioral/StandardListToolbar'
import {SmartTable, Column, renderLinkToDetail} from '../components/SmartTable'
import {Pagination} from '../components/Pagination'

const labelNamespace = 'accounts'
const StandardToolbar = makeStandardToolbar(AccountActions, AccountSelectors, labelNamespace, 'accounts')

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AccountActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class ListAccountsPage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate(labelNamespace, this)
  }

  componentWillMount () {
    this.props.actions.clearSelectedItems()
    this.props.actions.setEditedEntity(null)
    this.props.actions.fetchList(this.props.urlParams)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.urlParams !== this.props.urlParams) {
      this.props.actions.fetchList(nextProps.urlParams)
    }
  }

  render () {
    const {formError, locale} = this.props
    return (
      <div>
        <StandardToolbar location={this.props.location} />
        <FormError error={formError} locale={locale} />
        <SmartTable
          rows={this.props.entities}
          selectable
          selectedItemIds={this.props.selectedItemIds}
          onRowSelected={this.props.actions.toggleSelectedItem}
          location={this.props.location}
        >
          <Column name="username" label={this.message('userName')} renderer={renderLinkToDetail} />
          <Column name="lastName" label={this.message('lastName')} />
          <Column name="firstName" label={this.message('firstName')} />
        </SmartTable>
        {this.props.totalPages > 1 &&
          <div className="ui centered grid">
            <div className="center aligned column">
              <Pagination
                location={this.props.location}
                totalPages={this.props.totalPages}
              />
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    urlParams: AccountSelectors.getUrlParams(state, props),
    entities: AccountSelectors.getEntitiesPage(state),
    totalPages: AccountSelectors.getTotalPages(state, props),
    listFilters: AccountSelectors.getFilters(state, props),
    selectedItemIds: AccountSelectors.getSelectedItemIds(state),
    locale: getLocale(state),

    formError: AccountSelectors.getSubmitError(state),
    isDeleteEnabled: AccountSelectors.isListDeleteEnabled(state)
  }
}

ListAccountsPage.propTypes = {
  urlParams: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  totalPages: PropTypes.number.isRequired,
  listFilters: PropTypes.object.isRequired,
  selectedItemIds: PropTypes.array.isRequired,
  locale: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  formError: PropTypes.any
}

const ConnectedListAccountsPage = connect(mapStateToProps, mapDispatchToProps)(ListAccountsPage)

export default ConnectedListAccountsPage
