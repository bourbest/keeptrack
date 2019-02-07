import React from 'react'
import PropTypes from 'prop-types'
import {browserHistory} from 'react-router'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {validate} from 'sapin'
import { reduxForm } from 'redux-form'

// actions and selectors
import config from '../../modules/clients/config'
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as ClientActions } from '../../modules/clients/actions'
import { ActionCreators as FormActions } from '../../modules/form-templates/actions'

import ClientSelectors from '../../modules/clients/selectors'
import ClientFormSelectors from '../../modules/clients/client-form-selectors'
import { getLocale } from '../../modules/app/selectors'

// sections tabs components
import { FormError } from '../components/forms/FormError'
import {Form} from '../components/controls/SemanticControls'
import {createTranslate} from '../../locales/translate'
import StandardEditToolbar from '../components/behavioral/StandardEditToolbar'
import DocumentDynamicForm from './components/DocumentDynamicForm'

const labelNamespace = 'clients'
const baseUrl = '/clients/'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch),
    formActions: bindActionCreators(FormActions, dispatch)
  }
}

class EditClientPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.message = createTranslate(labelNamespace, this)
    this.handlers = {}
  }

  componentWillMount () {
    const id = this.props.params.id || null
    this.props.formActions.fetchList({limit: 1000, includeArchived: true})
    this.props.actions.fetchClientForm()
    if (id !== null) {
      this.props.actions.clearEditedEntity()
      this.props.actions.fetchEditedEntity(id)
    } else {
      this.props.actions.setEditedEntity(ClientSelectors.buildNewEntity())
    }
  }

  handleSubmit () {
    const isNew = this.props.isNew
    const notify = this.props.appActions.notify

    this.props.actions.saveEntity(this.props.client, (entity) => {
      if (isNew) {
        browserHistory.replace(baseUrl + entity.id)
      }
      browserHistory.goBack()
      notify('common.save', 'common.saved')
    })
  }

  render () {
    const {canSave, error, locale, isNew, isLoading} = this.props
    const titleLabelKey = isNew ? 'create-title' : 'edit-title'
    if (isLoading) return null

    return (
      <div>
        <StandardEditToolbar
          location={this.props.location}
          title={this.message(titleLabelKey)}
          backTo={baseUrl}
          onSaveClicked={this.handleSubmit}
          locale={locale}
          canSave={canSave} />

        <FormError error={error} locale={locale} />
        <Form>
          <DocumentDynamicForm
            controlsById={this.props.formControlsById}
            controlIdsByParentId={this.props.formControlIdsByParentId}
            locale={locale}
            handlers={this.handlers}
          />
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const props = {
    isNew: ClientSelectors.isNewEntity(state),
    canSave: ClientSelectors.canSaveEditedEntity(state),
    error: ClientSelectors.getSubmitError(state),
    isLoading: ClientFormSelectors.isFetchingClientForm(state) || ClientSelectors.isFetchingEntity(state),

    client: ClientSelectors.getEditedEntity(state),
    formTemplate: ClientFormSelectors.getClientForm(state),
    formSchema: ClientFormSelectors.getClientSchema(state),
    formControlsById: ClientFormSelectors.getControls(state),
    formControlIdsByParentId: ClientFormSelectors.getControlIdsByParentId(state),

    locale: getLocale(state)
  }
  return props
}

EditClientPage.propTypes = {
  isNew: PropTypes.bool.isRequired,
  canSave: PropTypes.bool.isRequired,
  error: PropTypes.object,
  client: PropTypes.object,

  formTemplate: PropTypes.object,
  formSchema: PropTypes.object.isRequired,
  formControlsById: PropTypes.object.isRequired,
  formControlIdsByParentId: PropTypes.object.isRequired,

  locale: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired
}

const validateForm = (data, props) => {
  return validate(data, props.formSchema)
}

const EditClientFormPage = reduxForm({
  form: config.entityName,
  validate: validateForm
})(EditClientPage)

const ConnectedEditClientPage = connect(mapStateToProps, mapDispatchToProps)(EditClientFormPage)

export default ConnectedEditClientPage
