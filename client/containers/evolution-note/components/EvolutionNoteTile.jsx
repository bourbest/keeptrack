import React from 'react'
import PropTypes from 'prop-types'
import {formatDate} from '../../../services/string-utils'
import {find} from 'lodash'

const EvolutionNoteView = (props) => {
  const {authorName, authorRole, exchangeDate, note, minutes} = props.evolutionNote
  const organismRole = find(props.organismRoles, {value: authorRole})
  return (
    <div className="box-fifth mb-3">
      <small className="rendered-quill" dangerouslySetInnerHTML={{__html: note}} />
      <div className="foot-note">
        {formatDate(exchangeDate)} - {authorName}
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
