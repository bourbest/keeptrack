import React from 'react'
import PropTypes from 'prop-types'
import { Field as SemanticField } from '../controls/SemanticControls'

const { object, string } = PropTypes

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
    const classes = checkedValue ? 'checked' : ''
    return (
      <SemanticField >
        <div className={'ui checkbox ' + classes} onClick={this.handleChange}>
          <input type="checkbox" tabIndex="0" className="hidden" checked={checkedValue} />
          <label>{label}</label>
        </div>
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
