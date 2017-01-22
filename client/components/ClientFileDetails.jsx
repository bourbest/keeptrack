import React from 'react'
const { object, func } = React.PropTypes

const ClientFileDetails = React.createClass({
  propTypes: {
    clientFile: object.isRequired,
    onModifiedAttribute: func.isRequired
  },
  handleChange (event) {
    this.props.onModifiedAttribute(event.target.name, event.target.value)
  },
  render () {
    const file = this.props.clientFile
    return (
      <div>
        <h1>{file.firstName} {file.lastName}</h1>
        <form onSubmit={this.handleSubmit}>
          <span><label>Nom:</label><input onChange={this.handleChange} type="text" name="lastName" value={file.lastName} /></span>
          <span><label>prénom:</label><input onChange={this.handleChange} type="text" name="firstName" value={file.firstName} /></span>
        </form>
      </div>
    )
  }
})

export default ClientFileDetails
