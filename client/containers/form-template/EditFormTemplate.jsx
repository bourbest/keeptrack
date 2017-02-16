import React from 'react'
import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { ActionCreators as FormTemplateActions } from '../../modules/form-template/actions'
import FormTemplateSelectors from '../../modules/form-template/selectors'

import FormTemplateDetails from './components/FormTemplateDetails'

const { object } = React.PropTypes

const mapStateToProps = (state, props) => {
  return {
    template: FormTemplateSelectors.getEditedEntity(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(FormTemplateActions, dispatch)
  }
}

class EditFormTemplate extends React.Component {
  constructor (props) {
    super(props)

    this.save = this.save.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.handleAttributeModified = this.handleAttributeModified.bind(this)
  }

  navToListPostUpdate () {
    browserHistory.push('/form-template/')
  }

  navToListPostCreate (entity) {
    browserHistory.replace(`/form-template/${entity.id}`)
    browserHistory.push('/form-template/')
  }

  save () {
    if (this.props.template.id) {
      this.props.actions.updateEntity(this.props.template, this.navToListPostUpdate)
    } else {
      this.props.actions.createEntity(this.props.template, this.navToListPostCreate)
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
      this.props.actions.fetchEditedEntity(id)
    }
  }

  render () {
    const template = this.props.template
    return (
      <div>
        <div>
          <FormTemplateDetails onModifiedAttribute={this.handleAttributeModified} template={template} />
          <button onClick={this.save}>Enregistrer</button>
        </div>
      </div>
    )
  }
}

EditFormTemplate.propTypes = {
  template: object,
  actions: object.isRequired,
  params: object
}

export default connect(mapStateToProps, mapDispatchToProps)(EditFormTemplate)
