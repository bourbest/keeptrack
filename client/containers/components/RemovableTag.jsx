import React from 'react'
import { Label, Icon } from 'semantic-ui-react'

const RemovableTag = (props) => {
  const {label, onRemoveClicked} = props
  return (
    <Label>
      {label}
      <Icon name="close" onClick={onRemoveClicked} />
    </Label>
  )
}

RemovableTag.propTypes = {
  label: React.PropTypes.string.isRequired,
  onRemoveClicked: React.PropTypes.func.isRequired
}

export default RemovableTag

