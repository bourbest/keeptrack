import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {SmartTable, Column} from '../../components/SmartTable'
import {translate} from '../../../locales/translate'
import { DocumentStatus } from '../../../modules/client-documents/config'
import {buildUrl} from '../../../services/url-utils'
import {formatDate} from '../../../services/string-utils'

export const getLinkToEditDocument = (document, location) => {
  const backTo = encodeURIComponent(buildUrl(location.pathname, location.query))
  return `/client-documents/${document.id}?backTo=${backTo}`
}

export const renderDateColumn = (entity, columnName, column, globals) => {
  const location = globals.location
  const to = getLinkToEditDocument(entity, location)
  const date = formatDate(entity[columnName])
  return <Link to={to}>{date}</Link>
}

export const renderClientNameColumn = (entity, columnName, column, globals) => {
  if (entity.client) {
    const location = globals.location
    const to = getLinkToEditDocument(entity, location)
    return <Link to={to}>{entity.client.firstName} {entity.client.lastName}</Link>
  }
  return ''
}

export const renderFormNameColumn = (entity, columnName, column, globals) => {
  const {formId} = entity
  const form = globals.formsById[formId] || {name: ''}
  const location = globals.location
  const to = getLinkToEditDocument(entity, location)
  return <Link to={to}>{form.name}</Link>
}

const DocumentList = (props) => {
  const {documents, message, notificationsByDocumentId, locale, formsById, location} = props

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
      <SmartTable rows={documents} notificationsByDocumentId={notificationsByDocumentId} location={location} formsById={formsById}>
        <Column
          label={message('date')}
          name="documentDate"
          renderer={renderDateColumn}
        />
        <Column
          label={message('formName')}
          renderer={renderFormNameColumn}
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
  location: PropTypes.object.isRequired,
  formsById: PropTypes.object.isRequired,
  documents: PropTypes.array.isRequired,
  message: PropTypes.func.isRequired,
  notificationsByDocumentId: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  markNotificationAsRead: PropTypes.func.isRequired
}

export default DocumentList
