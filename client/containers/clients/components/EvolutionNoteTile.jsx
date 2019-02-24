import React from 'react'
import {Link} from 'react-router'
import PropTypes from 'prop-types'
import {formatDate} from '../../../services/string-utils'
import {find} from 'lodash'
import {translate} from '../../../locales/translate'
import { DocumentStatus } from '../../../modules/client-documents/config'
import {getLinkToEditDocument} from './DocumentList'

class EvolutionNoteView extends React.Component {
  constructor (props) {
    super(props)
    this.toggleExpand = this.toggleExpand.bind(this)
    this.state = {
      expanded: false
    }
  }

  toggleExpand (event) {
    event.preventDefault()
    this.setState({expanded: !this.state.expanded})
  }

  render () {
    const {authorName, authorRole, documentDate, status} = this.props.evolutionNote
    const {note, minutes} = this.props.evolutionNote.values
    const organismRole = find(this.props.organismRoles, {value: authorRole})
    const noteClasses = this.state.expanded ? 'rendered-quill' : 'rendered-quill max-height-300 overflow-hidden'
    return (
      <div>
        <div className={noteClasses} dangerouslySetInnerHTML={{__html: note}} />
        <hr />
        <div>
          {formatDate(documentDate)} - {authorName}
          {organismRole && <span>{` (${organismRole.label})`}</span>}
          <span> - {minutes} minutes</span>
          {status === DocumentStatus.DRAFT &&
            <span className="ml-4 badge badge-danger">
              {translate('client-document.statusOptions.draft')}
            </span>
          }
          <span className="float-right mr-4"><Link to={getLinkToEditDocument(this.props.evolutionNote, this.props.location)}>{translate('common.details')}</Link></span>
          <span className="float-right pr-4"><a href="#" onClick={this.toggleExpand}>
            {!this.state.expanded && translate('common.expand')}
            {this.state.expanded && translate('common.collapse')}
          </a></span>
        </div>
      </div>
    )
  }
}

EvolutionNoteView.propTypes = {
  evolutionNote: PropTypes.object.isRequired,
  organismRoles: PropTypes.array.isRequired,
  notification: PropTypes.object,
  location: PropTypes.object.isRequired
}

export default EvolutionNoteView
