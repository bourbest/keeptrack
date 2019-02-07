import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import {format} from 'date-fns'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { reduxForm, FormSection } from 'redux-form'
import {validate} from 'sapin'

// actions and selectors
import config from '../../modules/client-documents/config'
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as DocumentActions } from '../../modules/client-documents/actions'
import { ActionCreators as ClientActions } from '../../modules/clients/actions'
import { ActionCreators as FormActions } from '../../modules/form-templates/actions'
import { ActionCreators as NotfActions } from '../../modules/notifications/actions'

import DocumentSelectors from '../../modules/client-documents/selectors'
import ClientSelectors from '../../modules/clients/selectors'
import FormSelectors from '../../modules/form-templates/selectors'
import { getLocale } from '../../modules/app/selectors'

// sections tabs components
import DocumentDynamicForm from './components/DocumentDynamicForm'
import { FormError } from '../components/forms/FormError'
import {Form} from '../components/controls/SemanticControls'
import {createTranslate} from '../../locales/translate'
import StandardEditToolbar from '../components/behavioral/StandardEditToolbar'

const labelNamespace = 'client-document'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(DocumentActions, dispatch),
    clientActions: bindActionCreators(ClientActions, dispatch),
    formActions: bindActionCreators(FormActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch),
    notfActions: bindActionCreators(NotfActions, dispatch)
  }
}

class EditClientDocumentPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.message = createTranslate(labelNamespace, this)
    this.clientUrl = `/clients/${props.params.clientId}`
    this.handlers = {}
  }

  componentWillMount () {
    const docId = this.props.params.documentId || null
    const formId = this.props.params.formId
    const clientId = this.props.params.clientId

    if (docId) {
      this.props.actions.loadDocument(clientId, docId)
    } else {
      const newDoc = DocumentSelectors.buildNewEntity(clientId, formId)
      this.props.actions.setEditedEntity(newDoc)
      this.props.clientActions.fetchEditedEntity(clientId)
      this.props.formActions.fetchEditedEntity(formId)
      this.props.actions.setEditedEntity(newDoc)
    }
  }

  componentDidMount () {
    const {documentNotificationIds} = this.props
    if (documentNotificationIds.length > 0) {
      this.props.notfActions.markAsRead(documentNotificationIds)
    }
  }

  handleSubmit () {
    const {isNew} = this.props
    const save = this.props.actions.save
    const notify = this.props.appActions.notify

    save(this.props.document, (entity) => {
      if (isNew) {
        browserHistory.replace(`${this.clientUrl}/documents/${entity.id}`)
      }
      browserHistory.push(this.clientUrl)
      notify('common.save', 'common.saved')
    })
  }

  formatTitle (client, document, form) {
    if (client && document && form) {
      const day = format(document.createdOn, 'YYYY-MM-DD')
      return `${client.firstName} ${client.lastName} - ${form.name} (${day})`
    }
    return ''
  }
  render () {
    const {canSave, error, locale, isLoading} = this.props
    const {client, document, formTemplate} = this.props

    if (isLoading) return null
    return (
      <div>
        <StandardEditToolbar
          location={this.props.location}
          title={this.formatTitle(client, document, formTemplate)}
          backTo={this.clientUrl}
          onSaveClicked={this.handleSubmit}
          locale={locale}
          canSave={canSave} />

        <FormError error={error} locale={locale} />

        <Form>
          <FormSection name="values">
            <DocumentDynamicForm
              controlsById={this.props.formControlsById}
              controlIdsByParentId={this.props.formControlIdsByParentId}
              locale={locale}
              handlers={this.handlers}
            />
          </FormSection>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const ret = {
    isLoading: FormSelectors.isFetchingList(state) || ClientSelectors.isFetchingEntity(state),
    document: DocumentSelectors.getEditedEntity(state),
    client: ClientSelectors.getEditedEntity(state),
    formTemplate: FormSelectors.getEditedEntity(state),
    formSchema: FormSelectors.getFormSchema(state),

    documentNotificationIds: ClientSelectors.getNotificationIdsForClientDocument(state, props),

    formControlsById: FormSelectors.getControls(state),
    formControlIdsByParentId: FormSelectors.getControlIdsByParentId(state),

    isNew: DocumentSelectors.isNewEntity(state),
    canSave: DocumentSelectors.canSaveEditedEntity(state),
    error: DocumentSelectors.getSubmitError(state),
    locale: getLocale(state)
  }

  return ret
}

EditClientDocumentPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  document: PropTypes.object,
  client: PropTypes.object,
  formTemplate: PropTypes.object,
  formSchema: PropTypes.object.isRequired,

  formControlsById: PropTypes.object.isRequired,
  formControlIdsByParentId: PropTypes.object.isRequired,

  isNew: PropTypes.bool.isRequired,
  canSave: PropTypes.bool.isRequired,
  error: PropTypes.object,
  locale: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired
}

const validateForm = (data, props) => {
  return validate(data, props.formSchema)
}

const EditClientDocumentFormPage = reduxForm({
  form: config.entityName,
  validate: validateForm
})(EditClientDocumentPage)

const ConnectedEditClientDocumentPage = connect(mapStateToProps, mapDispatchToProps)(EditClientDocumentFormPage)

export default ConnectedEditClientDocumentPage
