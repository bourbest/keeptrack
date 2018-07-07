import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../controls/SemanticControls'
import Toolbar from '../Toolbar/Toolbar'
import { translate } from '../../../locales/translate'

const StandardEditToolbar = (props) => {
  const {title, backTo, location} = props
  const url = location.query && location.query.backTo
    ? location.query.backTo
    : backTo

  return (
    <Toolbar title={title} backTo={url}>
      <Button primary onClick={props.onSaveClicked} disabled={!props.canSave}>
        {translate('common.save', props.locale)}
      </Button>
    </Toolbar>
  )
}

StandardEditToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  backTo: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  canSave: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  onSaveClicked: PropTypes.func.isRequired
}

export default StandardEditToolbar
