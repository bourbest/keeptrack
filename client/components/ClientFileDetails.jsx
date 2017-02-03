import React from 'react'
import GenericForm from './GenericForm'
const { object, func } = React.PropTypes

const fields = [
  {
    name: 'firstName',
    type: 'text',
    isRequired: true,
    label: 'Prénom'
  },
  {
    name: 'lastName',
    type: 'text',
    isRequired: true,
    label: 'Prénom'
  },
  {
    name: 'email',
    type: 'text',
    isRequired: false,
    label: 'Courriel'
  },
  {
    name: 'gender',
    type: 'choices',
    isRequired: false,
    allowMultiple: true,
    label: 'Sexe',
    choices: [
      {
        value: 'M',
        label: 'Homme'
      },
      {
        value: 'F',
        label: 'Femme'
      }
    ]
  },
  {
    name: 'notes',
    type: 'text',
    multiline: true,
    isRequired: false,
    label: 'Notes'
  }
]

const ClientFileDetails = React.createClass({
  propTypes: {
    clientFile: object.isRequired,
    onModifiedAttribute: func.isRequired
  },

  render () {
    const file = this.props.clientFile
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

export default ClientFileDetails
