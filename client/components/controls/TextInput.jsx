import React from 'react'
const { object, func, string } = React.PropTypes

const TextInput = (props) => {
  const className = props.field.className || ''
  return (
    <div className={'form-group ' + className} >
      <label htmlFor={props.field.name}>{props.field.label}</label>
      <input type={props.field.type} className='form-control' name={props.field.name} value={props.value || ''} onChange={props.onChange} />
    </div>
  )
}

TextInput.propTypes = {
  field: object.isRequired,
  value: string,
  onChange: func
}

export default TextInput
