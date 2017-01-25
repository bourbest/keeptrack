import React from 'react'
import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { ActionCreators as ClientFileActions } from '../../modules/client-file/actions'
import ClientFileSelectors from '../../modules/client-file/selectors'

import ClientFileDetails from '../../components/ClientFileDetails'

const { object } = React.PropTypes

const mapStateToProps = (state, props) => {
  return {
    file: ClientFileSelectors.getEditedEntity(state)
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

  navToListPostUpdate () {
    browserHistory.push('/client/')
  }

  navToListPostCreate (entity) {
    browserHistory.replace(`/client/${entity.id}`)
    browserHistory.push('/client/')
  }

  save () {
    if (this.props.file.id) {
      this.props.actions.updateEntity(this.props.file, this.navToListPostUpdate)
    } else {
      this.props.actions.createEntity(this.props.file, this.navToListPostCreate)
    }
  }

  handleAttributeModified (attr, value) {
    const update = {[attr]: value}
    this.props.actions.updateEditedEntity(update)
  }

  componentWillMount () {
    const id = this.props.params.id || null
    this.props.actions.clearEditedEntity()
    if (id !== 'create') {
      this.props.actions.loadEditedEntity(id)
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
