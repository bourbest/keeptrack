import React from 'react'
import PropTypes from 'prop-types'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// module
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as actions } from '../../modules/form-shortcut/actions'
import { getLocale } from '../../modules/app/selectors'

import FormShortcutSelectors from '../../modules/form-shortcut/selectors'

// components
import { FormError } from '../components/forms/FormError'
import {createTranslate} from '../../locales/translate'
import makeStandardToolbar from '../components/behavioral/StandardListToolbar'
import {SmartTable, Column, renderLinkToDetail} from '../components/SmartTable'

const labelNamespace = 'form-shortcut'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

const ShortcutToolbar = makeStandardToolbar(actions, FormShortcutSelectors, labelNamespace, '/form-shortcuts')

class ListFormShortcutPage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate(labelNamespace, this)
  }

  componentWillMount () {
    this.props.actions.clearSelectedItems()
    this.props.actions.setEditedEntity(null)
    this.props.actions.fetchList()
  }

  render () {
    const {formError, locale, formTemplateShortcuts} = this.props
    return (
      <div>
        <ShortcutToolbar useDelete noSearch location={this.props.location} />
        <FormError error={formError} locale={locale} />
        <SmartTable
          rows={formTemplateShortcuts}
          selectable
          selectedItemIds={this.props.selectedItemIds}
          onRowSelected={this.props.actions.toggleSelectedItem}
          location={this.props.location}
        >
          <Column name="labels.fr" label={this.message('fr', 'common')} renderer={renderLinkToDetail} />
          <Column name="labels.en" label={this.message('en', 'common')} renderer={renderLinkToDetail} />
        </SmartTable>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    locale: getLocale(state),
    formTemplateShortcuts: FormShortcutSelectors.getEntitiesPage(state),
    selectedItemIds: FormShortcutSelectors.getSelectedItemIds(state)
  }
}

ListFormShortcutPage.propTypes = {
  locale: PropTypes.string.isRequired,
  formTemplateShortcuts: PropTypes.array.isRequired,
  selectedItemIds: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired
}

const ConnectedListFormShortcutPage = connect(mapStateToProps, mapDispatchToProps)(ListFormShortcutPage)

export default ConnectedListFormShortcutPage
