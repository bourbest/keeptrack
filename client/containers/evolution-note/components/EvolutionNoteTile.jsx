import React from 'react'
import PropTypes from 'prop-types'
import {formatDate} from '../../../services/string-utils'
import {find} from 'lodash'

const EvolutionNoteView = (props) => {
  const {authorName, authorRole, createdOn, note, minutes} = props.evolutionNote
  const organismRole = find(props.organismRoles, {value: authorRole})
  return (
    <div>
      <div dangerouslySetInnerHTML={{__html: note}} />
      <div className="foot-note">
        {formatDate(createdOn)} - {authorName}
        {organismRole && <span>{` (${organismRole.label})`}</span>}
        <span> - {minutes} minutes</span>
      </div>
    </div>
  )
}

EvolutionNoteView.propTypes = {
  evolutionNote: PropTypes.object.isRequired,
  organismRoles: PropTypes.array.isRequired
}

export default EvolutionNoteView
