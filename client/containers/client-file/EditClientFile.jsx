import { ActionCreators as ClientFileActions } from '../../redux/modules/client-file'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getEditedFile } from '../../redux/selectors/client-file-selectors'
import React from 'react'

import ClientFileDetails from '../../components/ClientFileDetails'

const { object } = React.PropTypes

const mapStateToProps = (state, props) => {
  return {
    file: getEditedFile(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientFileActions, dispatch)
  }
}

class EditClientFile extends React.Component {
  constructor (props) {
    super(props)

    this.save = this.save.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.handleAttributeModified = this.handleAttributeModified.bind(this)
  }

  save () {
    if (this.props.file.id) {
      this.props.actions.updateFile(this.props.file)
    } else {
      this.props.actions.createFile(this.props.file)
    }
  }

  handleAttributeModified (attr, value) {
    const update = {[attr]: value}
    this.props.actions.updateEditedFile(update)
  }

  componentWillMount () {
    const id = this.props.params.id || null
    this.props.actions.clearEditedFile()
    if (id !== 'create') {
      this.props.actions.loadEditedFile(id)
    }
  }

  render () {
    const file = this.props.file
    return (
      <div>
        <div>
          <ClientFileDetails onModifiedAttribute={this.handleAttributeModified} clientFile={file} />
          <button onClick={this.save}>Enregistrer</button>
        </div>
      </div>
    )
  }
}

EditClientFile.propTypes = {
  file: object,
  actions: object.isRequired,
  params: object
}

export default connect(mapStateToProps, mapDispatchToProps)(EditClientFile)
