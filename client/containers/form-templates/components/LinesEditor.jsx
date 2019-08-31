import React from 'react'
import {some} from 'lodash'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import {FieldError, Input, FieldWrapper, Checkbox} from '../../components/forms'
import {createTranslate} from '../../../locales/translate'

class LinesEditor extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('form-field-editor', this)
    this.handleToggleShowArchived = this.handleToggleShowArchived.bind(this)
    this.handleAddLine = this.handleAddLine.bind(this)
  }

  handleAddLine (event) {
    event.preventDefault()
    this.props.onAddColumn()
  }

  handleToggleShowArchived (event) {
    event.preventDefault()
    this.props.onToggleShowArchived()
  }

  render () {
    const {lines, meta: {error}, locale, showArchivedLines} = this.props

    return (
      <div>
        <h4>{this.message('lines')}</h4>
        {error && <FieldError locale={locale} error={error} />}
        <table>
          <thead>
            <tr>
              <td>{this.message('fr', 'common')}</td>
              <td>{this.message('archived')}</td>
            </tr>
          </thead>
          <tbody>
            {lines.map((column, index) => {
              // skip rendering of archived lines. Cannot filter list since redux form uses the index in the array for the update mapping
              if (column.isArchived && !showArchivedLines) return null

              const baseFieldName = `lines[${index}]`
              return (
                <tr key={index}>
                  <td>
                    <div className="d-flex justify-content-start">
                      <Field component={FieldWrapper} InputControl={Input} style={{width: '200px'}} name={`${baseFieldName}.label`} locale={locale} autoComplete="off" />
                    </div>
                  </td>
                  <td className="d-flex justify-content-end">
                    <Field component={FieldWrapper} InputControl={Checkbox} style={{width: '50px'}} name={`${baseFieldName}.isArchived`} locale={locale} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <a href="#" onClick={this.handleAddLine}>{this.message('addLine')}</a>
        <br />
        {some(lines, {isArchived: true}) &&
          <a href="#" onClick={this.handleToggleShowArchived}>
            {showArchivedLines ? this.message('hideArchived') : this.message('showArchived')}
          </a>
        }
      </div>
    )
  }
}

LinesEditor.propTypes = {
  lines: PropTypes.array.isRequired,
  locale: PropTypes.string.isRequired,
  onAddColumn: PropTypes.func.isRequired,
  onToggleShowArchived: PropTypes.func.isRequired,
  showArchivedLines: PropTypes.bool
}

export default LinesEditor
