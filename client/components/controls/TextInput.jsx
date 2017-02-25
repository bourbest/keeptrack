import React from 'react'
const { func, string } = React.PropTypes

const TextInput = (props) => {
  const className = props.className || ''
  return (
    <div className={'form-group ' + className} >
      <label htmlFor={props.name}>{props.label}</label>
      <input type={props.type} className='form-control' name={props.name} value={props.value || ''} onChange={props.onChange} placeholder={props.placeholder} />
    </div>
  )
}

TextInput.propTypes = {
  className: string,
  name: string.isRequired,
  placeholder: string,
  label: string,
  type: string,
  value: string,
  onChange: func
}

TextInput.defaultProps = {
  type: 'text'
}

export default TextInput
