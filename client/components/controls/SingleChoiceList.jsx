import React from 'react'
const { object, func, string, oneOfType, number } = React.PropTypes

const SingleChoiceList = (props) => {
  const field = props.field
  const className = field.className || ''
  return (
    <div>
      <label>{field.label}</label>
      {
        field.choices.map((choice) => {
          return (
            <div className={`form-group radio ${className}`} key={choice.value} >
              <label className="custom-control custom-radio">
                <input name={field.name} type='radio' value={choice.value} onChange={props.onChange} checked={props.value === choice.value} />
                {choice.label}
              </label>
            </div>
          )
        }
      )}
    </div>
  )
}

SingleChoiceList.propTypes = {
  field: object.isRequired,
  value: oneOfType([string, number]),
  onChange: func
}

export default SingleChoiceList
