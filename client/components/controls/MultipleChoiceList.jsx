import React from 'react'
const { string, func, array } = React.PropTypes

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
    const props = this.props
    const onChange = this.onChange
    const className = props.className || ''
    const selectedValues = props.value || []
    const selectedItemIds = new Set(selectedValues)
    return (
      <div>
        <label>{props.label}</label>
        {
          props.choices.map((choice) => {
            return (
              <div className={`form-group checkbox ${className}`} key={choice.value} >
                <label className="custom-control custom-radio">
                  <input name={props.name} type='checkbox' value={choice.value} onChange={onChange} checked={selectedItemIds.has(choice.value)} />
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
  className: string,
  name: string.isRequired,
  label: string.isRequired,
  choices: array.isRequired,
  value: array,
  onChange: func
}

export default MultipleChoiceList
