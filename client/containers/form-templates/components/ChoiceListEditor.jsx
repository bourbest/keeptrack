import React from 'react'
import {some} from 'lodash'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import {FieldError, Input, FieldWrapper, Checkbox} from '../../components/forms'
import {createTranslate} from '../../../locales/translate'

class ChoiceListEditor extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('form-field-editor', this)
    this.handleToggleShowArchived = this.handleToggleShowArchived.bind(this)
    this.handleAddChoice = this.handleAddChoice.bind(this)
  }

  handleAddChoice (event) {
    event.preventDefault()
    this.props.onAddChoice()
  }

  handleToggleShowArchived (event) {
    event.preventDefault()
    this.props.onToggleShowArchived()
  }

  render () {
    const {choices, meta: {error}, locale, lockChoiceValues, showArchivedChoices} = this.props

    return (
      <div>
        <h4>{this.message('choices')}</h4>
        {error && <FieldError locale={locale} error={error} />}
        <table>
          <thead>
            <tr>
              <td>{this.message('fr', 'common')}</td>
              <td>{this.message('en', 'common')}</td>
              <td>{this.message('export-value')}</td>
              <td>{lockChoiceValues ? '' : this.message('archived')}</td>
            </tr>
          </thead>
          <tbody>
            {choices.map((choice, index) => {
              // skip rendering of archived choices. Cannot filter list since redux form uses the index in the array for the update mapping
              if (choice.isArchived && !showArchivedChoices) return null

              const baseFieldName = `choices[${index}]`
              return (
                <tr key={index}>
                  <td>
                    <div className="d-flex justify-content-start">
                      <Field component={FieldWrapper} InputControl={Input} style={{width: '100px'}} name={`${baseFieldName}.labels.fr`} locale={locale} autoComplete="off" />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-start">
                      <Field component={FieldWrapper} InputControl={Input} style={{width: '100px'}} name={`${baseFieldName}.labels.en`} locale={locale} autoComplete="off" />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-start">
                      <Field component={FieldWrapper} InputControl={Input} style={{width: '50px'}} name={`${baseFieldName}.value`}
                        locale={locale} autoComplete="off" readOnly={lockChoiceValues} />
                    </div>
                  </td>
                  <td>
                    {!lockChoiceValues &&
                      <Field component={FieldWrapper} InputControl={Checkbox} style={{width: '50px'}} name={`${baseFieldName}.isArchived`}
                        locale={locale} />
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!lockChoiceValues && <a href="#" onClick={this.handleAddChoice}>{this.message('addChoice')}</a>}
        <br />
        {some(choices, {isArchived: true}) &&
          <a href="#" onClick={this.handleToggleShowArchived}>
            {showArchivedChoices ? this.message('hideArchived') : this.message('showArchived')}
          </a>
        }
      </div>
    )
  }
}

ChoiceListEditor.propTypes = {
  choices: PropTypes.array.isRequired,
  locale: PropTypes.string.isRequired,
  onAddChoice: PropTypes.func.isRequired,
  onToggleShowArchived: PropTypes.func.isRequired,
  lockChoiceValues: PropTypes.bool,
  showArchivedChoices: PropTypes.bool
}

export default ChoiceListEditor
