import React from 'react'
import { browserHistory } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { ActionCreators as ClientFileActions } from '../../redux/modules/client-file'
import { getClientFiles, getFilteredClientFiles, getClientFileFilter, getSelectedItemIds } from '../../redux/selectors/client-file-selectors'

import ClientFileList from '../../components/ClientFileList'

const { object, string, array } = React.PropTypes

const mapStateToProps = (state) => {
  return {
    clientFiles: getClientFiles(state),
    clientFileFilter: getClientFileFilter(state),
    filteredClientFiles: getFilteredClientFiles(state),
    selectedItemIds: getSelectedItemIds(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientFileActions, dispatch)
  }
}

class ManageClientFiles extends React.Component {
  constructor (props) {
    super(props)

    this.handleFilterEvent = this.handleFilterEvent.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.deleteSelected = this.deleteSelected.bind(this)
  }
  componentWillMount () {
    this.props.actions.fetchFiles()
  }
  handleFilterEvent (event) {
    this.props.actions.setFilter(event.target.value)
  }
  createNewFile () {
    browserHistory.push('/client/create')
  }
  deleteSelected () {
    this.props.actions.deleteFiles(this.props.selectedItemIds)
  }
  render () {
    return (
      <div>
        <button onClick={this.createNewFile}>Nouveau dossier</button>
        <button onClick={this.deleteSelected}>Supprimer</button>
        <input type='text' className='search-input' placeholder='search' value={this.props.clientFileFilter} onChange={this.handleFilterEvent} />
        <div>
          <ClientFileList clientFiles={this.props.filteredClientFiles} onToggleSelected={this.props.actions.toggleSelectedItem} selectedItemIds={this.props.selectedItemIds} />
        </div>
      </div>
    )
  }
}

ManageClientFiles.propTypes = {
  actions: object.isRequired,
  clientFileFilter: string.isRequired,
  clientFiles: object.isRequired,
  filteredClientFiles: object.isRequired,
  selectedItemIds: array.isRequired,
  params: object
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageClientFiles)
