import React from 'react'

import GenericForm from '../../../components/GenericForm'
import ChoiceListEditor from './ChoiceListEditor'

const { func, object } = React.PropTypes

const commonAttributes = [
  {
    name: 'label',
    type: 'text',
    isRequired: true,
    label: 'Libellé'
  },
  {
    name: 'isRequired',
    type: 'checkbox',
    label: 'Champ obligatoire'
  }
]

class FieldAttributesEditor extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.onListChanged = this.onListChanged.bind(this)
  }

  handleChange (event) {
    this.props.onChange(event.target.name, event.target.value)
  }

  onListChanged (newValue) {
    this.props.onChange('choices', newValue)
  }

  render () {
    if (!this.props.editedField) {
      return null
    }

    const editedField = this.props.editedField
    const isChoices = editedField.type === 'choices'

    return (
      <div>
        <GenericForm fields={commonAttributes} values={editedField} onChange={this.handleChange} />
        {isChoices &&
          <ChoiceListEditor choices={editedField.choices} onChoicesChanged={this.onListChanged} allowMultipleChoices={editedField.allowMultipleChoices} />
        }
      </div>
    )
  }
}

FieldAttributesEditor.propTypes = {
  onChange: func.isRequired,
  editedField: object
}

export default FieldAttributesEditor
