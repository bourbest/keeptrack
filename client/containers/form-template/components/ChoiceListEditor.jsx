import React from 'react'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { sortBy, map, find, filter, maxBy } from 'lodash'
import ContentEditable from '../../../components/controls/ContentEditable'

const { func, array, bool } = React.PropTypes

class ChoiceListEditor extends React.Component {
  constructor (props) {
    super(props)

    this.onClickRemove = this.onClickRemove.bind(this)
    this.onChoiceLabelChanged = this.onChoiceLabelChanged.bind(this)
    this.onNewChoiceEntered = this.onNewChoiceEntered.bind(this)
    this.onBeginEditLabel = this.onBeginEditLabel.bind(this)

    this.state = {
      editedChoiceKey: null
    }
  }

  onBeginEditLabel (event) {
    this.setState({editedChoiceKey: event.target.name})
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
    }
  }

  onClickRemove (event) {
    const newChoices = filter(this.props.choices, (choice) => choice.value !== event.target.dataset.value)
    this.resetOrder(newChoices)
    this.props.onChoicesChanged(newChoices)
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
      <div className={`form-group editable-choice ${inputType}`} key={choice.value} >
        <input type={inputType} readOnly />
        <ContentEditable name={choice.value} value={choice.label} onEditEnded={this.onChoiceLabelChanged} onEditStarted={this.onBeginEditLabel} />
        {this.state.editedChoiceKey !== choice.value &&
          <i className="fa fa-trash-o" data-value={choice.value} onClick={this.onClickRemove}></i>
        }
      </div>
    ))

    return (
      <div>
        <ReactCSSTransitionGroup transitionName="deletable"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
            {items}
          <div className={`form-group editable-choice ${inputType}`} >
            <input type={inputType} readOnly style={{'paddingLeft': '40px'}} />
            <ContentEditable name="newValue" className="new-choice" placeholder="Nouveau choix" onEditEnded={this.onNewChoiceEntered} resetOnEnter />
          </div>
        </ReactCSSTransitionGroup>

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
