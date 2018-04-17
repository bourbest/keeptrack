import React from 'react'
import PropTypes from 'prop-types'
import {browserHistory} from 'react-router'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// actions and selectors
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as ClientActions } from '../../modules/clients/actions'
import ClientSelectors from '../../modules/clients/selectors'
import { getLocale, getListOptions } from '../../modules/app/selectors'

// sections tabs components
import { FormError } from '../components/forms/FormError'
import {createTranslate} from '../../locales/translate'
import StandardEditToolbar from '../components/behavioral/StandardEditToolbar'
import ClientForm from './components/ClientForm'

const labelNamespace = 'clients'
const baseUrl = '/clients/'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class EditClientPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.message = createTranslate(labelNamespace, this)
  }

  componentWillMount () {
    const id = this.props.params.id || null

    if (id !== null) {
      this.props.actions.clearEditedEntity()
      this.props.actions.fetchEditedEntity(id)
    } else {
      this.props.actions.setEditedEntity(ClientSelectors.buildNewEntity())
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
      browserHistory.goBack()
      notify('common.save', 'common.saved')
    })
  }

  render () {
    const {canSave, error, locale, isNew, genderOptionList} = this.props
    const titleLabelKey = isNew ? 'create-title' : 'edit-title'

    return (
      <div>
        <StandardEditToolbar
          title={this.message(titleLabelKey)}
          backTo={baseUrl}
          onSaveClicked={this.handleSubmit}
          locale={locale}
          canSave={canSave} />

        <FormError error={error} locale={locale} />

        <ClientForm
          locale={locale}
          genderOptionList={genderOptionList}
          originOptionList={this.props.originOptionList}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const props = {
    entity: ClientSelectors.getEditedEntity(state),
    genderOptionList: ClientSelectors.getGenderOptionList(state),
    originOptionList: getListOptions(state, 'Origine'),

    isNew: ClientSelectors.isNewEntity(state),
    canSave: ClientSelectors.canSaveEditedEntity(state),
    error: ClientSelectors.getSubmitError(state),
    locale: getLocale(state)
  }
  return props
}

EditClientPage.propTypes = {
  entity: PropTypes.object,
  genderOptionList: PropTypes.array.isRequired,
  originOptionList: PropTypes.array.isRequired,

  isNew: PropTypes.bool.isRequired,
  canSave: PropTypes.bool.isRequired,
  error: PropTypes.object,
  locale: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired
}

const ConnectedEditClientPage = connect(mapStateToProps, mapDispatchToProps)(EditClientPage)

export default ConnectedEditClientPage
