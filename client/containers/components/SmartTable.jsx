import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {map, isArray, endsWith} from 'lodash'

import {buildUrl} from '../../services/url-utils'
export class Column extends React.PureComponent {
}

Column.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  renderer: PropTypes.func
}

export class SmartTable extends React.PureComponent {
  constructor (props) {
    super(props)
    this.columns = isArray(props.children) ? props.children : [props.children]
    this.columns = map(this.columns, 'props')
    this.renderRow = this.renderRow.bind(this)
    this.handleRowSelected = this.handleRowSelected.bind(this)
    this.selectedItemIds = new Set(props.selectedItemIds || [])
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.selectedItemIds !== this.props.selectedItemIds) {
      this.selectedItemIds = new Set(nextProps.selectedItemIds || [])
    }
  }

  handleRowSelected (event) {
    if (this.props.onRowSelected) {
      this.props.onRowSelected(event.target.value)
    }
  }

  renderHeader (column, index) {
    return <th key={index}>{column.label}</th>
  }

  renderRow (row, rowIndex) {
    const cells = []
    if (this.props.selectable) {
      if (!this.props.canSelectRow || this.props.canSelectRow(row)) {
        cells.push((
          <td key="check" className="selectRowCell">
            <input type="checkbox" className="ui checkbox" checked={this.selectedItemIds.has(row.id)} onChange={this.handleRowSelected} value={row.id} />
          </td>)
        )
      } else {
        cells.push(<td key="check" />)
      }
    }

    for (let columnIdx = 0; columnIdx < this.columns.length; columnIdx++) {
      cells.push(this.renderCell(row, this.columns[columnIdx], columnIdx, this.props))
    }
    return <tr key={rowIndex} className={this.getRowClassName(rowIndex)}>{cells}</tr>
  }

  getRowClassName (index) {
    return index % 2 === 0 ? 'evenRow' : 'oddRow'
  }

  renderCell (row, column, columnIdx, globals) {
    const content = column.renderer ? column.renderer(row, column.name, column, globals) : row[column.name]
    return <td key={columnIdx}>{content}</td>
  }

  render () {
    const {rows, selectable} = this.props
    return (
      <table className="ui celled table">
        <thead>
          <tr className="headerRow">
            {selectable && <th className="selectRowCell" />}
            {map(this.columns, this.renderHeader)}
          </tr>
        </thead>
        <tbody>
        {map(rows, this.renderRow)}
        </tbody>
      </table>
    )
  }
}

SmartTable.propTypes = {
  children: PropTypes.any,
  rows: PropTypes.array.isRequired,
  selectedItemIds: PropTypes.array,
  selectable: PropTypes.bool,
  onRowSelected: PropTypes.func,
  canSelectRow: PropTypes.func,
  globals: PropTypes.any
}

export const renderLinkToDetail = (entity, columnName, column, globals) => {
  const location = globals.location
  const backTo = encodeURIComponent(buildUrl(location.pathname, location.query))
  let to = endsWith(location.pathname, '/') ? location.pathname : location.pathname + '/'
  to = `${to}${entity.id}?backTo=${backTo}`
  return <Link to={to}>{entity[columnName]}</Link>
}
