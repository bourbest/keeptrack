import React from 'react'
const { object, func, array } = React.PropTypes

class MultipleChoiceList extends React.Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  onChange (event) {
    let newValue = this.props.value || []
    newValue = [].concat(newValue)

    let idx = newValue.indexOf(event.target.value)
    if (idx >= 0) {
      newValue.splice(idx)
    } else {
      newValue.push(event.target.value)
    }

    const newEvent = {
      target: {
        name: event.target.name,
        value: newValue
      }
    }

    this.props.onChange(newEvent)
  }

  render () {
    const field = this.props.field
    const onChange = this.onChange
    const className = field.className || ''
    const selectedValues = this.props.value || []

    return (
      <div>
        <label>{field.label}</label>
        {
          field.choices.map((choice) => {
            return (
              <div className={`form-group checkbox ${className}`} key={choice.value} >
                <label className="custom-control custom-radio">
                  <input name={field.name} type='checkbox' value={choice.value} onChange={onChange} checked={selectedValues.indexOf(choice.value) >= 0} />
                  {choice.label}
                </label>
              </div>
            )
          }
        )}
      </div>
    )
  }
}

MultipleChoiceList.propTypes = {
  field: object.isRequired,
  value: array,
  onChange: func
}

export default MultipleChoiceList
