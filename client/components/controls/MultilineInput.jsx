import React from 'react'
const { func, string } = React.PropTypes

const MultilineInput = (props) => {
  const className = props.className || ''
  return (
    <div className={'form-group ' + className} >
      <label htmlFor={props.name}>{props.label}</label>
      <textarea className='form-control' name={props.name} onChange={props.onChange} value={props.value || ''}>
      </textarea>
    </div>
  )
}

MultilineInput.propTypes = {
  className: string,
  name: string.isRequired,
  label: string.isRequired,
  value: string,
  onChange: func
}

export default MultilineInput
