import React from 'react'
import {some} from 'lodash'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import {FieldError, Input, FieldWrapper, Checkbox} from '../../components/forms'
import {createTranslate} from '../../../locales/translate'

class ColumnsEditor extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('form-field-editor', this)
    this.handleToggleShowArchived = this.handleToggleShowArchived.bind(this)
    this.handleAddColumn = this.handleAddColumn.bind(this)
  }

  handleAddColumn (event) {
    event.preventDefault()
    this.props.onAddColumn()
  }

  handleToggleShowArchived (event) {
    event.preventDefault()
    this.props.onToggleShowArchived()
  }

  render () {
    const {columns, meta: {error}, locale, showArchivedColumns} = this.props

    return (
      <div>
        <h4>{this.message('columns')}</h4>
        {error && <FieldError locale={locale} error={error} />}
        <table>
          <thead>
            <tr>
              <td>{this.message('fr', 'common')}</td>
              <td>{this.message('largeur', 'common')}</td>
              <td>{this.message('archived')}</td>
            </tr>
          </thead>
          <tbody>
            {columns.map((column, index) => {
              // skip rendering of archived column. Cannot filter list since redux form uses the index in the array for the update mapping
              if (column.isArchived && !showArchivedColumns) return null

              const baseFieldName = `columns[${index}]`
              return (
                <tr key={index}>
                  <td>
                    <div className="d-flex justify-content-start">
                      <Field component={FieldWrapper} InputControl={Input} style={{width: '150px'}} name={`${baseFieldName}.label`} locale={locale} autoComplete="off" />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-start">
                      <Field component={FieldWrapper} InputControl={Input} style={{width: '50px'}} name={`${baseFieldName}.width`} locale={locale} autoComplete="off" />
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
        <a href="#" onClick={this.handleAddColumn}>{this.message('addColumn')}</a>
        <br />
        {some(columns, {isArchived: true}) &&
          <a href="#" onClick={this.handleToggleShowArchived}>
            {showArchivedColumns ? this.message('hideArchived') : this.message('showArchived')}
          </a>
        }
      </div>
    )
  }
}

ColumnsEditor.propTypes = {
  columns: PropTypes.array.isRequired,
  locale: PropTypes.string.isRequired,
  onAddColumn: PropTypes.func.isRequired,
  onToggleShowArchived: PropTypes.func.isRequired,
  showArchivedColumns: PropTypes.bool
}

export default ColumnsEditor
