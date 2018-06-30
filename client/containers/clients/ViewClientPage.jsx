import React from 'react'
import PropTypes from 'prop-types'
import {browserHistory, Link} from 'react-router'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// actions and selectors
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as ClientActions } from '../../modules/clients/actions'
import { ActionCreators as FormActions } from '../../modules/form-templates/actions'
import ClientSelectors from '../../modules/clients/selectors'
import FormSelectors from '../../modules/form-templates/selectors'
import {getLocale, getOrganismRoleOptions, getOriginOptions} from '../../modules/app/selectors'

// sections tabs components
import Toolbar from '../components/Toolbar/Toolbar'
import BackButton from '../components/Toolbar/BackButton'
import {createTranslate} from '../../locales/translate'
import {Button, Grid} from '../components/controls/SemanticControls'

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
    formActions: bindActionCreators(FormActions, dispatch)
  }
}

class ViewClientPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.message = createTranslate(labelNamespace, this)
    this.handleFormSelected = this.handleFormSelected.bind(this)
    this.handleAddForm = this.handleAddForm.bind(this)
  }

  componentWillMount () {
    const id = this.props.params.id || null
    this.props.formActions.fetchList({limit: 1000})
    this.props.appActions.hideModal()
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

  render () {
    const {locale, client, originOptionList, organismRoleList} = this.props
    if (!client) return null
    const {selectedFormId} = this.props
    const style = {width: '1000px'}
    const clientName = `${client.firstName} ${client.lastName}`
    return (
      <div>
        <Toolbar>
          {<BackButton backTo={baseUrl} />}
          <div className="item section-title">{clientName}</div>
        </Toolbar>

        <div style={style}>
          <div className="ui section">
            <ClientView
              locale={locale}
              client={client}
              originOptionList={originOptionList}
            />
            <div className="ui gird">
              <div className="column">
                <Link to={`/clients/${client.id}/edit`}>Modifier</Link>
              </div>
            </div>
          </div>

          <h3>{this.message('evolutionNotes')}</h3>
          {this.props.evolutionNotes.map(note => [
            <EvolutionNoteTile evolutionNote={note} organismRoles={organismRoleList} key={note.id} />,
            <div className="ui divider" key={`div-${note.id}`} />
          ])}
          {this.props.evolutionNotes.length === 0 &&
            <span>{this.message('noEvolutionNotes')}</span>
          }

          <h3>{this.message('documents')}</h3>
          <Grid columns={2}>
            <Grid.Column>
              <Select
                instanceId="selectForm"
                options={this.props.formOptionList}
                onChange={this.handleFormSelected}
                value={selectedFormId}
                name="selectedFormId"
                placeholder={this.message('selectForm')}
              />
            </Grid.Column>
            <Grid.Column>
              <Button primary type="button" disabled={selectedFormId === null} onClick={this.handleAddForm}>
                {this.message('create', 'common')}
              </Button>
            </Grid.Column>
          </Grid>

          {this.props.documents && this.props.documents.length > 0 &&
            <DocumentList
              documents={this.props.documents}
              formsById={this.props.formsById}
              message={this.message}
            />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const props = {
    client: ClientSelectors.getEditedEntity(state),
    originOptionList: getOriginOptions(state),
    organismRoleList: getOrganismRoleOptions(state),

    formsById: FormSelectors.getEntities(state),
    formOptionList: FormSelectors.getOptionList(state),
    selectedFormId: ClientSelectors.getSelectedFormId(state),
    documents: ClientSelectors.getClientDocumentsOrderByDate(state),
    evolutionNotes: ClientSelectors.getClientNotesOrderByDate(state),

    locale: getLocale(state)
  }
  return props
}

ViewClientPage.propTypes = {
  client: PropTypes.object,
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
