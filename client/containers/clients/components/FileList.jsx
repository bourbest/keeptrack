import React from 'react'
import PropTypes from 'prop-types'
import {SmartTable, Column} from '../../components/SmartTable'
import {translate} from '../../../locales/translate'
import {formatDate} from '../../../services/string-utils'

const renderDateColumn = (entity, columnName, column, globals) => {
  const {id} = entity
  const notf = globals.notificationsByFileId[id]

  const date = formatDate(entity[columnName])
  return <a href={entity.uri} target="_blank" onClick={notf && globals.markNotificationAsRead} id={notf && notf.targetId}>{date}</a>
}

const renderFormNameColumn = (entity, columnName, column, globals) => {
  const {uri, name, id} = entity
  const notf = globals.notificationsByFileId[id]
  return <a href={uri} target="_blank" onClick={notf && globals.markNotificationAsRead} id={notf && notf.targetId}>{name}</a>
}

const FileList = (props) => {
  const {files, message, notificationsByFileId, locale, location, selectedFileIds, onFileSelected} = props

  const renderNotification = (entity, columnName, column, globals) => {
    const {id} = entity
    const notf = globals.notificationsByFileId[id]
    const ret = []

    if (notf) {
      ret.push(
        <div className="badge badge-primary clickable" onClick={props.markNotificationAsRead} id={notf.targetId} key="notf">
          {translate(`notificationTypes.${notf.type}`, locale)}
        </div>
      )
    }

    return ret
  }

  return (
    <div style={{height: '500px'}}>
      <SmartTable
        selectable
        rows={files}
        notificationsByFileId={notificationsByFileId}
        markNotificationAsRead={props.markNotificationAsRead}
        selectedItemIds={selectedFileIds}
        onRowSelected={onFileSelected}
      >
        <Column
          label={message('date')}
          name="documentDate"
          renderer={renderDateColumn}
        />
        <Column
          label={message('documentType')}
          renderer={renderFormNameColumn}
        />
        <Column
          label={message('importedBy')}
          name="authorName"
        />
        <Column
          renderer={renderNotification}
        />
      </SmartTable>
    </div>
  )
}

FileList.propTypes = {
  files: PropTypes.array.isRequired,
  message: PropTypes.func.isRequired,
  notificationsByFileId: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  markNotificationAsRead: PropTypes.func.isRequired,
  selectedFileIds: PropTypes.array.isRequired,
  onFileSelected: PropTypes.func.isRequired
}

export default FileList
