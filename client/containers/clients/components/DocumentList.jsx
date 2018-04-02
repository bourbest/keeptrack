import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {format} from 'date-fns'
import { Column, Table } from 'react-virtualized'

const renderDateColumn = (params) => {
  const {clientId, id, createdOn} = params.rowData
  const date = format(createdOn, 'YYYY-MM-DD')
  return <Link to={`/clients/${clientId}/documents/${id}`}>{date}</Link>
}

const getRowClassName = ({index}) => {
  if (index < 0) {
    return 'headerRow'
  } else {
    return 'evenRow'
  }
}

const DocumentList = (props) => {
  const {documents, formsById, message} = props
  const getRow = ({index}) => documents[index]

  const renderFormName = (params) => {
    const {formId} = params.rowData
    return formsById[formId].name
  }

  return (
    <div style={{height: '500px'}}>
      <Table
        headerHeight={50}
        rowHeight={50}
        rowGetter={getRow}
        rowClassName={getRowClassName}
        rowCount={documents.length}
        overscanRowCount={5}
        width={800}
        height={500}
      >
        <Column
          label={message('date')}
          dataKey='createdOn'
          className='rowColumn'
          cellRenderer={renderDateColumn}
          width={100}
          flexGrow={1}
        />
        <Column
          label={message('formName')}
          dataKey='formId'
          className='rowColumn'
          width={300}
          cellRenderer={renderFormName}
          flexGrow={1}
        />
      </Table>
    </div>
  )
}

DocumentList.propTypes = {
  formsById: PropTypes.object.isRequired,
  documents: PropTypes.array.isRequired,
  message: PropTypes.func.isRequired
}

export default DocumentList
