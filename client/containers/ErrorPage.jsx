import React from 'react'
const { string } = React.PropTypes

const ErrorPage = React.createClass({
  propTypes: {
    error: string
  },
  render () {
    return (
      <div className='error-page'>
        <h2>Oops!</h2>
        <p><strong>Error :</strong> {this.props.error || 404}</p>
      </div>
    )
  }
})

export default ErrorPage
