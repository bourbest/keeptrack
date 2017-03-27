import React from 'react'
import { Link } from 'react-router'
import { map } from 'lodash'

const { object, array, func, string } = React.PropTypes

const HeaderCell = (props) => (
  <div className={`thead-cell ${props.column.headerClassName}`} onClick={props.onClick} name={props.column.name}>{props.column.label}</div>
  )

HeaderCell.propTypes = {
  column: object.isRequired,
  onClick: func
}

class EntityTable extends React.Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.onHeaderClicked = this.onHeaderClicked.bind(this)
  }

  toggle (event) {
    const id = event.target.value
    if (id === 'checkall') {
      this.props.onSelectAll()
    } else {
      this.props.onToggleSelected(id)
    }
  }

  onHeaderClicked (event) {
    const name = event.target.name
    this.props.onHeaderClicked(name)
  }

  render () {
    const ctrl = this
    const props = this.props
    const selectedIds = new Set(props.selectedItemIds)

    return (
      <div className="list-wrapper">
        <div className="list-container">
          <div className="table">
            <div className="thead">
              <div className={`thead-row ${props.headerClassName}`}>
              {this.props.onToggleSelected &&
                <div className="thead-cell"><input type="checkbox" value="checkall" checked={selectedIds.length === props.entities.length} onChange={ctrl.toggle} />
                </div>
              }

              {
                map(this.props.columns, (column) => (
                  <HeaderCell className={column.headerClassName} onClick={ctrl.onHeaderClicked} key={column.name} column={column} />
                ))
              }
              </div>
            </div>
            <div className={`tbody ${props.bodyClassName}`}>
              {
                map(props.entities, (entity) => {
                  let id = entity[props.idProperty]
                  return (
                    <div className={`tbody-row clickable ${props.rowClassName}`} key={id}>
                      {this.props.onToggleSelected &&
                        <div className="tbody-cell"><input type="checkbox" value={id} checked={selectedIds.has(id)} onChange={ctrl.toggle} />
                        </div>
                      }

                      {props.linkTo &&
                        <Link to={`${props.linkTo}/${id}`}>
                        {
                        map(props.columns, (column) => (
                          <div className={`tbody-cell ${column.cellClassName}`} key={column.name}>{entity[column.name]}</div>
                          ))
                        }
                        </Link>
                      }
                      {!props.linkTo &&
                        map(props.columns, (column) => (
                          <div className={`tbody-cell ${column.cellClassName}`} key={column.name}>{entity[column.name]}</div>
                          ))
                      }
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const nofuncProvided = () => {
  console.warn('onSelectAll not provided')
}

EntityTable.propTypes = {
  entities: array.isRequired,
  selectedItemIds: array,
  onToggleSelected: func,
  onSelectAll: func,
  onHeaderClicked: func,
  columns: array.isRequired,
  linkTo: string.isRequired,
  idProperty: string
}

EntityTable.defaultProps = {
  selectedItemIds: [],
  idProperty: 'id',
  onSelectAll: nofuncProvided
}

export default EntityTable
