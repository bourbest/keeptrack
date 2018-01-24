import React from 'react'

import DatePicker from 'react-datepicker'
import ContentEditable from '../../../components/controls/ContentEditable'
import ChoiceListEditor from './ChoiceListEditor'

const { func, object } = React.PropTypes

class InlineFieldEditor extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.onListChanged = this.onListChanged.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.onLabelEditStart = this.onLabelEditStart.bind(this)

    this.state = {
      isEditingLabel: false
    }
  }

  handleChange (event) {
    this.props.onFieldChanged(this.props.field.name, event.target.name, event.target.value)
    if (event.target.name === 'label') {
      this.setState({isEditingLabel: false})
    }
  }

  onLabelEditStart () {
    this.setState({isEditingLabel: true})
  }

  onListChanged (newValue) {
    this.props.onFieldChanged(this.props.field.name, 'choices', newValue)
  }

  handleClickDelete () {
    const evt = {
      target: {
        name: this.props.field.name
      }
    }

    this.props.onFieldDeleted(evt)
  }

  render () {
    const field = this.props.field
    return (
      <div className="form-group inline-editable-control">
        <label>
          <ContentEditable name="label" value={field.label} onEditEnded={this.handleChange} onEditStarted={this.onLabelEditStart} />
          {!this.state.isEditingLabel &&
            <i className="fa fa-trash-o" onClick={this.handleClickDelete}></i>
          }
        </label>
        {field.type === 'text' && <input type="text" className='form-control' />}
        {field.type === 'textarea' && <textarea name={field.name} className='form-control'></textarea>}
        {field.type === 'choices' && <ChoiceListEditor choices={field.choices} onChoicesChanged={this.onListChanged} allowMultipleChoices={field.allowMultipleChoices} />}
        {field.type === 'date' && <span className='clearfix'><DatePicker /></span>}
      </div>
    )
  }
}

InlineFieldEditor.propTypes = {
  onFieldChanged: func.isRequired,
  onFieldDeleted: func.isRequired,
  field: object.isRequired
}

export default InlineFieldEditor
