import React from 'react'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { sortBy, map, find, filter, maxBy } from 'lodash'

const { func, array, bool } = React.PropTypes

class ChoiceListEditor extends React.Component {
  constructor (props) {
    super(props)

    this.onClickRemove = this.onClickRemove.bind(this)
    this.onChoiceLabelChanged = this.onChoiceLabelChanged.bind(this)
    this.onNewChoiceEntered = this.onNewChoiceEntered.bind(this)

    this.onKeyDown = this.onKeyDown.bind(this)
  }

  generateChoiceId (actualChoices) {
    let nextId = 0
    if (actualChoices.length > 0) {
      const choice = maxBy(actualChoices, (choice) => parseInt(choice.value.substring(1)))
      nextId = parseInt(choice.value.substring(1)) + 1
    }
    return nextId
  }

  onChoiceLabelChanged (event) {
    const choiceKey = event.target.name
    const newValue = event.target.value

    const newChoices = filter(this.props.choices, (choice) => choice.value !== choiceKey)

    if (newValue !== '') {
      const oldChoice = find(this.props.choices, {value: choiceKey})
      const newChoice = {...oldChoice, value: choiceKey, label: newValue}
      newChoices.push(newChoice)
    }

    this.props.onChoicesChanged(newChoices)
    this.setState({editedChoiceKey: null})
  }

  onNewChoiceEntered (event) {
    if (event.target.value !== '') {
      const newChoice = {
        value: `c${this.generateChoiceId(this.props.choices)}`,
        label: event.target.value
      }
      const newChoices = sortBy(this.props.choices, (choice) => choice.order)
      newChoices.push(newChoice)

      this.resetOrder(newChoices)
      this.props.onChoicesChanged(newChoices)
      event.target.value = ''
      event.target.focus()
    }
  }

  onClickRemove (event) {
    const newChoices = filter(this.props.choices, (choice) => choice.value !== event.target.dataset.value)
    this.resetOrder(newChoices)
    this.props.onChoicesChanged(newChoices)
  }

  onKeyDown (e) {
    const key = e.keyCode || e.charCode  // ie||others

    if (key === 13) {
      this.refs.input.blur()
    }
  }

  resetOrder (choices) {
    for (var i = 0; i < choices.length; i++) {
      choices[i].order = i
    }
  }

  render () {
    const orderedChoices = sortBy(this.props.choices, (choice) => choice.order)
    const inputType = this.props.allowMultipleChoices ? 'checkbox' : 'radio'

    const items = map(orderedChoices, (choice) => (
      <div className={`form-group ${inputType}`} key={choice.value} >
        <i className="fa fa-trash-o" data-value={choice.value} onClick={this.onClickRemove}></i>
        <input name={choice.value} className="form-control editable-choice" value={choice.label} onChange={this.onChoiceLabelChanged} />
      </div>
    ))

    return (
      <div>
        <span>Choix</span>
        <div className="form-inline">
          <ReactCSSTransitionGroup transitionName="deletable"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
              {items}

            <div className="form-group text" >
              <input name="newValue" className="form-control" placeholder="Nouveau choix"
                onBlur={this.onNewChoiceEntered}
                onKeyDown={this.onKeyDown}
                ref="input"
              />
            </div>
          </ReactCSSTransitionGroup>
        </div>
      </div>
    )
  }
}

ChoiceListEditor.propTypes = {
  onChoicesChanged: func.isRequired,
  choices: array.isRequired,
  allowMultipleChoices: bool.isRequired
}

export default ChoiceListEditor
