import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {format} from 'date-fns'
import {SmartTable, Column} from '../../components/SmartTable'

const renderDateColumn = (entity, columnName, column, globals) => {
  const {clientId, id, createdOn} = entity
  const date = format(createdOn, 'YYYY-MM-DD')
  return <Link to={`/clients/${clientId}/documents/${id}`}>{date}</Link>
}

const DocumentList = (props) => {
  const {documents, formsById, message} = props

  const renderFormName = (entity, columnName, column, globals) => {
    const {formId} = entity
    const form = formsById[formId] || {name: ''}
    return form.name
  }

  return (
    <div style={{height: '500px'}}>
      <SmartTable rows={documents}>
        <Column
          label={message('date')}
          name="createdOn"
          renderer={renderDateColumn}
        />
        <Column
          label={message('date')}
          name="createdOn"
          renderer={renderFormName}
        />
      </SmartTable>
    </div>
  )
}

DocumentList.propTypes = {
  formsById: PropTypes.object.isRequired,
  documents: PropTypes.array.isRequired,
  message: PropTypes.func.isRequired
}

export default DocumentList
