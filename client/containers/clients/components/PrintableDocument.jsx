import React from 'react'
import PropTypes from 'prop-types'
import {chunk, find, forEach} from 'lodash'
import {formatDate} from '../../../services/string-utils'

class PrintableDocument extends React.PureComponent {
  constructor (props) {
    super(props)
    this.renderControl = this.renderControl.bind(this)
    this.outputField = this.outputField.bind(this)
  }

  outputField (field, locale) {
    let value = this.props.document.values[field.id]
    let labelSuffix = ''

    if (field.choices) {
      if (field.controlType === 'checkbox-list') {
        const valuesLabel = []
        forEach(value, val => {
          const selectedOption = find(field.choices, {id: val})
          valuesLabel.push(selectedOption.labels[locale])
        })
        value = valuesLabel.join(', ')
      } else {
        const selectedOption = find(field.choices, {id: value})
        if (selectedOption) {
          value = selectedOption.labels[locale]
        } else {
          value = ''
        }
      }
    }

    if (field.controlType === 'checkbox') {
      value = value ? 'Oui' : 'Non'
      labelSuffix = ':'
    }

    if (field.controlType === 'date') {
      value = formatDate(value)
    }

    const classes = field.controlType === 'textarea' || field.controlType === 'rich-text'
      ? 'rendered-quill' : 'pl-2 d-inline'

    return (
      <div>
        <label><b>{field.labels[locale]} {labelSuffix}</b></label>
        <div className={classes} dangerouslySetInnerHTML={{__html: value}} />
      </div>
    )
  }

  renderControl (controlId) {
    const {controlsById, locale, controlIdsByParentId} = this.props
    const field = controlsById[controlId]

    if (field.controlType === 'grid') {
      const children = controlIdsByParentId[controlId] || []
      const rows = chunk(children, field.columnCount)
      return (
        <div key={controlId}>
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
      return this.outputField(field, locale)
    }
  }

  render () {
    const {documentDate} = this.props.document
    const formName = this.props.formTemplate.name
    const rootControls = this.props.controlIdsByParentId['c0']
    if (!rootControls) return null

    return (
      <div>
        <h3>{formName} - {formatDate(documentDate)}</h3>
        <br />
        {rootControls.map(this.renderControl)}
      </div>
    )
  }
}

PrintableDocument.propTypes = {
  controlIdsByParentId: PropTypes.object.isRequired,
  controlsById: PropTypes.object.isRequired,
  document: PropTypes.object.isRequired,
  formTemplate: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
}

export default PrintableDocument
