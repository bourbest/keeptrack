import React from 'react'
import PropTypes from 'prop-types'
import config, {CONTROL_CONFIG_BY_TYPE} from '../../../modules/form-templates/config'
import {outputField} from '../../components/GenericForm/DynamicField'
import {Icon, Column} from '../../components/controls/SemanticControls'
import {reduxForm} from 'redux-form'
import {some, last} from 'lodash'

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
          if (el.classList.contains('deleteFieldButton') || el.classList.contains('deleteSectionButton')) {
            this.props.onFieldDeleted(id)
          } else if (el.classList.contains('moveup')) {
            this.props.onMoveSection(id, -1)
          } else if (el.classList.contains('movedown')) {
            this.props.onMoveSection(id, 1)
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
      const lastSectionId = last(controlIdsByParentId['c0'])
      const firstSectionId = controlIdsByParentId['c0'][0]
      const children = controlIdsByParentId[controlId] || []
      const containerClass = field.id === this.props.selectedControlId ? 'selectedForEdit form-zone' : 'form-zone'
      const dragClasses = 'accept-drop drag-container d-flex flex-wrap'
      const preventDeleteLayout = some(children, childId => controlsById[childId].isSystem)
      return (
        <div key={controlId} data-control-id={controlId} className={containerClass}>
          <div className="grid-toolbar">
            <span>Section</span>
            {!preventDeleteLayout &&
              <button type="button" name="delete" className="close deleteSectionButton float-right" data-control-id={controlId}>
                &times;
              </button>
            }
            {field.id !== firstSectionId && (
              <Icon name="up-open" className="moveup float-right clickable" data-control-id={controlId} />
            )}
            {field.id !== lastSectionId && (
              <Icon name="down-open" className="movedown float-right clickable" data-control-id={controlId} />
            )}
          </div>
          <div className="form-zone-inner">
            <div className={dragClasses} data-control-id={controlId}>
              {children.map(childId => {
                const childClasses = ['field-tile']
                if (!controlsById[childId].isSystem) childClasses.push('draggable')
                if (childId === this.props.selectedControlId) childClasses.push('selectedForEdit')
                if (controlsErrorsById[childId]) childClasses.push('with-error')

                const childField = controlsById[childId]
                return (
                  <Column columns={12 / field.columnCount} className={childClasses.join(' ')} key={childId} data-control-id={childId}>
                    {!childField.isSystem &&
                      <div className="top-corner-triangle deleteFieldButton" data-control-id={childId}>
                        <button type="button" className="close deleteButton">
                          &times;
                        </button>
                      </div>
                    }
                    {this.renderControl(childId)}
                  </Column>
                ) }
              )}
            </div>
          </div>
        </div>
      )
    } else {
      return outputField(field, locale)
    }
  }

  render () {
    if (!this.props.rootControlIds) return null

    return (
      <form>
        <div id="c0" onClick={this.handleControlClicked}>
          {this.props.rootControlIds.map(this.renderControl)}
        </div>
      </form>
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
  onMoveSection: PropTypes.func.isRequired
}

const DynamicFormConnected = reduxForm({
  form: config.testForm
})(DynamicForm)

export default DynamicFormConnected
