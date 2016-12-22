import React from 'react'
import { browserHistory } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { ActionCreators as ClientFileActions } from '../../redux/modules/client-file'
import { getClientFiles, getFilteredClientFiles, getClientFileFilter } from '../../redux/selectors/client-file-selectors'

import ClientFileList from '../../components/ClientFileList'

const { object, string } = React.PropTypes

const mapStateToProps = (state) => {
  return {
    clientFiles: getClientFiles(state),
    clientFileFilter: getClientFileFilter(state),
    filteredClientFiles: getFilteredClientFiles(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientFileActions, dispatch)
  }
}

const ManageClientFiles = React.createClass({
  propTypes: {
    actions: object.isRequired,
    clientFileFilter: string.isRequired,
    clientFiles: object.isRequired,
    filteredClientFiles: object.isRequired,
    params: object
  },
  componentWillMount () {
    this.props.actions.fetchFiles()
  },
  handleFilterEvent (event) {
    this.props.actions.setFilter(event.target.value)
  },
  createNewFile () {
    browserHistory.push('/client/create')
  },
  render () {
    return (
      <div>
        <button onClick={this.createNewFile}>Nouveau dossier</button>
        <input type='text' className='search-input' placeholder='search' value={this.props.clientFileFilter} onChange={this.handleFilterEvent} />
        <div>
          <ClientFileList clientFiles={this.props.filteredClientFiles} />
        </div>
      </div>
    )
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ManageClientFiles)
