import React from 'react'
import FormLabel from './FormLabel'
import * as SemanticUI from 'semantic-ui-react'

const { object, string, func } = React.PropTypes
const SemanticField = SemanticUI.Form.Field

export default class Checkbox extends React.PureComponent {

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange () {
    this.props.input.onChange(!this.props.input.value)
  }

  render () {
    const { label, input, required, isFieldRequired } = this.props
    const isRequired = required || (isFieldRequired && isFieldRequired(input.name))
    let checkedValue = input.value === true
    return (
      <SemanticField >
        <FormLabel required={isRequired}>{label}</FormLabel>
        <SemanticUI.Checkbox
          checked={checkedValue}
          onChange={this.handleChange}
          name={input.name} />
      </SemanticField>
    )
  }

}
Checkbox.propTypes = {
  input: object.isRequired,
  label: string,
  locale: string,
  meta: object,
  isFieldRequired: func
}
