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
import { ActionCreators as SubscriptionActions } from '../../modules/client-feed-subscriptions/actions'

import ClientSelectors from '../../modules/clients/selectors'
import SubscriptionSelectors from '../../modules/client-feed-subscriptions/selectors'
import FormSelectors from '../../modules/form-templates/selectors'
import {getLocale, getOrganismRoleOptions, getOriginOptions} from '../../modules/app/selectors'
import {getUser} from '../../modules/authentication/selectors'

// sections tabs components
import Toolbar from '../components/Toolbar/Toolbar'
import {createTranslate} from '../../locales/translate'
import {Button, Icon} from '../components/controls/SemanticControls'

import ClientView from './components/ClientView'
import EvolutionNoteTile from '../evolution-note/components/EvolutionNoteTile'
import DocumentList from './components/DocumentList'
import Select from 'react-select'

const labelNamespace = 'clients'
const baseUrl = '/clients'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch),
    formActions: bindActionCreators(FormActions, dispatch),
    subscriptionActions: bindActionCreators(SubscriptionActions, dispatch)
  }
}

class ViewClientPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.message = createTranslate(labelNamespace, this)
    this.handleFormSelected = this.handleFormSelected.bind(this)
    this.handleAddForm = this.handleAddForm.bind(this)
    this.toggleSubscription = this.toggleSubscription.bind(this)
    this.renderSubscriptionButton = this.renderSubscriptionButton.bind(this)
  }

  componentWillMount () {
    const id = this.props.params.id || null
    this.props.formActions.fetchList({limit: 1000, includeArchived: true})
    this.props.appActions.hideModal()
    this.props.subscriptionActions.fetchList({userId: this.props.user.id})
    this.props.actions.clearEditedEntity()
    this.props.actions.fetchEditedEntity(id)
  }

  handleFormSelected (event) {
    this.props.actions.setSelectedFormId(event.value)
  }

  handleAddForm () {
    const id = this.props.params.id
    const formId = this.props.selectedFormId
    browserHistory.push(`/clients/${id}/documents/create/${formId}`)
  }

  toggleSubscription () {
    const {feedSubscription, subscriptionActions, user, client} = this.props
    if (feedSubscription) {
      subscriptionActions.deleteEntities([feedSubscription.id])
    } else {
      const newSubscription = SubscriptionSelectors.buildNewEntity(user.id, client.id)
      subscriptionActions.saveEntity(newSubscription)
    }
  }

  renderSubscriptionButton () {
    const {feedSubscription} = this.props
    const classes = feedSubscription != null
      ? 'text-white bg-success'
      : 'text-light'

    return (
      <Button onClick={this.toggleSubscription} className={classes}>
        <Icon name="eye" />
      </Button>
    )
  }

  render () {
    const {locale, client, originOptionList, organismRoleList} = this.props
    if (!client) return null
    const {selectedFormId} = this.props
    const clientName = `${client.firstName} ${client.lastName}`
    return (
      <div>
        <Toolbar title={clientName} backTo={baseUrl}>
          {this.renderSubscriptionButton()}
        </Toolbar>

        <div>
          <div>
            <ClientView
              locale={locale}
              client={client}
              originOptionList={originOptionList}
            />
          </div>

          <div className="row mt-2">
            <div className="col-md-6">
              <h3>{this.message('evolutionNotes')}</h3>
              {this.props.evolutionNotes.map(note =>
                <EvolutionNoteTile evolutionNote={note} organismRoles={organismRoleList} key={note.id} />
              )}
              {this.props.evolutionNotes.length === 0 &&
                <span>{this.message('noEvolutionNotes')}</span>
              }
            </div>

            <div className="col-md-6">
              <h3>{this.message('documents')}</h3>
              <div className="row mb-2">
                <div className="col-9">
                  <Select
                    instanceId="selectForm"
                    options={this.props.formOptionList}
                    onChange={this.handleFormSelected}
                    value={selectedFormId}
                    name="selectedFormId"
                    placeholder={this.message('selectForm')}
                  />
                </div>
                <div className="col-3 p-0">
                  <Button primary type="button" disabled={selectedFormId === null} onClick={this.handleAddForm}>
                    {this.message('create', 'common')}
                  </Button>
                </div>
              </div>

              {this.props.documents && this.props.documents.length > 0 &&
                <DocumentList
                  documents={this.props.documents}
                  formsById={this.props.formsById}
                  message={this.message}
                />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const props = {
    client: ClientSelectors.getEditedEntity(state),
    feedSubscription: SubscriptionSelectors.getUserSubscriptiondToEditedClientFeed(state),
    user: getUser(state),

    originOptionList: getOriginOptions(state),
    organismRoleList: getOrganismRoleOptions(state),

    formsById: FormSelectors.getEntities(state),
    formOptionList: FormSelectors.getCreatableFormOptionList(state),
    selectedFormId: ClientSelectors.getSelectedFormId(state),
    documents: ClientSelectors.getClientDocumentsOrderByDate(state),
    evolutionNotes: ClientSelectors.getClientNotesOrderByDate(state),

    locale: getLocale(state)
  }
  return props
}

ViewClientPage.propTypes = {
  client: PropTypes.object,
  feedSubscription: PropTypes.object,
  user: PropTypes.object.isRequired,

  originOptionList: PropTypes.array.isRequired,
  organismRoleList: PropTypes.array.isRequired,

  formOptionList: PropTypes.array.isRequired,
  formsById: PropTypes.object.isRequired,
  selectedFormId: PropTypes.string,
  documents: PropTypes.array.isRequired,

  locale: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired
}

const ConnectedViewClientPage = connect(mapStateToProps, mapDispatchToProps)(ViewClientPage)

export default ConnectedViewClientPage
