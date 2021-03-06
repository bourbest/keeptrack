import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import {format} from 'date-fns'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { reduxForm, FormSection, Field } from 'redux-form'
import {validate} from 'sapin'

// const
import config from '../../modules/client-documents/config'
import {DocumentStatusOptions, DocumentDateOptions} from '../../modules/form-templates/config'

// actions and selectors
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as DocumentActions } from '../../modules/client-documents/actions'
import { ActionCreators as NotfActions } from '../../modules/notifications/actions'

import DocumentSelectors from '../../modules/client-documents/selectors'
import ClientSelectors from '../../modules/clients/selectors'
import { getLocale } from '../../modules/app/selectors'

// sections tabs components
import DocumentDynamicForm from './components/DocumentDynamicForm'
import { FormError, FieldWrapper, Select, DateInput } from '../components/forms'
import {Form} from '../components/controls/SemanticControls'
import {createTranslate} from '../../locales/translate'
import StandardEditToolbar from '../components/behavioral/StandardEditToolbar'

const labelNamespace = 'client-document'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(DocumentActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch),
    notfActions: bindActionCreators(NotfActions, dispatch)
  }
}

class EditClientDocumentPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.message = createTranslate(labelNamespace, this)
    this.handlers = {}
  }

  componentWillMount () {
    const docId = this.props.params.documentId || null
    const formId = this.props.params.formId
    const clientId = this.props.params.clientId

    this.props.actions.setClient(null)
    this.props.actions.setTemplate(null)
    if (docId) {
      this.props.actions.loadDocument(docId)
    } else {
      this.props.actions.initializeNewDocument(formId, clientId)
    }
  }

  componentDidMount () {
    const {documentNotificationIds} = this.props
    if (documentNotificationIds.length > 0) {
      this.props.notfActions.markAsRead(documentNotificationIds)
    }
  }

  handleSubmit () {
    const {isNew, location} = this.props
    const save = this.props.actions.save
    const notify = this.props.appActions.notify

    save(this.props.document, (entity) => {
      if (isNew) {
        browserHistory.replace(`/client-documents/${entity.id}`)
      }
      const url = location.query && location.query.backTo
        ? location.query.backTo
        : '/dashboard'

      browserHistory.push(url)
      notify('common.save', 'common.saved')
    })
  }

  formatTitle (client, document, form) {
    if (document && form) {
      const clientName = client && `- ${client.firstName} ${client.lastName}` || ''
      const day = format(document.documentDate, 'YYYY-MM-DD')
      return `${form.name} - ${day} ${clientName}`
    }
    return ''
  }

  render () {
    const {canSave, error, locale, isLoading, location} = this.props
    const {client, document, formTemplate} = this.props
    const backTo = location.query && location.query.backTo
    if (isLoading || !formTemplate || !document) return null
    return (
      <div>
        <StandardEditToolbar
          location={this.props.location}
          title={this.formatTitle(client, document, formTemplate)}
          backTo={backTo}
          onSaveClicked={this.handleSubmit}
          locale={locale}
          canSave={canSave} />

        <FormError error={error} locale={locale} />

        <Form>
          {formTemplate.documentStatus === DocumentStatusOptions.USE_DRAFT &&
            <Field
              label={this.message('status')}
              name="status"
              component={FieldWrapper}
              InputControl={Select}
              required
              locale={locale}
              options={this.props.statusOptions}
            />
          }

          {formTemplate.documentDate === DocumentDateOptions.SET_BY_USER &&
            <Field
              label={formTemplate.documentDateLabels[locale]}
              name="documentDate"
              component={FieldWrapper}
              InputControl={DateInput}
              required
              locale={locale}
            />
          }
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
    isLoading: DocumentSelectors.isFetching(state),
    document: DocumentSelectors.getEditedEntity(state),
    statusOptions: DocumentSelectors.getStatusOptions(state),
    client: DocumentSelectors.getClient(state),
    formTemplate: DocumentSelectors.getTemplate(state),
    formSchema: DocumentSelectors.getFormSchema(state),

    documentNotificationIds: ClientSelectors.getNotificationIdsForClientDocument(state, props),

    formControlsById: DocumentSelectors.getControls(state),
    formControlIdsByParentId: DocumentSelectors.getControlIdsByParentId(state),

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
  statusOptions: PropTypes.array.isRequired,
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
