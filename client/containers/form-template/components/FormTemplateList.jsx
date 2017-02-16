import React from 'react'
import { Link } from 'react-router'
import { map, indexOf } from 'lodash'

const { object, array, func } = React.PropTypes

class FormTemplateList extends React.Component {
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
              map(this.props.formTemplates, (template) => (
                <tr key={template.id}>
                  {this.props.onToggleSelected &&
                    <td><input type="checkbox" value={template.id} checked={indexOf(this.props.selectedItemIds, template.id) >= 0} onChange={this.toggle} />
                    </td>
                  }

                  <td><span><Link to={`form-template/${template.id}`}>{template.name}</Link></span></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    )
  }
}

FormTemplateList.propTypes = {
  formTemplates: object.isRequired,
  selectedItemIds: array,
  onToggleSelected: func
}

export default FormTemplateList
