import React from 'react'
import { Link } from 'react-router'
import { map } from 'lodash'

const { array, func, string } = React.PropTypes

class EntityList extends React.Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
  }

  toggle (event) {
    const id = event.target.value
    this.props.onToggleSelected(id)
  }

  render () {
    const ctrl = this
    const props = this.props
    const selectedIds = new Set(props.selectedItemIds)

    return (
      <div>
      {
        map(this.props.entities, (entity) => {
          const id = entity[props.idProperty]
          return (
            <div key={id}>
              <input type="checkbox" checked={selectedIds.has(id)} onChange={ctrl.toggle} value={id} />
              <Link to={`${props.linkTo}/${id}`}>{props.formatName(entity)}</Link>
            </div>
          )
        })
      }
      </div>
    )
  }
}

EntityList.propTypes = {
  entities: array.isRequired,
  selectedItemIds: array.isRequired,
  onToggleSelected: func.isRequired,
  linkTo: string.isRequired,
  idProperty: string,
  formatName: func.isRequired
}

EntityList.defaultProps = {
  idProperty: 'id'
}

export default EntityList
