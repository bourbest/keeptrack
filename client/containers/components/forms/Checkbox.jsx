import React from 'react'
import * as SemanticUI from 'semantic-ui-react'

const { object, string } = React.PropTypes
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
    const { label, input } = this.props
    let checkedValue = input.value === true
    return (
      <SemanticField >
        <SemanticUI.Checkbox
          checked={checkedValue}
          onChange={this.handleChange}
          label={label}
          name={input.name} />
      </SemanticField>
    )
  }
}

Checkbox.propTypes = {
  input: object.isRequired,
  label: string,
  locale: string,
  meta: object
}