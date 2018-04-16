import React from 'react'
import PropTypes from 'prop-types'
import {formatDate} from '../../../services/string-utils'

const EvolutionNoteView = (props) => {
  const {authorName, authorRole, createdOn, note} = props.evolutionNote

  return (
    <div>
      <span>{formatDate(createdOn)}<span className="right">{authorName} ({authorRole})</span></span>
      <br />
      <div dangerouslySetInnerHTML={{__html: note}} />
    </div>
  )
}

EvolutionNoteView.propTypes = {
  evolutionNote: PropTypes.object.isRequired
}

export default EvolutionNoteView
