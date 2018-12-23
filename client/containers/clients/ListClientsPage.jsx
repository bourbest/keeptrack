import React from 'react'
import PropTypes from 'prop-types'
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

import {SmartTable, Column, renderLinkToDetail} from '../components/SmartTable'
import {Pagination} from '../components/Pagination'
import { Button } from '../components/controls/SemanticControls'

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
        <StandardToolbar location={this.props.location}>
          <Button type="button" onClick={this.props.actions.copyDistributionList}>
            {this.message('copyDistributionList')}
          </Button>
        </StandardToolbar>
        <FormError error={formError} locale={locale} />
        <SmartTable
          rows={this.props.entities}
          selectable
          selectedItemIds={this.props.selectedItemIds}
          onRowSelected={this.props.actions.toggleSelectedItem}
          location={this.props.location}
        >
          <Column name="lastName" label={this.message('lastName')} renderer={renderLinkToDetail} />
          <Column name="firstName" label={this.message('firstName')} renderer={renderLinkToDetail} />
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
    urlParams: ClientSelectors.getUrlParams(state, props),
    entities: ClientSelectors.getEntitiesPage(state),
    totalPages: ClientSelectors.getTotalPages(state, props),
    listFilters: ClientSelectors.getFilters(state, props),
    selectedItemIds: ClientSelectors.getSelectedItemIds(state),
    locale: getLocale(state),

    formError: ClientSelectors.getSubmitError(state),
    isDeleteEnabled: ClientSelectors.isListDeleteEnabled(state)
  }
}

ListClientsPage.propTypes = {
  urlParams: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  totalPages: PropTypes.number.isRequired,
  listFilters: PropTypes.object.isRequired,
  selectedItemIds: PropTypes.array.isRequired,
  locale: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  formError: PropTypes.any
}

const ConnectedListClientsPage = connect(mapStateToProps, mapDispatchToProps)(ListClientsPage)

export default ConnectedListClientsPage
