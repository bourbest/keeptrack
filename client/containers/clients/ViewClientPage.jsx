import React from 'react'
import PropTypes from 'prop-types'
import {browserHistory} from 'react-router'
import {get, size} from 'lodash'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// actions and selectors
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as ClientActions } from '../../modules/clients/actions'
import { ActionCreators as FormActions } from '../../modules/form-templates/actions'
import { ActionCreators as SubscriptionActions } from '../../modules/client-feed-subscriptions/actions'
import { ActionCreators as NotfActions } from '../../modules/notifications/actions'
import { ActionCreators as FileActions } from '../../modules/uploaded-files/actions'

import ClientSelectors from '../../modules/clients/selectors'
import ClientFormSelectors from '../../modules/clients/client-form-selectors'
import SubscriptionSelectors from '../../modules/client-feed-subscriptions/selectors'
import FormSelectors from '../../modules/form-templates/selectors'
import {getLocale, getOrganismRoleOptions} from '../../modules/app/selectors'
import {getUser} from '../../modules/authentication/selectors'

// sections tabs components
import Toolbar from '../components/Toolbar/Toolbar'
import {createTranslate} from '../../locales/translate'
import {Button, Icon, NavTab, Tabs, Tab} from '../components/controls/SemanticControls'

import ClientView from './components/ClientView'
import EvolutionNoteTile from './components/EvolutionNoteTile'
import DocumentList from './components/DocumentList'
import FileList from './components/FileList'
import Select from 'react-select'

const labelNamespace = 'clients'
const baseUrl = '/clients'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch),
    formActions: bindActionCreators(FormActions, dispatch),
    subscriptionActions: bindActionCreators(SubscriptionActions, dispatch),
    notfActions: bindActionCreators(NotfActions, dispatch),
    fileActions: bindActionCreators(FileActions, dispatch)
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
    this.onTabSelected = this.onTabSelected.bind(this)
    this.markNotificationAsRead = this.markNotificationAsRead.bind(this)
    this.handleAddFile = this.handleAddFile.bind(this)
    this.handleFilesSelected = this.handleFilesSelected.bind(this)
    this.handleEditFiles = this.handleEditFiles.bind(this)
  }

  componentWillMount () {
    const id = this.props.params.id || null
    this.props.formActions.fetchList({limit: 1000, includeArchived: true})
    this.props.appActions.hideModal()
    this.props.subscriptionActions.fetchList({userId: this.props.user.id})
    this.props.actions.clearEditedEntity()
    this.props.actions.fetchEditedEntity(id)
    this.props.actions.fetchClientForm()
  }

  handleEditFiles () {
    this.props.fileActions.initializeReviewFilesForm({files: this.props.selectedFiles})
    this.props.fileActions.initializeUploadProgresses(0)
    this.props.actions.clearSelectedFiles()
    browserHistory.push('/uploaded-files/review')
  }

  handleFormSelected (event) {
    this.props.actions.setSelectedFormId(event.value)
  }

  handleAddForm () {
    const id = this.props.params.id
    const formId = this.props.selectedFormId
    const backTo = encodeURIComponent(`/clients/${id}`)
    browserHistory.push(`/clients/${id}/documents/create/${formId}?backTo=${backTo}`)
  }

  handleAddFile () {
    this.props.fileActions.resetReviewFilesForm()
    this.props.fileActions.clearFileToUploadList()

    this.refs && this.refs.fileInput.click()
  }

  handleFilesSelected (event) {
    const fileInput = event.target
    const metadata = {
      clientId: this.props.client.id
    }
    this.props.fileActions.uploadFiles(fileInput.files, metadata)
    browserHistory.push('/uploaded-files/review')
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

  onTabSelected (event) {
    let name = event.target.name
    let node = event.target
    while (node && !name) {
      node = node.parentNode
      name = node && node.name
    }
    if (name) {
      this.props.actions.setSelectedTabId(name)
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

  markNotificationAsRead (event) {
    const targetId = [event.target.id]
    const ids = this.props.notificationsByTargetId[targetId]
    this.props.notfActions.markAsRead(ids)
  }

  render () {
    const {locale, client, originOptionsById, messageOptionsById, organismRoleList, notificationsByNoteId, notificationsByDocumentId, notificationsByFileId} = this.props
    if (!client) return null
    const {selectedFormId, selectedTabId} = this.props
    const clientName = `${client.firstName} ${client.lastName}`
    const backTo = get(this.props, 'location.query.backTo', baseUrl)
    const notesNotificationCount = size(notificationsByNoteId)
    const documentsNotificationCount = size(notificationsByDocumentId)
    const filesNotificationCount = size(notificationsByFileId)
    return (
      <div>
        <Toolbar title={clientName} backTo={backTo}>
          {this.renderSubscriptionButton()}
        </Toolbar>

        <div>
          <div>
            <ClientView
              locale={locale}
              client={client}
              originOptionsById={originOptionsById}
              messageOptionsById={messageOptionsById}
            />
          </div>

          <div className="mt-2 w-100">
            <ul className="nav nav-tabs nav-fill">
              <NavTab active={selectedTabId === 'notes'} name="notes" onClick={this.onTabSelected}>
                {this.message('evolutionNotes')}
                {notesNotificationCount > 0 && <span className="ml-2 badge badge-pill badge-primary">{notesNotificationCount}</span>}
              </NavTab>
              <NavTab active={selectedTabId === 'documents'} name="documents" onClick={this.onTabSelected}>
                {this.message('documents')}
                {documentsNotificationCount > 0 && <span className="ml-2 badge badge-pill badge-primary">{documentsNotificationCount}</span>}
              </NavTab>
              <NavTab active={selectedTabId === 'files'} name="files" onClick={this.onTabSelected}>
                {this.message('files')}
                {filesNotificationCount > 0 && <span className="ml-2 badge badge-pill badge-primary">{filesNotificationCount}</span>}
              </NavTab>
            </ul>
            <Tabs>
              <Tab active={selectedTabId === 'notes'}>
                {this.props.evolutionNotes.map(note => {
                  const notf = notificationsByNoteId[note.id]
                  return (
                    <div className="box-fifth mb-3" key={note.id}>
                      {notf &&
                        <div className="badge badge-primary float-right m-2 clickable" onClick={this.markNotificationAsRead} id={notf.targetId}>
                          {this.message(notf.type, 'notificationTypes')}
                        </div>
                      }
                      <EvolutionNoteTile evolutionNote={note} organismRoles={organismRoleList} location={this.props.location} />
                    </div>
                  )
                })}
                {this.props.evolutionNotes.length === 0 &&
                  <span>{this.message('noEvolutionNotes')}</span>
                }
              </Tab>

              <Tab active={selectedTabId === 'documents'}>
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
                    location={this.props.location}
                    documents={this.props.documents}
                    formsById={this.props.formsById}
                    message={this.message}
                    notificationsByDocumentId={notificationsByDocumentId}
                    locale={this.props.locale}
                    markNotificationAsRead={this.markNotificationAsRead}
                    selectedDocumentIds={this.props.selectedDocumentIds}
                    onDocumentSelected={this.props.actions.toggleSelectedDocument}
                  />
                }
              </Tab>
              <Tab active={selectedTabId === 'files'}>
                <div className="row mb-2">
                  <Button primary type="button" className="ml-2" onClick={this.handleAddFile}>
                    {this.message('import-files')}
                  </Button>
                  <Button primary type="button" disabled={!this.props.canEditFiles} className="ml-2" onClick={this.handleEditFiles}>
                    {this.message('edit', 'common')}
                  </Button>
                  <input type="file" className="d-none" id="inputfile" ref="fileInput" multiple onChange={this.handleFilesSelected} />
                </div>

                {this.props.documents && this.props.documents.length > 0 &&
                  <FileList
                    files={this.props.files}
                    message={this.message}
                    notificationsByFileId={notificationsByFileId}
                    locale={this.props.locale}
                    markNotificationAsRead={this.markNotificationAsRead}
                    selectedFileIds={this.props.selectedFileIds}
                    onFileSelected={this.props.actions.toggleSelectedFile}
                  />
                }
              </Tab>
            </Tabs>
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

    originOptionsById: ClientFormSelectors.getClientFormOriginOptions(state),
    messageOptionsById: ClientFormSelectors.getClientFormMessageOptions(state),
    organismRoleList: getOrganismRoleOptions(state),

    formsById: FormSelectors.getEntities(state),
    formOptionList: FormSelectors.getClientCreatableFormOptionList(state),
    selectedFormId: ClientSelectors.getSelectedFormId(state),

    documents: ClientSelectors.getClientDocumentsOrderByDate(state),

    files: ClientSelectors.getClientFilesOrderedByDate(state),
    selectedFileIds: ClientSelectors.getSelectedFileIds(state),
    selectedFiles: ClientSelectors.getSelectedFiles(state),
    canEditFiles: ClientSelectors.canEditFiles(state),

    evolutionNotes: ClientSelectors.getClientNotesOrderByDate(state),

    selectedTabId: ClientSelectors.getSelectedTabId(state),
    notificationsByNoteId: ClientSelectors.getNotificationsByNoteId(state),
    notificationsByDocumentId: ClientSelectors.getNotificationsByDocumentId(state),
    notificationsByFileId: ClientSelectors.getNotificationsByFileId(state),
    notificationsByTargetId: ClientSelectors.getNotificationsByTargetId(state),
    locale: getLocale(state)
  }
  return props
}

ViewClientPage.propTypes = {
  client: PropTypes.object,
  feedSubscription: PropTypes.object,
  user: PropTypes.object.isRequired,

  originOptionsById: PropTypes.object.isRequired,
  messageOptionsById: PropTypes.object.isRequired,
  organismRoleList: PropTypes.array.isRequired,

  formOptionList: PropTypes.array.isRequired,
  formsById: PropTypes.object.isRequired,
  selectedFormId: PropTypes.string,

  documents: PropTypes.array.isRequired,

  files: PropTypes.array.isRequired,
  selectedFileIds: PropTypes.array.isRequired,
  selectedFiles: PropTypes.array.isRequired,
  canEditFiles: PropTypes.bool.isRequired,

  evolutionNotes: PropTypes.array.isRequired,

  selectedTabId: PropTypes.string.isRequired,
  notificationsByNoteId: PropTypes.object.isRequired,
  notificationsByDocumentId: PropTypes.object.isRequired,
  notificationsByFileId: PropTypes.object.isRequired,
  notificationsByTargetId: PropTypes.object.isRequired,

  locale: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired
}

const ConnectedViewClientPage = connect(mapStateToProps, mapDispatchToProps)(ViewClientPage)

export default ConnectedViewClientPage
