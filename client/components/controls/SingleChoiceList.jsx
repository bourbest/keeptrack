import React from 'react'
const { func, array, string, oneOfType, number } = React.PropTypes

const SingleChoiceList = (props) => {
  const className = props.className || ''
  return (
    <div>
      <label>{props.label}</label>
      {
        props.choices.map((choice) => {
          return (
            <div className={`form-group radio ${className}`} key={choice.value} >
              <label className="custom-control custom-radio">
                <input name={props.name} type='radio' value={choice.value} onChange={props.onChange} checked={props.value === choice.value} />
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
  className: string,
  name: string.isRequired,
  label: string.isRequired,
  choices: array.isRequired,
  value: oneOfType([string, number]),
  onChange: func
}

export default SingleChoiceList
