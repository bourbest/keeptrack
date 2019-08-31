import PropTypes from 'prop-types'
import React from 'react'
import {Field} from 'redux-form'
import TextArea from './TextArea'

class TableField extends React.PureComponent {

  constructor (props) {
    super(props)
    this.renderColumns = this.renderColumns.bind(this)
  }

  renderColumns (column, lineId) {
    return (
      <td key={column.id}>
        <Field name={`${lineId}.${column.id}`} component={TextArea} />
      </td>
    )
  }

  render () {
    const { columns, lines } = this.props
    return (
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            {columns.map(col => !col.isArchived ? <th key={col.id} style={{width: `${col.width}px`}}>{col.label}</th> : null)}
          </tr>
        </thead>
        <tbody>
          {lines.map(line => !line.isArchived && (
            <tr key={line.id}>
              <td>{line.label}</td>
              {columns.map((col, colIdx) => colIdx && !col.isArchived ? this.renderColumns(col, line.id) : null)}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

TableField.propTypes = {
  columns: PropTypes.array.isRequired,
  lines: PropTypes.array.isRequired
}

export default TableField
