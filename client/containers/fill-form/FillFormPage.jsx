import React from 'react'
import PropTypes from 'prop-types'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { reduxForm, FormSection, Field } from 'redux-form'
import {validate} from 'sapin'

import config from '../../modules/client-documents/config'
import { ClientLinkOptions, DocumentDateOptions } from '../../modules/form-templates/config'

// actions and selectors
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as DocumentActions } from '../../modules/client-documents/actions'
import { ActionCreators as FormActions } from '../../modules/form-templates/actions'

import DocumentSelectors from '../../modules/client-documents/selectors'
import FormSelectors from '../../modules/form-templates/selectors'
import { getLocale } from '../../modules/app/selectors'

// sections tabs components
import DocumentDynamicForm from '../clients/components/DocumentDynamicForm'
import { DateInput, FormError, FieldWrapper } from '../components/forms'
import { Form, Button } from '../components/controls/SemanticControls'
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
  }

  componentWillMount () {
    const formId = this.props.params.formId
    this.props.formActions.fetchEditedEntity(formId)
    this.props.actions.setClient(null)
    this.props.actions.setEditedEntity(DocumentSelectors.buildNewEntity(null, formId))
  }

  handleSubmit () {
    const actions = this.props.actions
    const notify = this.props.appActions.notify
    const formId = this.props.params.formId

    actions.save(this.props.document, (entity) => {
      notify('common.save', 'common.saved')
      actions.setClient(null)
      actions.setEditedEntity(DocumentSelectors.buildNewEntity(null, formId))
      window.scrollTo(0, 0)
    })
  }

  handleClientSelected (client) {
    this.props.actions.setClient(client)
  }

  render () {
    const {canSave, error, locale, isLoading} = this.props
    const {client, formTemplate} = this.props

    if (isLoading || !formTemplate) return null
    return (
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

        {formTemplate.documentDate === DocumentDateOptions.SET_BY_USER &&
          <Field
            label={formTemplate.documentDateLabels[locale]}
            name="createdOn"
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
        <Button primary className="mr-2" onClick={this.handleSubmit} disabled={!canSave}>{this.message('save', 'common')}</Button>
        <Button onClick={this.props.actions.resetForm}>{this.message('reset', 'common')}</Button>
      </Form>
    )
  }
}

const mapStateToProps = (state, props) => {
  const ret = {
    client: DocumentSelectors.getClient(state),
    isLoading: FormSelectors.isFetchingEntity(state),
    document: DocumentSelectors.getEditedEntity(state),
    formTemplate: FormSelectors.getEditedEntity(state),
    formSchema: FormSelectors.getFormSchema(state),

    formControlsById: FormSelectors.getControls(state),
    formControlIdsByParentId: FormSelectors.getControlIdsByParentId(state),

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
