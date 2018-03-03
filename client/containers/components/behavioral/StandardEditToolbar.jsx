import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'
import Toolbar from '../Toolbar/Toolbar'
import BackButton from '../Toolbar/BackButton'
import { translate } from '../../../locales/translate'

const StandardEditToolbar = (props) => {
  const {title, backTo} = props
  return (
    <Toolbar>
      {backTo && <BackButton backTo={backTo} />}
      <div className="item section-title">{title}</div>
      <div className="ui secondary right menu">
        <Button primary onClick={props.onSaveClicked} disabled={!props.canSave}>
          {translate('common.save', props.locale)}
        </Button>
      </div>
    </Toolbar>
  )
}

StandardEditToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  backTo: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  canSave: PropTypes.bool.isRequired,
  onSaveClicked: PropTypes.func.isRequired
}

export default StandardEditToolbar
