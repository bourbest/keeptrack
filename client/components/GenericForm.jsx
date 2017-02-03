import React from 'react'
import TextInput from './controls/TextInput'
import SingleChoiceList from './controls/SingleChoiceList'
import MultipleChoiceList from './controls/MultipleChoiceList'
import MultilineInput from './controls/MultilineInput'
const { object, func, array } = React.PropTypes

class GenericForm extends React.Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.props.onValueChanged(event.target.name, event.target.value)
  }

  render () {
    const values = this.props.values
    const cbChange = this.handleChange
    const fields = this.props.fields.map((field) => {
      let control = null
      switch (field.type) {
        case 'text':
        case 'password':
          if (field.multiline) {
            control = <MultilineInput field={field} onChange={cbChange} value={values[field.name]} key={field.name} />
          } else {
            control = <TextInput field={field} onChange={cbChange} value={values[field.name]} key={field.name} />
          }
          break

        case 'choices':
          if (field.allowMultiple) {
            control = <MultipleChoiceList field={field} onChange={cbChange} value={values[field.name]} key={field.name} />
          } else {
            control = <SingleChoiceList field={field} onChange={cbChange} value={values[field.name]} key={field.name} />
          }
          break

        default:
          throw new Error(`Invalid control type ${field.type}`)
      }
      return control
    })

    return (
      <div>
        {fields}
      </div>
    )
  }
}

GenericForm.propTypes = {
  fields: array.isRequired,
  values: object.isRequired,
  onValueChanged: func.isRequired
}

export default GenericForm
