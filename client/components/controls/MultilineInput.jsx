import React from 'react'
const { object, func, string } = React.PropTypes

const MultilineInput = (props) => {
  const className = props.field.className || ''
  return (
    <div className={'form-group ' + className} >
      <label htmlFor={props.field.name}>{props.field.label}</label>
      <textarea className='form-control' name={props.field.name} onChange={props.onChange} value={props.value || ''}>
      </textarea>
    </div>
  )
}

MultilineInput.propTypes = {
  field: object.isRequired,
  value: string,
  onChange: func
}

export default MultilineInput
