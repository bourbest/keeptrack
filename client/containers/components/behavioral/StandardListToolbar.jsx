import React from 'react'
import Toolbar from '../Toolbar'
import { Button } from 'semantic-ui-react'
import i18next from 'i18next'

const StandardListToolbar = (props) => {
  const t = (key, ns) => {
    return i18next.t(`${ns}.${key}`, {lng: props.locale})
  }

  return (
    <Toolbar title={props.title}>
      <div className="ui right icon input search-input">
        <i className="search icon"></i>
        <input type='text' placeholder={t('filterSearch', 'common')}
          value={props.listContainsFilter}
          onChange={props.onContainsFilterChanged} />
      </div>
      <Button primary onClick={props.onCreateClicked}>
        {t('create', 'common')}
      </Button>
      <Button secondary onClick={props.onDeleteClicked} disabled={!props.isDeleteEnabled}>
        {t('delete', 'common')}
      </Button>
    </Toolbar>
  )
}

StandardListToolbar.propTypes = {
  onDeleteClicked: React.PropTypes.func.isRequired,
  onCreateClicked: React.PropTypes.func.isRequired,
  onContainsFilterChanged: React.PropTypes.func.isRequired,

  title: React.PropTypes.string.isRequired,
  listContainsFilter: React.PropTypes.string.isRequired,
  locale: React.PropTypes.string.isRequired,

  isDeleteEnabled: React.PropTypes.bool.isRequired
}
export default StandardListToolbar
