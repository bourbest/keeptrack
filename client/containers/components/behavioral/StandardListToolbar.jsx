import React from 'react'
import { browserHistory } from 'react-router'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// modules
import { ActionCreators as AppActions } from '../../../modules/app/actions'
import {getLocale, getDisplayedModalName} from '../../../modules/app/selectors'

// components
import { Button, Confirm, Dropdown } from 'semantic-ui-react'
import {createTranslate} from '../../../locales/translate'
import Toolbar from '../Toolbar/Toolbar'
import SearchBox from '../controls/SearchBox'

const DELETE_MODAL_NAME = 'standardListToolbar.delete'
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
      this.handleDeleteClicked = this.handleDeleteClicked.bind(this)
      this.handleRestoreClicked = this.handleRestoreClicked.bind(this)
      this.handleDeleteConfirmed = this.handleDeleteConfirmed.bind(this)
      this.handleSearchChanged = this.handleSearchChanged.bind(this)
      this.handleViewChanged = this.handleViewChanged.bind(this)

      this.message = createTranslate(labelNamespace, this)
    }

    handleCreate () {
      const createUrl = `/${entityUrl}/create`
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

    handleDeleteClicked () {
      this.props.appActions.showModal(DELETE_MODAL_NAME)
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

    componentWillUnmount () {
      if (this.props.isDeleteModalDisplayed) {
        this.props.appActions.hideModal()
      }
    }

    handleSearchChanged (newValue) {
      if (this.props.overrideSearchChanged) {
        this.props.overrideSearchChanged(newValue)
      } else {
        this.props.actions.setFilterValue('contains', newValue, this.props.useServerFilters)
      }
    }

    handleViewChanged (event, params) {
      const isArchived = params.value === 'archived'
      this.props.actions.setFilterValue('isArchived', isArchived, true)

      const filters = {...this.props.serverSearchFilters, isArchived}
      this.props.actions.fetchAll(filters, true)
    }

    render () {
      const {noAdd, noDelete, noSearch, children, isDeleteModalDisplayed, isDisplayingArchived} = this.props
      const {isCreateEnabled, isDeleteEnabled, isRestoreEnabled} = this.props
      const handleCreate = this.props.overrideCreateClicked || this.handleCreate
      const searchFilter = this.props.useServerFilters ? this.props.serverSearchFilters.contains : this.props.localSearchFilters.contains

      const archivedLabel = this.message('archivedElements', 'common')
      const activeLabel = this.message('activeElements', 'common')
      const selectedView = isDisplayingArchived ? archivedLabel : activeLabel

      return (
        <Toolbar>
          <div className="item section-title">{this.message('list-title')}</div>
          <div className="ui secondary right menu">
            <Dropdown item text={selectedView} style={{'marginRight': '90px'}} >
              <Dropdown.Menu>
                <Dropdown.Header>{this.message('selectViewHeader', 'common')}</Dropdown.Header>
                <Dropdown.Item value="archived" onClick={this.handleViewChanged}>{archivedLabel}</Dropdown.Item>
                <Dropdown.Item value="active" onClick={this.handleViewChanged}>{activeLabel}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
              <Button type="button" secondary onClick={this.handleDeleteClicked} disabled={!isDeleteEnabled}>
                {this.message('delete', 'common')}
              </Button>
            }
            {!noDelete && !isDisplayingArchived &&
              <Confirm
                content={this.message('confirm-delete', 'common')}
                cancelButton={this.message('no', 'common')}
                confirmButton={this.message('yes', 'common')}
                open={isDeleteModalDisplayed}
                onCancel={this.props.appActions.hideModal}
                onConfirm={this.handleDeleteConfirmed}
                />
            }
            {!noDelete && isDisplayingArchived &&
              <Button type="button" secondary onClick={this.handleRestoreClicked} disabled={!isRestoreEnabled}>
                {this.message('restore', 'common')}
              </Button>
            }
          </div>
        </Toolbar>
      )
    }
  }

  StandardListToolbar.propTypes = {
    localSearchFilters: React.PropTypes.object.isRequired,
    serverSearchFilters: React.PropTypes.object.isRequired,
    selectedItemIds: React.PropTypes.array.isRequired,
    locale: React.PropTypes.string.isRequired,

    isCreateEnabled: React.PropTypes.bool.isRequired,
    isDeleteEnabled: React.PropTypes.bool.isRequired,
    isRestoreEnabled: React.PropTypes.bool.isRequired,
    isDeleteModalDisplayed: React.PropTypes.bool.isRequired,
    isDisplayingArchived: React.PropTypes.bool.isRequired,

    // override behavior
    overrideSearchChanged: React.PropTypes.func,
    overrideDeleteClicked: React.PropTypes.func,
    overrideCreateClicked: React.PropTypes.func,

    // toolbar options
    noSearch: React.PropTypes.bool.isRequired,
    noDelete: React.PropTypes.bool.isRequired,
    noAdd: React.PropTypes.bool.isRequired,
    useServerFilters: React.PropTypes.bool.isRequired,

    children: React.PropTypes.any,

    actions: React.PropTypes.object.isRequired,
    appActions: React.PropTypes.object.isRequired
  }

  StandardListToolbar.defaultProps = {
    noSearch: false,
    noDelete: false,
    noAdd: false,
    useServerFilters: false
  }

  const mapStateToProps = (state) => {
    return {
      localSearchFilters: entitySelectors.getListLocalFilters(state),
      serverSearchFilters: entitySelectors.getListServerFilters(state),
      selectedItemIds: entitySelectors.getSelectedItemIds(state),
      locale: getLocale(state),
      isDisplayingArchived: entitySelectors.isListDisplayingArchived(state),
      isDeleteEnabled: entitySelectors.isListDeleteEnabled(state),
      isRestoreEnabled: entitySelectors.isListRestoreEnabled(state),
      isCreateEnabled: entitySelectors.isListCreateEnabled(state),
      isDeleteModalDisplayed: getDisplayedModalName(state) === DELETE_MODAL_NAME
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(StandardListToolbar)
}

export default makeStandardListToolbar
