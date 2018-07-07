import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../../components/controls/SemanticControls'
import { Field } from 'redux-form'
import {FieldError, Input, FieldWrapper} from '../../components/forms'
import {createTranslate} from '../../../locales/translate'

class ChoiceListEditor extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('form-field-editor', this)
    this.handleChoiceDeleted = this.handleChoiceDeleted.bind(this)
    this.handleAddChoice = this.handleAddChoice.bind(this)
  }

  handleChoiceDeleted (event) {
    const indexToRemove = event.target.attributes.getNamedItem('data-index').value
    this.props.onChoiceDeleted(parseInt(indexToRemove))
  }

  handleAddChoice (event) {
    event.preventDefault()
    this.props.onAddChoice()
  }

  render () {
    const {choices, meta: {error}, locale} = this.props
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
              <td />
            </tr>
          </thead>
          <tbody>
            {choices.map((choice, index) => {
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
                      <Field component={FieldWrapper} InputControl={Input} style={{width: '50px'}} name={`${baseFieldName}.value`} locale={locale} autoComplete="off" />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-start mb-3">
                      <Button type='button' data-index={index} onClick={this.handleChoiceDeleted}>
                        X
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <a href="#" onClick={this.handleAddChoice}>{this.message('addChoice')}</a>
      </div>
    )
  }
}

ChoiceListEditor.propTypes = {
  choices: PropTypes.array.isRequired,
  locale: PropTypes.string.isRequired,
  onChoiceDeleted: PropTypes.func.isRequired,
  onAddChoice: PropTypes.func.isRequired
}

export default ChoiceListEditor
