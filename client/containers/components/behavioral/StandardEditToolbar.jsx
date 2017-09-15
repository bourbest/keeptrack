import React from 'react'
import Toolbar from '../Toolbar'
import { Button } from 'semantic-ui-react'
import { translate } from '../../../locales/translate'

const StandardEditToolbar = (props) => {
  return (
    <Toolbar title={props.title} backTo={props.backTo}>
      <Button primary onClick={props.onSaveClicked} disabled={!props.canSave}>
        {translate('common.save', props.locale)}
      </Button>
    </Toolbar>
  )
}

StandardEditToolbar.propTypes = {
  title: React.PropTypes.string.isRequired,
  backTo: React.PropTypes.string.isRequired,
  locale: React.PropTypes.string.isRequired,
  canSave: React.PropTypes.bool.isRequired,
  onSaveClicked: React.PropTypes.func.isRequired
}

export default StandardEditToolbar
