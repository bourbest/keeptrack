import React from 'react'
import { Link } from 'react-router'
import { map } from 'lodash'

const { object } = React.PropTypes

const ClientFileList = React.createClass({
  propTypes: {
    clientFiles: object.isRequired
  },
  render () {
    return (
      <div>
        <table>
          <tbody>
            {
              map(this.props.clientFiles, (file) => (
                <tr key={file.id}>
                  <td><span><Link to={`client/${file.id}`}>{file.firstName}</Link></span></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    )
  }
})

export default ClientFileList
