import React from 'react'
import PropTypes from 'prop-types'
import {browserHistory} from 'react-router'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// actions and selectors
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as ClientActions } from '../../modules/clients/actions'
import { ActionCreators as FormActions } from '../../modules/form-templates/actions'
import ClientSelectors from '../../modules/clients/selectors'
import FormSelectors from '../../modules/form-templates/selectors'
import { getLocale } from '../../modules/app/selectors'

// sections tabs components
import { FormError } from '../components/forms/FormError'
import {createTranslate} from '../../locales/translate'
import StandardEditToolbar from '../components/behavioral/StandardEditToolbar'
import ClientForm from './components/ClientForm'
import DocumentList from './components/DocumentList'
import {Grid} from 'semantic-ui-react'
import Select from 'react-select'

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
    this.handleFormSelected = this.handleFormSelected.bind(this)
    this.handleAddForm = this.handleAddForm.bind(this)
  }

  componentWillMount () {
    const id = this.props.params.id || null
    this.props.formActions.fetchAll()
    if (id !== 'create') {
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
      browserHistory.push(baseUrl)
      notify('common.save', 'common.saved')
    })
  }

  handleFormSelected (event) {
    this.props.actions.setSelectedFormId(event.value)
  }

  handleAddForm () {
    const id = this.props.params.id
    const formId = this.props.selectedFormId
    browserHistory.push(`/clients/${id}/documents/create/${formId}`)
  }

  render () {
    const {canSave, error, locale, isNew, genderOptionList} = this.props
    const {selectedFormId} = this.props
    const titleLabelKey = isNew ? 'create-title' : 'edit-title'
    const style = {width: '1000px'}

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
          <Grid columns={2}>
            <Grid.Column>
              <ClientForm locale={locale} genderOptionList={genderOptionList} />
            </Grid.Column>
            <Grid.Column>
              <h3>{this.message('documents')}</h3>
              <Select
                instanceId="selectForm"
                options={this.props.formOptionList}
                onChange={this.handleFormSelected}
                value={selectedFormId}
                name="selectedFormId"
                placeholder={this.message('selectForm')}
              />
              <button type="button" disabled={selectedFormId === null} onClick={this.handleAddForm}>
                +
              </button>
              {this.props.documents && this.props.documents.length > 0 &&
                <DocumentList
                  documents={this.props.documents}
                  formsById={this.props.formsById}
                  message={this.message}
                />
              }
            </Grid.Column>
          </Grid>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const props = {
    entity: ClientSelectors.getEditedEntity(state),
    genderOptionList: ClientSelectors.getGenderOptionList(state),

    formsById: FormSelectors.getEntities(state),
    formOptionList: FormSelectors.getOptionList(state),
    selectedFormId: ClientSelectors.getSelectedFormId(state),
    documents: ClientSelectors.getClientDocumentsOrderByDate(state),

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

  formOptionList: PropTypes.array.isRequired,
  formsById: PropTypes.object.isRequired,
  selectedFormId: PropTypes.string,
  documents: PropTypes.array.isRequired,

  isNew: PropTypes.bool.isRequired,
  canSave: PropTypes.bool.isRequired,
  error: PropTypes.object,
  locale: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired
}

const ConnectedEditClientPage = connect(mapStateToProps, mapDispatchToProps)(EditClientPage)

export default ConnectedEditClientPage
