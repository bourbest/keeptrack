import React from 'react'
import { Button } from 'semantic-ui-react'
import { Field } from 'redux-form'
import {FieldError} from '../../components/forms/FieldError'
import {createTranslate} from '../../../locales/translate'
import FormLabel from '../../components/forms/FormLabel'

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
        <FormLabel>{this.message('choices')}</FormLabel>
        {error && <FieldError locale={locale} error={error} />}
        <table>
          <thead>
            <tr>
              <td>{this.message('fr', 'common')}</td>
              <td>{this.message('en', 'common')}</td>
              <td>{this.message('export-value')}</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {choices.map((choice, index) => {
              const baseFieldName = `choices[${index}]`
              return (
                <tr key={index}>
                  <td>
                    <Field component="input" style={{width: '100px'}} name={`${baseFieldName}.labels.fr`} autoComplete="off" />
                  </td>
                  <td>
                    <Field component="input" style={{width: '100px'}} name={`${baseFieldName}.labels.en`} autoComplete="off" />
                  </td>
                  <td>
                    <Field component="input" style={{width: '50px'}} name={`${baseFieldName}.value`} autoComplete="off" />
                  </td>
                  <td>
                    <Button type='button' data-index={index} onClick={this.handleChoiceDeleted} size="mini">
                      X
                    </Button>
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
  choices: React.PropTypes.array.isRequired,
  locale: React.PropTypes.string.isRequired,
  onChoiceDeleted: React.PropTypes.func.isRequired,
  onAddChoice: React.PropTypes.func.isRequired
}

export default ChoiceListEditor
