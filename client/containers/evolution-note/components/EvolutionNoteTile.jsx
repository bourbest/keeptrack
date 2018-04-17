import React from 'react'
import PropTypes from 'prop-types'
import {formatDate} from '../../../services/string-utils'

const EvolutionNoteView = (props) => {
  const {authorName, authorRole, createdOn, note} = props.evolutionNote

  return (
    <div>
      <div dangerouslySetInnerHTML={{__html: note}} />
      <div className="foot-note">{formatDate(createdOn)} - {authorName} ({authorRole})</div>
    </div>
  )
}

EvolutionNoteView.propTypes = {
  evolutionNote: PropTypes.object.isRequired
}

export default EvolutionNoteView
