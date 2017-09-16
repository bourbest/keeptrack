import React from 'react'
import { browserHistory } from 'react-router'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// sections tabs components
import { FormError } from '../components/forms/FormError'
import {createTranslate} from '../../locales/translate'

// actions and selectors
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as AccountActions } from '../../modules/accounts/actions'
import AccountSelectors from '../../modules/accounts/selectors'
import { getLocale } from '../../modules/app/selectors'

import StandardEditToolbar from '../components/behavioral/StandardEditToolbar'

import ClientForm from './components/AccountForm'

const labelNamespace = 'accounts'
const baseUrl = '/accounts/'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AccountActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class EditAccountPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.message = createTranslate(labelNamespace, this)
  }

  componentWillMount () {
    const id = this.props.params.id || null

    if (id !== 'create') {
      this.props.actions.clearEditedEntity()
      this.props.actions.fetchEditedEntity(id)
    } else {
      this.props.actions.setEditedEntity(AccountSelectors.buildNewEntity())
    }
  }

  handleSubmit () {
    const isNew = this.props.isNew
    const method = isNew ? this.props.actions.createEntity : this.props.actions.updateEntity
    const notify = this.props.appActions.notify

    method(this.props.entity, (entity) => {
      if (isNew) {
        browserHistory.replace(baseUrl + entity.id)
      }
      browserHistory.push(baseUrl)
      notify('common.save', 'common.saved')
    })
  }

  render () {
    const {canSave, error, locale, isNew} = this.props
    const titleLabelKey = isNew ? 'create-title' : 'edit-title'
    const style = {width: '1000px'}
    const roleList = []

    return (
      <div>
        <StandardEditToolbar
          title={this.message(titleLabelKey)}
          backTo={baseUrl}
          onSaveClicked={this.handleSubmit}
          locale={locale}
          canSave={canSave} />

        <FormError error={error} locale={locale} />

        <div style={style}>
          <ClientForm locale={locale} isNew={isNew} roleList={roleList} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const props = {
    entity: AccountSelectors.getEditedEntity(state),
    isNew: AccountSelectors.isNewEntity(state),
    canSave: AccountSelectors.canSaveEditedEntity(state),
    error: AccountSelectors.getSubmitError(state),
    locale: getLocale(state)
  }
  return props
}

EditAccountPage.propTypes = {
  entity: React.PropTypes.object,
  isNew: React.PropTypes.bool.isRequired,
  canSave: React.PropTypes.bool.isRequired,
  error: React.PropTypes.string,
  locale: React.PropTypes.string.isRequired,
  params: React.PropTypes.object.isRequired
}

const ConnectedEditAccountPage = connect(mapStateToProps, mapDispatchToProps)(EditAccountPage)

export default ConnectedEditAccountPage
