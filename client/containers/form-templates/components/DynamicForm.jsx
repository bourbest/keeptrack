import React from 'react'
import PropTypes from 'prop-types'
import config, {CONTROL_CONFIG_BY_TYPE} from '../../../modules/form-templates/config'
import {outputField} from '../../components/forms/DynamicField'
import {Form, Grid, Icon, Column} from '../../components/controls/SemanticControls'
import {reduxForm} from 'redux-form'

const DeleteHandle = (props) => (
  <label corner className="deleteHandle" data-control-id={props.controlId}>
    <Icon name="delete" />
  </label>
)

DeleteHandle.propTypes = {
  controlId: PropTypes.number.isRequired
}

class DynamicForm extends React.PureComponent {
  constructor (props) {
    super(props)
    this.renderControl = this.renderControl.bind(this)
    this.handleControlClicked = this.handleControlClicked.bind(this)
  }

  // ramasse tous les clicks qui surviennent dans le dynamicForm
  // on doit donc distinguer la sélection du delete
  handleControlClicked (event) {
    let el = event.target
    while (el !== null) {
      if (el.getAttribute) {
        const id = el.getAttribute('data-control-id')
        if (id) {
          if (el.classList.contains('deleteHandle')) {
            this.props.onFieldDeleted(id)
          } else {
            this.props.onFieldSelected(id)
          }
          return
        }
      }
      el = el.parentNode
    }
  }

  renderControl (controlId) {
    const {controlsById, locale, controlIdsByParentId, controlsErrorsById} = this.props
    const field = controlsById[controlId]
    const controlConfig = CONTROL_CONFIG_BY_TYPE[field.controlType]

    if (controlConfig.isLayout) {
      const children = controlIdsByParentId[controlId] || []
      const containerClass = field.id === this.props.selectedControlId ? 'selectedForEdit form-zone' : 'form-zone'
      return (
        <Grid key={controlId} columns={field.columnCount} data-control-id={controlId} className={containerClass}>
          <div className="ui top attached" style={{height: '20px'}}>
            <div className="grid-options">
              <Icon name="delete" className="deleteHandle grid-option" data-control-id={controlId} />
            </div>
          </div>
          <div className="accept-drop drag-container" data-control-id={controlId}>
            {children.map(childId => {
              const childClasses = ['draggable']
              if (childId === this.props.selectedControlId) childClasses.push('selectedForEdit')
              if (controlsErrorsById[childId]) childClasses.push('with-error')

              return (
                <Column className={childClasses.join(' ')} key={childId} data-control-id={childId}>
                  <label corner className="deleteHandle" data-control-id={childId}>
                    <Icon name="delete" />
                  </label>
                  {this.renderControl(childId)}
                </Column>
              ) }
            )}
          </div>
        </Grid>
      )
    } else {
      let handlers = {}
      if (field.controlType === 'file') {
        handlers.onFileSelected = (e) => {}
        handlers.onFileSelectError = (e) => {}
      }
      return outputField(field, locale, handlers)
    }
  }

  render () {
    if (!this.props.rootControlIds) return null

    return (
      <Form>
        <Grid columns={1}>
          <div>
            <Column>
              <div className="container" id="0" onClick={this.handleControlClicked}>
                {this.props.rootControlIds.map(this.renderControl)}
              </div>
            </Column>
          </div>
          <div>
            <a href="#" onClick={this.props.onAddZone}>Ajouter une zone</a>
          </div>
        </Grid>
      </Form>
    )
  }
}
DynamicForm.propTypes = {
  rootControlIds: PropTypes.array.isRequired,
  controlIdsByParentId: PropTypes.object.isRequired,
  controlsById: PropTypes.object.isRequired,
  controlsErrorsById: PropTypes.object.isRequired,
  selectedControlId: PropTypes.string,
  locale: PropTypes.string.isRequired,
  onFieldSelected: PropTypes.func.isRequired,
  onFieldDeleted: PropTypes.func.isRequired,
  onAddZone: PropTypes.func.isRequired
}

const DynamicFormConnected = reduxForm({
  form: config.testForm
})(DynamicForm)

export default DynamicFormConnected
