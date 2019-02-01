import React from 'react'
import PropTypes from 'prop-types'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// module
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as AccountActions } from '../../modules/form-templates/actions'
import FormsSelectors from '../../modules/form-templates/selectors'
import { getLocale } from '../../modules/app/selectors'

// components
import {createTranslate} from '../../locales/translate'

import { FormError } from '../components/forms/FormError'
import makeStandardToolbar from '../components/behavioral/StandardListToolbar'
import {SmartTable, Column, renderLinkToDetail} from '../components/SmartTable'
import {Pagination} from '../components/Pagination'

const labelNamespace = 'formTemplates'
const StandardToolbar = makeStandardToolbar(AccountActions, FormsSelectors, labelNamespace, 'form-templates')

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AccountActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class ListFormsPage extends React.PureComponent {
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

  canSelectRow (row) {
    return !row.isSystem
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
          canSelectRow={this.canSelectRow}
        >
          <Column name="name" label={this.message('name')} renderer={renderLinkToDetail} />
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
    urlParams: FormsSelectors.getUrlParams(state, props),
    entities: FormsSelectors.getEntitiesPage(state),
    totalPages: FormsSelectors.getTotalPages(state, props),
    listFilters: FormsSelectors.getFilters(state, props),
    selectedItemIds: FormsSelectors.getSelectedItemIds(state),
    locale: getLocale(state),

    formError: FormsSelectors.getSubmitError(state),
    isDeleteEnabled: FormsSelectors.isListDeleteEnabled(state)
  }
}

ListFormsPage.propTypes = {
  urlParams: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  totalPages: PropTypes.number.isRequired,
  listFilters: PropTypes.object.isRequired,
  selectedItemIds: PropTypes.array.isRequired,
  locale: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired
}

const ConnectedListFormsPage = connect(mapStateToProps, mapDispatchToProps)(ListFormsPage)

export default ConnectedListFormsPage
