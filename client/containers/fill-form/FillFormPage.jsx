import React from 'react'
import PropTypes from 'prop-types'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { reduxForm, FormSection, Field } from 'redux-form'
import {validate} from 'sapin'

import config from '../../modules/client-documents/config'
import { ClientLinkOptions, DocumentDateOptions, DocumentStatusOptions } from '../../modules/form-templates/config'

// actions and selectors
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as DocumentActions } from '../../modules/client-documents/actions'
import { ActionCreators as FormActions } from '../../modules/form-templates/actions'

import DocumentSelectors from '../../modules/client-documents/selectors'
import { getLocale } from '../../modules/app/selectors'

// sections tabs components
import DocumentDynamicForm from '../clients/components/DocumentDynamicForm'
import { DateInput, FormError, FieldWrapper, Select } from '../components/forms'
import { Form, Button } from '../components/controls/SemanticControls'
import Toolbar from '../components/Toolbar/Toolbar'
import SelectClient from '../components/behavioral/SelectClient'
import ClientFullName from '../clients/components/ClientFullName'
import AddressTile from '../components/AddressTile'
import {createTranslate} from '../../locales/translate'

const labelNamespace = 'client-document'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(DocumentActions, dispatch),
    formActions: bindActionCreators(FormActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class FillFormPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClientSelected = this.handleClientSelected.bind(this)
    this.message = createTranslate(labelNamespace, this)
    this.handlers = {}
    this.loadTemplate = this.loadTemplate.bind(this)
  }

  componentWillMount () {
    this.loadTemplate(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.params.formId !== nextProps.params.formId) {
      this.loadTemplate(nextProps)
    }
  }

  loadTemplate (props) {
    const formId = props.params.formId
    props.actions.setTemplate(null)
    props.actions.initializeNewDocument(formId)
  }

  handleSubmit () {
    const actions = this.props.actions
    const notify = this.props.appActions.notify

    actions.save(this.props.document, (entity) => {
      notify('common.save', 'common.saved')
      actions.resetForm()
      window.scrollTo(0, 0)
    })
  }

  handleClientSelected (client) {
    this.props.actions.setClient(client)
  }

  render () {
    const {canSave, error, locale, isLoading} = this.props
    const {client, formTemplate, document} = this.props

    if (isLoading || !formTemplate || !document) return null
    return (
      <div>
        <Toolbar title={this.message('newTitle', {formName: formTemplate.name})}>
          <Button onClick={this.props.actions.resetForm}>{this.message('reset', 'common')}</Button>
          <Button primary onClick={this.handleSubmit} disabled={!canSave}>
            {this.message('save', 'common')}
          </Button>
        </Toolbar>

        <Form>
          <FormError error={error} locale={locale} />

          {formTemplate.clientLink === ClientLinkOptions.MANDATORY &&
            <div>
              <Field
                label={this.message('client')}
                name="clientId"
                component={FieldWrapper}
                InputControl={SelectClient}
                required
                locale={locale}
                instanceId="clientId"
                onClientSelected={this.handleClientSelected}
                hidden={client !== null}
            />

            {client &&
              <div className="box-fifth mb-1">
                <ClientFullName client={client} locale={locale} />
                <AddressTile address={client.address} />
              </div>
            }
            </div>
          }

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
          <div>
            <FormSection name="values">
              <DocumentDynamicForm
                controlsById={this.props.formControlsById}
                controlIdsByParentId={this.props.formControlIdsByParentId}
                locale={locale}
                handlers={this.handlers}
              />
            </FormSection>
          </div>
          <br />
          <Toolbar>
            <Button onClick={this.props.actions.resetForm}>{this.message('reset', 'common')}</Button>
            <Button primary onClick={this.handleSubmit} disabled={!canSave}>
              {this.message('save', 'common')}
            </Button>
          </Toolbar>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const ret = {
    client: DocumentSelectors.getClient(state),
    isLoading: DocumentSelectors.isFetching(state),
    document: DocumentSelectors.getEditedEntity(state),
    statusOptions: DocumentSelectors.getStatusOptions(state),
    formTemplate: DocumentSelectors.getTemplate(state),
    formSchema: DocumentSelectors.getFormSchema(state),

    formControlsById: DocumentSelectors.getControls(state),
    formControlIdsByParentId: DocumentSelectors.getControlIdsByParentId(state),

    canSave: DocumentSelectors.canSaveEditedEntity(state),
    error: DocumentSelectors.getSubmitError(state),
    locale: getLocale(state)
  }

  return ret
}

FillFormPage.propTypes = {
  client: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  document: PropTypes.object,
  statusOptions: PropTypes.array.isRequired,

  formTemplate: PropTypes.object,
  formSchema: PropTypes.object.isRequired,

  formControlsById: PropTypes.object.isRequired,
  formControlIdsByParentId: PropTypes.object.isRequired,

  canSave: PropTypes.bool.isRequired,
  error: PropTypes.object,
  locale: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired
}

const validateForm = (data, props) => {
  return validate(data, props.formSchema)
}

const FillFormDocumentPage = reduxForm({
  form: config.entityName,
  validate: validateForm
})(FillFormPage)

const ConnectedFillFormPage = connect(mapStateToProps, mapDispatchToProps)(FillFormDocumentPage)

export default ConnectedFillFormPage
