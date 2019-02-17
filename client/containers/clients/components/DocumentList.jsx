import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {format} from 'date-fns'
import {SmartTable, Column} from '../../components/SmartTable'
import {translate} from '../../../locales/translate'
import { DocumentStatus } from '../../../modules/client-documents/config'
const renderDateColumn = (entity, columnName, column, globals) => {
  const {clientId, id, createdOn} = entity
  const date = format(createdOn, 'YYYY-MM-DD')
  return <Link to={`/clients/${clientId}/documents/${id}`}>{date}</Link>
}

const DocumentList = (props) => {
  const {documents, formsById, message, notificationsByDocumentId, locale} = props

  const renderFormName = (entity, columnName, column, globals) => {
    const {formId} = entity
    const form = formsById[formId] || {name: ''}
    return form.name
  }

  const renderNotification = (entity, columnName, column, globals) => {
    const {id, status} = entity
    const notf = globals.notificationsByDocumentId[id]
    const ret = []

    if (status === DocumentStatus.DRAFT) {
      ret.push(
        <div className="badge badge-danger" key="status">
          {translate('client-document.statusOptions.draft')}
        </div>
      )
    }
    if (notf) {
      ret.push(
        <div className="badge badge-primary clickable" onClick={props.markNotificationAsRead} id={notf.id} key="notf">
          {translate(`notificationTypes.${notf.type}`, locale)}
        </div>
      )
    }

    return ret
  }

  return (
    <div style={{height: '500px'}}>
      <SmartTable rows={documents} notificationsByDocumentId={notificationsByDocumentId}>
        <Column
          label={message('date')}
          name="documentDate"
          renderer={renderDateColumn}
        />
        <Column
          label={message('formName')}
          renderer={renderFormName}
        />
        <Column
          label={message('author')}
          name="authorName"
        />
        <Column
          renderer={renderNotification}
        />
      </SmartTable>
    </div>
  )
}

DocumentList.propTypes = {
  formsById: PropTypes.object.isRequired,
  documents: PropTypes.array.isRequired,
  message: PropTypes.func.isRequired,
  notificationsByDocumentId: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  markNotificationAsRead: PropTypes.func.isRequired
}

export default DocumentList
