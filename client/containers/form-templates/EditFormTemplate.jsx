import React from 'react'
import { browserHistory } from 'react-router'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

// form controls
import { Button, Grid, Container } from 'semantic-ui-react'
import { FormError } from '../components/forms/FormError'
import Toolbar from '../components/Toolbar'

// actions and selectors
import { ActionCreators as FormsActions } from '../../modules/form-templates/actions'
import { ActionCreators as AppActions } from '../../modules/app/actions'
import FormsSelectors from '../../modules/form-templates/selectors'
import { getLocale } from '../../modules/app/selectors'
import {createTranslate} from '../../locales/translate'

// module stuff
import validateForm from '../../modules/form-templates/validate'
import entityConfig from '../../modules/form-templates/config'
const {entityName} = entityConfig

// components
import FieldSelector from './components/FieldSelector'
import FieldAttributesEditor from './components/FieldAttributesEditor'
import DynamicForm from './components/DynamicForm'
const Row = Grid.Row
const Col = Grid.Column

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(FormsActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class EditFormPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.message = createTranslate('edit-form', this)
    this.handleFieldSelected = this.handleFieldSelected.bind(this)
    this.handleAddChoice = this.handleAddChoice.bind(this)
    this.handleAddField = this.handleAddField.bind(this)
    this.handleControlMoved = this.handleControlMoved.bind(this)
    this.handleAddZone = this.handleAddZone.bind(this)
  }

  componentWillMount () {
    const id = this.props.params.id || null

    if (id !== 'create') {
      this.props.actions.fetchEditedEntity(parseInt(id), {catalogId: this.props.catalogId})
    } else {
      const newEntity = FormsSelectors.buildNewEntity(this.props.catalogId)
      this.props.actions.setEditedEntity(newEntity)
    }
  }

  componentDidMount () {
    const options = {
      isContainer: function (el, source, handle, sibling) {
        return el.classList.contains('drag-container')
      },
      moves: function (el, source, handle, sibling) {
        return el.classList.contains('draggable')
      },
      accepts: function (el, target) {
        return target.classList.contains('accept-drop')
      },
      copy: function (el, source) {
        return source.id === 'newControls'
      },
      revertOnSpill: true
    }
    this.dragula = window.dragula(options)
    this.dragula.on('drop', this.handleControlMoved)
  }

  componentWillUnmount () {
    if (this.dragula) {
      this.dragula.destroy()
    }
  }

  handleSubmit () {
    const isNew = this.props.isNew
    const method = isNew ? this.props.actions.createEntity : this.props.actions.updateEntity
    const notify = this.props.appActions.notify

    method(this.props.attribute, {catalogId: this.props.catalogId}, (entity) => {
      if (isNew) {
        browserHistory.replace('/form-templates/' + entity.id)
      }
      browserHistory.push('/form-templates')
      notify('common.save', 'common.saved')
    })
  }

  handleControlMoved (el, target, source, sibling) {
    const sourceParentId = source.id === 'newControls' ? null : parseInt(source.getAttribute('data-control-id'))
    const targetParentId = parseInt(target.getAttribute('data-control-id'))
    const beforeSiblingId = sibling ? parseInt(sibling.getAttribute('data-control-id')) : null

    // la lib bouge les tag et React pète parce qu'il essaie d'enlever les Node qui ont été bougées
    // cancel(true) revert les modifications apportées dans le DOM. On update le state juste après
    // so react va render les champs aux bons endroits et dans le bon ordre
    this.dragula.cancel(true)

    if (sourceParentId !== null) {
      const fieldId = parseInt(el.getAttribute('data-control-id'))
      this.props.actions.moveField(fieldId, sourceParentId, targetParentId, beforeSiblingId)
    } else {
      const type = el.id
      this.handleAddField(type, targetParentId, beforeSiblingId)
    }
  }

  handleAddZone (event) {
    event.preventDefault()
    this.handleAddField('grid', 0, null) // add a grid at the end of root container
  }

  handleFieldSelected (fieldId) {
    const field = this.props.controlsById[fieldId]
    this.props.actions.setEditedField(field)
  }

  handleAddField (controlType, parentId, beforeSiblingId) {
    const field = FormsSelectors.buildNewField(controlType, this.props.nextFieldId)
    this.props.actions.addField(field, parentId, beforeSiblingId)
  }

  handleAddChoice () {
    const choice = FormsSelectors.buildNewChoice(this.props.nextChoiceId)
    this.props.actions.addChoice(choice)
  }

  render () {
    const {error, locale, rootControlIds, controlIdsByParentId, controlsById, controlsErrorsById, editedField} = this.props
    const {canSaveEditedEntity, submitting} = this.props

    if (!this.props.rootControlIds) return null

    const selectedControlId = editedField ? editedField.id : null

    let titleLabelKey = 'create-title'
    if (this.props.form.id) {
      titleLabelKey = 'edit-title'
    }

    return (
      <div>
        <Toolbar title={this.message(titleLabelKey)} backTo="/form-templates">
          <Button loading={submitting} id="saveButton" onClick={this.handleSubmit} disabled={!canSaveEditedEntity}>
            {this.message('save', 'common')}
          </Button>
        </Toolbar>
        <FormError error={error} locale={locale} />

        <Container fluid>
          <Grid>
            <Row>
              <Col computer="3">
                <FieldSelector />
              </Col>
              <Col computer="8">
                <DynamicForm
                  rootControlIds={rootControlIds}
                  controlsById={controlsById}
                  controlIdsByParentId={controlIdsByParentId}
                  selectedControlId={selectedControlId}
                  controlsErrorsById={controlsErrorsById}
                  locale={locale}
                  onFieldSelected={this.handleFieldSelected}
                  onFieldDeleted={this.props.actions.deleteField}
                />
                <a href="#" onClick={this.handleAddZone}>{this.message('addZone')}</a>
              </Col>
              <Col computer="5">
                <FieldAttributesEditor
                  locale={locale}
                  editedField={editedField}
                  onPropertiesChanged={this.props.actions.updateFieldProperties}
                  onChoiceDeleted={this.props.actions.deleteChoice}
                  onAddChoice={this.handleAddChoice}
                />
              </Col>
            </Row>
          </Grid>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    rootControlIds: FormsSelectors.getOrderedRootControlIds(state),
    controlIdsByParentId: FormsSelectors.getControlIdsByParentId(state),
    controlsById: FormsSelectors.getControls(state),
    controlsErrorsById: FormsSelectors.getNodeErrors(state),
    editedField: FormsSelectors.getEditedField(state),
    nextFieldId: FormsSelectors.getNextNodeId(state),
    nextChoiceId: FormsSelectors.getNextChoiceId(state),
    locale: getLocale(state),
    isNew: FormsSelectors.isNewEntity(state),
    canSaveEditedEntity: true
  }
}

EditFormPage.propTypes = {
  rootControlIds: React.PropTypes.array.isRequired,
  controlIdsByParentId: React.PropTypes.object.isRequired,
  controlsById: React.PropTypes.object.isRequired,
  controlsErrorsById: React.PropTypes.object.isRequired,
  editedField: React.PropTypes.object,
  nextFieldId: React.PropTypes.number.isRequired,
  nextChoiceId: React.PropTypes.number.isRequired,
  locale: React.PropTypes.string.isRequired,
  isNew: React.PropTypes.bool.isRequired,
  canSaveEditedEntity: React.PropTypes.bool.isRequired,

  actions: React.PropTypes.object.isRequired,
  params: React.PropTypes.object,

  submitting: React.PropTypes.bool,
  error: React.PropTypes.string,
  valid: React.PropTypes.bool
}

const PageForm = reduxForm({
  form: entityName,
  validate: validateForm
})(EditFormPage)

const PageConnected = connect(mapStateToProps, mapDispatchToProps)(PageForm)
export default PageConnected
