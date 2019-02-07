import React from 'react'
import PropTypes from 'prop-types'
import {chunk} from 'lodash'
import {outputField} from '../../components/GenericForm/DynamicField'

class DocumentDynamicForm extends React.PureComponent {
  constructor (props) {
    super(props)
    this.renderControl = this.renderControl.bind(this)
  }

  renderControl (controlId) {
    const {controlsById, locale, controlIdsByParentId} = this.props
    const field = controlsById[controlId]

    if (field.controlType === 'grid') {
      const children = controlIdsByParentId[controlId] || []
      const rows = chunk(children, field.columnCount)
      return (
        <div key={controlId} className="form-zone">
          {rows.map((row, index) => (
            <div className="row" key={index}>
              {row.map((fieldId) => (
                <div className="col" key={fieldId}>{this.renderControl(fieldId)}</div>
              ))}
            </div>
          ))}
        </div>
      )
    } else {
      return outputField(field, locale, this.props.handlers)
    }
  }

  render () {
    const rootControls = this.props.controlIdsByParentId['c0']
    if (!rootControls) return null

    return (
      <div>
        {rootControls.map(this.renderControl)}
      </div>
    )
  }
}
DocumentDynamicForm.propTypes = {
  controlIdsByParentId: PropTypes.object.isRequired,
  controlsById: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
}

export default DocumentDynamicForm
