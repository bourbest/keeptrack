import React from 'react'
const { func, string } = React.PropTypes

const Checkbox = (props) => {
  const className = props.className || ''
  return (
    <div className={'form-group ' + className} >
      <input name={props.name} type='checkbox' value={!props.value} onChange={props.onChange} checked={props.value} />
      <label>{props.label}</label>
    </div>
  )
}

Checkbox.propTypes = {
  className: string,
  name: string.isRequired,
  label: string.isRequired,
  value: string,
  onChange: func
}

export default Checkbox
