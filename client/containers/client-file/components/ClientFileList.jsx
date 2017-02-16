import React from 'react'
import { Link } from 'react-router'
import { map, indexOf } from 'lodash'

const { object, array, func } = React.PropTypes

class ClientFileList extends React.Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
  }

  toggle (event) {
    const id = event.target.value
    this.props.onToggleSelected(id)
  }

  render () {
    return (
      <div>
        <table>
          <tbody>
            {
              map(this.props.clientFiles, (file) => (
                <tr key={file.id}>
                  {this.props.onToggleSelected &&
                    <td><input type="checkbox" value={file.id} checked={indexOf(this.props.selectedItemIds, file.id) >= 0} onChange={this.toggle} />
                    </td>
                  }

                  <td><span><Link to={`client/${file.id}`}>{file.firstName}</Link></span></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    )
  }
}

ClientFileList.propTypes = {
  clientFiles: object.isRequired,
  selectedItemIds: array,
  onToggleSelected: func
}

export default ClientFileList
