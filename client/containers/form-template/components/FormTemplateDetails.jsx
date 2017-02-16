import React from 'react'
import GenericForm from '../../../components/GenericForm'
const { object, func } = React.PropTypes

const fields = [
  {
    name: 'name',
    type: 'text',
    isRequired: true,
    label: 'Nom'
  }
]

const FormTemplateDetails = React.createClass({
  propTypes: {
    template: object.isRequired,
    onModifiedAttribute: func.isRequired
  },

  render () {
    const file = this.props.template
    return (
      <div>
        <h1>{file.firstName} {file.lastName}</h1>
        <form onSubmit={this.handleSubmit}>
          <GenericForm fields={fields} values={file} onValueChanged={this.props.onModifiedAttribute} />
        </form>
      </div>
    )
  }
})

export default FormTemplateDetails
