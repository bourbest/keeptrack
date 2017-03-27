import React from 'react'
const { func, string, bool, oneOfType } = React.PropTypes

const Checkbox = (props) => {
  const className = props.className || ''
  const value = (props.value === 'true' || props.value === true)
  return (
    <div className={'form-group ' + className} >
      <input name={props.name} type='checkbox' value={!value} onChange={props.onChange} checked={value} />
      <label>{props.label}</label>
    </div>
  )
}

Checkbox.propTypes = {
  className: string,
  name: string.isRequired,
  label: string.isRequired,
  value: oneOfType([string, bool]),
  onChange: func
}

export default Checkbox
