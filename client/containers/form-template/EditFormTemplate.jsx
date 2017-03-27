import React from 'react'
import { browserHistory } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { find, maxBy, filter, sortBy, intersectionBy, differenceBy } from 'lodash'
import { ActionCreators as FormTemplateActions } from '../../modules/form-template/actions'
import FormTemplateSelectors from '../../modules/form-template/selectors'

import ContentEditable from '../../components/controls/ContentEditable'

import FieldSelector from './components/FieldSelector'
import FieldTile from './components/FieldTile'
import FieldAttributesEditor from './components/FieldAttributesEditor'

import addableFieldList from './addable-field-list'

const { object } = React.PropTypes

const mapStateToProps = (state, props) => {
  const template = FormTemplateSelectors.getEditedEntity(state)

  const fieldName = FormTemplateSelectors.getEditedFieldName(state)
  const editedField = fieldName ? find(template.fields, {name: fieldName}) : null

  return {
    template,
    editedField
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
    this.handleFieldAttributeModified = this.handleFieldAttributeModified.bind(this)
    this.addField = this.addField.bind(this)
    this.handleTemplateAttributeModified = this.handleTemplateAttributeModified.bind(this)
    this.onFieldDeleted = this.onFieldDeleted.bind(this)
    this.onFieldSelected = this.onFieldSelected.bind(this)
  }

  navToListPostUpdate () {
    browserHistory.push('/form-template/')
  }

  navToListPostCreate (entity) {
    browserHistory.replace(`/form-template/${entity.id}`)
    browserHistory.push('/form-template/')
  }

  commitTextAreaHeights (template) {
    if (this.refs.fieldNodes) {
      const nodes = this.refs.fieldNodes.getElementsByTagName('textarea')

      if (nodes.length > 0) {
        const fields = template.fields
        const areaFields = intersectionBy(fields, nodes, (x) => x.name)
        const newFields = differenceBy(fields, areaFields)

        for (let i = 0; i < areaFields.length; i++) {
          const oldField = areaFields[i]
          const node = find(nodes, (node) => node.name === oldField.name)
          const newField = {...oldField, height: node.clientHeight}
          newFields.push(newField)
        }

        template.fields = newFields
      }
    }
  }

  save () {
    const newTemplate = {...this.props.template}
    this.commitTextAreaHeights(newTemplate)

    if (this.props.template.id) {
      this.props.actions.updateEntity(newTemplate, this.navToListPostUpdate)
    } else {
      this.props.actions.createEntity(newTemplate, this.navToListPostCreate)
    }
  }

  handleTemplateAttributeModified (event) {
    this.handleAttributeModified(event.target.name, event.target.value)
  }

  handleAttributeModified (attr, value) {
    const update = {[attr]: value}
    this.props.actions.updateEditedEntity(update)
  }

  handleFieldAttributeModified (attr, value) {
    let fields = this.props.template.fields
    const fieldName = this.props.editedField.name

    const oldField = find(fields, {name: fieldName})
    const newField = { ...oldField, [attr]: value }

    fields = filter(fields, (field) => field.name !== newField.name)
    fields.push(newField)
    this.props.actions.updateEditedEntity({fields})
  }

  onFieldSelected (fieldName) {
    this.props.actions.setEditedFieldName(fieldName)
  }

  generateFieldId (actualFields) {
    let nextId = 0
    if (actualFields.length > 0) {
      const field = maxBy(actualFields, (field) => parseInt(field.name.substring(1)))
      nextId = parseInt(field.name.substring(1)) + 1
    }
    return nextId
  }

  resetOrder (fields) {
    for (var i = 0; i < fields.length; i++) {
      fields[i].order = i
    }
  }

  addField (name) {
    const order = this.props.template.fields.length
    const nextId = this.generateFieldId(this.props.template.fields)
    const fieldDef = find(addableFieldList, {name})
    const newField = {
      name: `c${nextId}`,
      type: fieldDef.type,
      order,
      ...fieldDef.defaultAttributes
    }

    const fields = sortBy(this.props.template.fields, (f) => f.order)
    fields.push(newField)
    this.resetOrder(fields)

    this.handleAttributeModified('fields', fields)
    this.props.actions.setEditedFieldName(newField.name)
  }

  onFieldDeleted (event) {
    const newFields = filter(this.props.template.fields, (field) => field.name !== event.target.name)
    this.resetOrder(newFields)
    this.handleAttributeModified('fields', newFields)
  }

  componentWillMount () {
    const id = this.props.params.id || null
    this.props.actions.clearEditedEntity()
    if (id !== 'create') {
      this.props.actions.fetchEditedEntity(id)
    } else {
      const newEntity = {
        name: '',
        fields: []
      }
      this.props.actions.setEditedEntity(newEntity)
    }
  }

  render () {
    const template = this.props.template
    const fields = sortBy(template.fields, (field) => field.order)
    const items = fields.map((field) => <FieldTile key={field.name} field={field} onClick={this.onFieldSelected} onFieldDeleted={this.onFieldDeleted} />)

    return (
      <div>
        <button onClick={this.save}>Enregistrer</button>
        <ContentEditable name="name" value={template.name} onEditEnded={this.handleTemplateAttributeModified} placeholder="Nom du formulaire" />
        <div>
          <div id="fieldSelectList" className="col-md-3">
            <FieldSelector fields={addableFieldList} onAddField={this.addField} />
          </div>

          <div id="fieldList" className="col-md-3" ref='fieldNodes'>
          {
            <ReactCSSTransitionGroup transitionName="deletable"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}>
                {items}
            </ReactCSSTransitionGroup>
          }
          </div>

          <div id="fieldEditor" className="col-md-3">
            <FieldAttributesEditor onChange={this.handleFieldAttributeModified} editedField={this.props.editedField} />
          </div>
        </div>

      </div>
    )
  }
}

EditFormTemplate.propTypes = {
  template: object,
  actions: object.isRequired,
  params: object,
  editedField: object
}

export default connect(mapStateToProps, mapDispatchToProps)(EditFormTemplate)
