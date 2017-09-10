import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import {createTranslate} from '../../../locales/translate'
import { get } from 'lodash'

import { Column, Table, AutoSizer } from 'react-virtualized'

class ClientList extends PureComponent {
  constructor (props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.getSortParams = this.getSortParams.bind(this)
    this.getRowClassName = this.getRowClassName.bind(this)
    this.message = createTranslate('clients', this)
    this.renderNameColumn = this.renderNameColumn.bind(this)
  }

  toggle (event) {
    const id = event.target.value
    this.props.onToggleSelected(id)
  }

  getRowClassName ({index}) {
    if (index < 0) {
      return 'headerRow'
    } else {
      return index % 2 === 0 ? 'evenRow' : 'oddRow'
    }
  }
  getSortParams () {
    const params = this.props.sortParams
    const ret = (params !== null && params.length > 0) ? params[0] : {}
    return ret
  }

  renderNameColumn (params) {
    const id = params.rowData.id
    const name = get(params.rowData, params.dataKey)
    return <Link to={`/clients/${id}`}>{name}</Link>
  }

  render () {
    const ctrl = this
    const selectedIds = new Set(this.props.selectedItemIds)
    const {clients} = this.props

    const rowGetter = function (index) {
      return clients[index.index]
    }
    const selectionCellRenderer = function (params) {
      const id = params.rowData.id
      return <input type="checkbox" checked={selectedIds.has(id)} onChange={ctrl.toggle} value={id} />
    }

    const sortParam = this.getSortParams()

    return (
      <div style={{height: '500px'}}>
        <AutoSizer>
          {({width, height}) => (
            <Table
              headerHeight={50}
              rowHeight={50}
              rowGetter={rowGetter}
              rowCount={clients.length}
              overscanRowCount={5}
              rowClassName={this.getRowClassName}
              width={width}
              height={height}
              sort={this.props.setSort}
              sortBy={sortParam.field}
              sortDirection={sortParam.direction}
            >
              <Column
                label=''
                dataKey='selection'
                disableSort
                className='rowColumn'
                width={50}
                cellRenderer={selectionCellRenderer}
              />
              <Column
                label={this.message('lastName')}
                dataKey='lastName'
                className='rowColumn'
                cellRenderer={this.renderNameColumn}
                width={100}
                flexGrow={1}
              />
              <Column
                label={this.message('firstName')}
                dataKey='firstName'
                className='rowColumn'
                width={300}
                cellRenderer={this.renderNameColumn}
                flexGrow={1}
              />
            </Table>
          )}
        </AutoSizer>
      </div>
    )
  }
}

ClientList.propTypes = {
  clients: React.PropTypes.array.isRequired,
  selectedItemIds: React.PropTypes.array.isRequired,
  onToggleSelected: React.PropTypes.func.isRequired,
  sortParams: React.PropTypes.array.isRequired,
  setSort: React.PropTypes.func.isRequired,
  locale: React.PropTypes.string,
  entityName: React.PropTypes.string
}

export default ClientList
