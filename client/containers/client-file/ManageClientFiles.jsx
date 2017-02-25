import React from 'react'
import { browserHistory } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { ActionCreators as ClientFileActions } from '../../modules/client-file/actions'
import ClientFileSelectors from '../../modules/client-file/selectors'

// import ClientFileList from './components/ClientFileList'
import EntityList from '../../components/EntityList'

const { object, string, array } = React.PropTypes

const mapStateToProps = (state) => {
  return {
    clientFiles: ClientFileSelectors.getEntities(state),
    clientFileFilter: ClientFileSelectors.getListFilter(state),
    filteredClientFiles: ClientFileSelectors.getFilteredList(state),
    selectedItemIds: ClientFileSelectors.getSelectedItemIds(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientFileActions, dispatch)
  }
}

const formatName = (file) => `${file.firstName} ${file.lastName}`

class ManageClientFiles extends React.Component {
  constructor (props) {
    super(props)

    this.handleFilterEvent = this.handleFilterEvent.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.deleteSelected = this.deleteSelected.bind(this)
  }
  componentWillMount () {
    this.props.actions.fetchAll()
  }
  handleFilterEvent (event) {
    this.props.actions.setListFilter(event.target.value)
  }
  createNewFile () {
    browserHistory.push('/client/create')
  }
  deleteSelected () {
    this.props.actions.deleteEntities(this.props.selectedItemIds)
  }
  render () {
    return (
      <div>
        <button onClick={this.createNewFile}>Nouveau dossier</button>
        <button onClick={this.deleteSelected}>Supprimer</button>
        <input type='text' className='search-input' placeholder='search' value={this.props.clientFileFilter} onChange={this.handleFilterEvent} />
        <div>
          <EntityList entities={this.props.filteredClientFiles}
            onToggleSelected={this.props.actions.toggleSelectedItem}
            selectedItemIds={this.props.selectedItemIds}
            linkTo="/client"
            formatName={formatName} />
        </div>
      </div>
    )
  }
}

ManageClientFiles.propTypes = {
  actions: object.isRequired,
  clientFileFilter: string.isRequired,
  clientFiles: object.isRequired,
  filteredClientFiles: array.isRequired,
  selectedItemIds: array.isRequired,
  params: object
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageClientFiles)
