import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import {get} from 'lodash'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

// form controls
import { Button, Grid, Container } from 'semantic-ui-react'
import { FormError } from '../components/forms/FormError'
import Toolbar from '../components/Toolbar/Toolbar'
import BackButton from '../components/Toolbar/BackButton'
import ContentEditable from '../components/controls/ContentEditable'

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

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(FormsActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class EditFormTemplate extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.message = createTranslate('formTemplates', this)
    this.handleFieldSelected = this.handleFieldSelected.bind(this)
    this.handleAddChoice = this.handleAddChoice.bind(this)
    this.handleAddField = this.handleAddField.bind(this)
    this.handleControlMoved = this.handleControlMoved.bind(this)
    this.handleAddZone = this.handleAddZone.bind(this)
    this.handleFormNameChanged = this.handleFormNameChanged.bind(this)
  }

  componentWillMount () {
    const id = this.props.params.id || null

    if (id !== 'create') {
      this.props.actions.fetchEditedEntity(id)
    } else {
      const newEntity = FormsSelectors.buildNewEntity()
      this.props.actions.setEditedEntity(newEntity)
      this.props.actions.setEditedFormFields(newEntity.fields)
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
    const {formEntity, controlsById, controlIdsByParentId} = this.props
    const form = FormsSelectors.buildFormReadyForSave(formEntity, controlsById, controlIdsByParentId)

    const isNew = this.props.isNew
    const method = isNew ? this.props.actions.createEntity : this.props.actions.updateEntity
    const notify = this.props.appActions.notify

    method(form, (entity) => {
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

  handleFormNameChanged (event) {
    this.props.actions.setEditedEntityFieldValue('name', event.target.value)
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
          <BackButton backTo='/form-templates' />
          <div className="item section-title">
            <ContentEditable
              onEditEnded={this.handleFormNameChanged}
              value={get(this.props.formEntity, 'name', '')}
              name='name'
            />
          </div>
          <div className="ui secondary right menu">
            <Button loading={submitting} id="saveButton" onClick={this.handleSubmit} disabled={!canSaveEditedEntity}>
              {this.message('save', 'common')}
            </Button>
          </div>
        </Toolbar>
        <FormError error={error} locale={locale} />

        <Container fluid>
          <Grid>
            <Row>
              <div className="computer column left formPanel">
                <FieldSelector />
              </div>
              <div className="computer column center formPanel overflow-y">
                <DynamicForm
                  rootControlIds={rootControlIds}
                  controlsById={controlsById}
                  controlIdsByParentId={controlIdsByParentId}
                  selectedControlId={selectedControlId}
                  controlsErrorsById={controlsErrorsById}
                  locale={locale}
                  onFieldSelected={this.handleFieldSelected}
                  onFieldDeleted={this.props.actions.deleteField}
                  onAddZone={this.handleAddZone}
                />
              </div>
              <div className="computer column right formPanel overflow-y">
                <FieldAttributesEditor
                  locale={locale}
                  editedField={editedField}
                  onPropertiesChanged={this.props.actions.updateFieldProperties}
                  onChoiceDeleted={this.props.actions.deleteChoice}
                  onAddChoice={this.handleAddChoice}
                />
              </div>
            </Row>
          </Grid>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    formEntity: FormsSelectors.getEditedEntity(state),
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

EditFormTemplate.propTypes = {
  formEntity: PropTypes.object,
  rootControlIds: PropTypes.array.isRequired,
  controlIdsByParentId: PropTypes.object.isRequired,
  controlsById: PropTypes.object.isRequired,
  controlsErrorsById: PropTypes.object.isRequired,
  editedField: PropTypes.object,
  nextFieldId: PropTypes.number.isRequired,
  nextChoiceId: PropTypes.number.isRequired,
  locale: PropTypes.string.isRequired,
  isNew: PropTypes.bool.isRequired,
  canSaveEditedEntity: PropTypes.bool.isRequired,

  actions: PropTypes.object.isRequired,
  params: PropTypes.object,

  submitting: PropTypes.bool,
  error: PropTypes.string,
  valid: PropTypes.bool
}

const PageForm = reduxForm({
  form: entityName,
  validate: validateForm
})(EditFormTemplate)

const PageConnected = connect(mapStateToProps, mapDispatchToProps)(PageForm)
export default PageConnected
