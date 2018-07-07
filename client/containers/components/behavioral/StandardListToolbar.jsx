import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import {buildUrl} from '../../../services/url-utils'
import {omit} from 'lodash'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// modules
import { ActionCreators as AppActions } from '../../../modules/app/actions'
import {getLocale} from '../../../modules/app/selectors'

// components
import { Button, Dropdown, ConfirmButton } from '../controls/SemanticControls'
import {createTranslate} from '../../../locales/translate'
import Toolbar from '../Toolbar/Toolbar'
import SearchBox from '../controls/SearchBox'

const makeStandardListToolbar = (entityActions, entitySelectors, labelNamespace, entityUrl) => {
  const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(entityActions, dispatch),
      appActions: bindActionCreators(AppActions, dispatch)
    }
  }
  class StandardListToolbar extends React.Component {

    constructor (props) {
      super(props)
      this.handleCreate = this.handleCreate.bind(this)
      this.handleRestoreClicked = this.handleRestoreClicked.bind(this)
      this.handleDeleteConfirmed = this.handleDeleteConfirmed.bind(this)
      this.handleSearchChanged = this.handleSearchChanged.bind(this)
      this.handleViewChanged = this.handleViewChanged.bind(this)

      this.message = createTranslate(labelNamespace, this)
      this.filterOptions = [
        {value: 'active', text: this.message('activeElements', 'common')},
        {value: 'archived', text: this.message('archivedElements', 'common')}
      ]
    }

    handleCreate () {
      const createParams = {
        backTo: buildUrl(entityUrl, this.props.urlParams)
      }

      const createUrl = buildUrl(`${entityUrl}/create`, createParams)
      browserHistory.push(createUrl)
    }

    handleRestoreClicked () {
      const {actions, appActions, selectedItemIds} = this.props
      const count = selectedItemIds.length
      actions.restoreEntities(selectedItemIds, () => {
        actions.clearSelectedItems()
        appActions.notify('common.restore', 'common.restored', {count})
      })
    }

    handleDeleteConfirmed () {
      const {actions, appActions, selectedItemIds} = this.props
      const count = selectedItemIds.length
      appActions.hideModal()
      actions.deleteEntities(selectedItemIds, () => {
        actions.clearSelectedItems()
        appActions.notify('common.delete', 'common.deleted', {count})
      })
    }

    handleSearchChanged (newValue) {
      const urlParams = omit(this.props.urlParams, 'contains')
      if (newValue.length > 0) {
        urlParams.contains = newValue
      }
      const url = buildUrl(entityUrl, urlParams)
      browserHistory.replace(url)
    }

    handleViewChanged (event) {
      const urlParams = omit(this.props.urlParams, 'isArchived')
      if (event.target.value === 'archived') {
        urlParams.isArchived = 'true'
      }
      const url = buildUrl(entityUrl, urlParams)
      browserHistory.replace(url)
    }

    render () {
      const {noAdd, noDelete, noSearch, children, isDisplayingArchived, locale} = this.props
      const {isCreateEnabled, isDeleteEnabled, isRestoreEnabled} = this.props
      const handleCreate = this.props.overrideCreateClicked || this.handleCreate
      const searchFilter = this.props.urlParams.contains || ''

      return (
        <Toolbar title={this.message('list-title')}>
          <Dropdown
            options={this.filterOptions}
            value={isDisplayingArchived ? 'archived' : 'active'}
            onChange={this.handleViewChanged}
          />
          {!noSearch &&
            <SearchBox placeholder={this.message('filterSearch', 'common')}
              value={searchFilter}
              onChange={this.handleSearchChanged} />
          }
          {children}
          {!noAdd &&
            <Button type="button" primary onClick={handleCreate} disabled={!isCreateEnabled}>
              {this.message('create', 'common')}
            </Button>
          }
          {!noDelete && !isDisplayingArchived &&
            <ConfirmButton locale={locale} onClick={this.handleDeleteConfirmed} disabled={!isDeleteEnabled}>
              {this.message('delete', 'common')}
            </ConfirmButton>
          }
          {!noDelete && isDisplayingArchived &&
            <Button type="button" secondary onClick={this.handleRestoreClicked} disabled={!isRestoreEnabled}>
              {this.message('restore', 'common')}
            </Button>
          }
        </Toolbar>
      )
    }
  }

  StandardListToolbar.propTypes = {
    location: PropTypes.object, // from container

    // properties from selector
    urlParams: PropTypes.object.isRequired,
    selectedItemIds: PropTypes.array.isRequired,
    locale: PropTypes.string.isRequired,

    isCreateEnabled: PropTypes.bool.isRequired,
    isDeleteEnabled: PropTypes.bool.isRequired,
    isRestoreEnabled: PropTypes.bool.isRequired,
    isDisplayingArchived: PropTypes.bool.isRequired,

    // override behavior
    overrideSearchChanged: PropTypes.func,
    overrideDeleteClicked: PropTypes.func,
    overrideCreateClicked: PropTypes.func,

    // toolbar options
    noSearch: PropTypes.bool.isRequired,
    noDelete: PropTypes.bool.isRequired,
    noAdd: PropTypes.bool.isRequired,
    useServerFilters: PropTypes.bool.isRequired,

    children: PropTypes.any,

    actions: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired
  }

  StandardListToolbar.defaultProps = {
    noSearch: false,
    noDelete: false,
    noAdd: false,
    useServerFilters: false
  }

  const mapStateToProps = (state, props) => {
    return {
      urlParams: entitySelectors.getUrlParams(state, props),
      selectedItemIds: entitySelectors.getSelectedItemIds(state),
      locale: getLocale(state),
      isDisplayingArchived: entitySelectors.isListDisplayingArchived(state, props),
      isDeleteEnabled: entitySelectors.isListDeleteEnabled(state),
      isRestoreEnabled: entitySelectors.isListRestoreEnabled(state),
      isCreateEnabled: entitySelectors.isListCreateEnabled(state)
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(StandardListToolbar)
}

export default makeStandardListToolbar
