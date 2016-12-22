import { ActionCreators as ClientFileActions } from '../../redux/modules/client-file'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getCurrentFile } from '../../redux/selectors/client-file-selectors'
import React from 'react'

import ClientFileDetails from '../../components/ClientFileDetails'

const { object } = React.PropTypes

const mapStateToProps = (state, props) => {
  return {
    file: getCurrentFile(state, props)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientFileActions, dispatch)
  }
}

const EditClientFile = React.createClass({
  propTypes: {
    file: object,
    actions: object.isRequired,
    params: object
  },
  getInitialState () {
    return {
      editedFile: {...this.props.file}
    }
  },
  save () {
    if (this.state.editedFile.id) {
      this.props.actions.updateFile(this.state.editedFile)
    } else {
      this.props.actions.createFile(this.state.editedFile)
    }
  },
  handleAttributeModified (attr, value) {
    const newState = {editedFile: {...this.state.editedFile}}
    newState.editedFile[attr] = value
    this.setState(newState)
  },
  componentWillMount () {
    const id = this.props.params.id || null
    if (id === 'create') {
      this.props.actions.clearDraft()
    } else {
      this.props.actions.fetchFiles(this.props.params.id)
    }
  },
  render () {
    const file = this.state.editedFile
    return (
      <div>
        <div>
          <ClientFileDetails onModifiedAttribute={this.handleAttributeModified} clientFile={file} />
          <button onClick={this.save}>Enregistrer</button>
        </div>
      </div>
    )
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EditClientFile)
