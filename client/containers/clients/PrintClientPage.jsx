import React from 'react'
import PropTypes from 'prop-types'
import {size, forEach, map, concat} from 'lodash'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// actions and selectors
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as ClientActions } from '../../modules/clients/actions'
import { ActionCreators as DocActions } from '../../modules/client-documents/actions'
import { ActionCreators as FormActions } from '../../modules/form-templates/actions'
import { ActionCreators as SubscriptionActions } from '../../modules/client-feed-subscriptions/actions'
import { ActionCreators as NotfActions } from '../../modules/notifications/actions'
import { ActionCreators as FileActions } from '../../modules/uploaded-files/actions'
import { ActionCreators as ClientLinkActions } from '../../modules/client-links/actions'

import ClientSelectors from '../../modules/clients/selectors'
import ClientFormSelectors from '../../modules/clients/client-form-selectors'
import ClientLinkSelectors from '../../modules/client-links/selectors'
import FormSelectors from '../../modules/form-templates/selectors'
import {getLocale, getOrganismRoleOptions} from '../../modules/app/selectors'

// components
import {createTranslate} from '../../locales/translate'
import ClientView from './components/ClientView'
import EvolutionNoteTile from './components/EvolutionNoteTile'
import PrintableDocument from './components/PrintableDocument'

const labelNamespace = 'clients'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch),
    formActions: bindActionCreators(FormActions, dispatch),
    subscriptionActions: bindActionCreators(SubscriptionActions, dispatch),
    notfActions: bindActionCreators(NotfActions, dispatch),
    fileActions: bindActionCreators(FileActions, dispatch),
    docActions: bindActionCreators(DocActions, dispatch),
    clientLinkActions: bindActionCreators(ClientLinkActions, dispatch)
  }
}

class PrintClientPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.message = createTranslate(labelNamespace, this)
    this.renderDocuments = this.renderDocuments.bind(this)
  }

  componentWillMount () {
    const id = this.props.params.id || null
    this.props.formActions.fetchList({limit: 1000, includeArchived: true})
    this.props.actions.fetchEditedEntity(id)
    this.props.actions.fetchClientForm()
  }

  renderDocuments (documents) {
    return map(documents, doc => (
      <div className="box-fifth mb-3 avoid-break-inside" key={doc.id}>
        <PrintableDocument
          document={doc}
          controlIdsByParentId={this.props.controlIdsByFormAndParentId[doc.formId]}
          controlsById={this.props.controlDictByFormId[doc.formId]}
          formTemplate={this.props.formsById[doc.formId]}
          locale={this.props.locale}
        />
      </div>
    ))
  }

  render () {
    const {locale, client, originOptionsById, messageOptionsById, organismRoleList, formsById} = this.props
    if (!client || size(formsById) === 0) return null
    let renderedDocs = []
    const name = `${client.firstName} ${client.lastName}`
    forEach(this.props.documentsByFormId, documents => {
      renderedDocs - concat(renderedDocs, this.renderDocuments(documents))
    })

    return (
      <div className="mt-2">
        <h1 className="pb-2">{name}</h1>
        <ClientView
          locale={locale}
          client={client}
          originOptionsById={originOptionsById}
          messageOptionsById={messageOptionsById}
          linkedFiles={this.props.linkedFiles}
        />
        <hr />
        <h2>{this.message('evolutionNotes')}</h2>
        <div>
          {this.props.evolutionNotes.map(note => {
            return (
              <div className="box-fifth mb-3 avoid-break-inside" key={note.id}>
                <EvolutionNoteTile
                  evolutionNote={note}
                  organismRoles={organismRoleList}
                  locale={locale}
                  noControls
                />
              </div>
            )
          })}
          {this.props.evolutionNotes.length === 0 &&
            <span>{this.message('noEvolutionNotes')}</span>
          }
        </div>
        {renderedDocs.length > 0 &&
          <h2 className="page-break-before">{this.message('documents')}</h2>
        }
        <div>
          {renderedDocs}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const props = {
    client: ClientSelectors.getEditedEntity(state),
    linkedFiles: ClientLinkSelectors.getLinks(state),

    clientTypesById: ClientFormSelectors.getClientTypeOptions(state),
    originOptionsById: ClientFormSelectors.getClientFormOriginOptions(state),
    messageOptionsById: ClientFormSelectors.getClientFormMessageOptions(state),
    organismRoleList: getOrganismRoleOptions(state),

    formsById: FormSelectors.getEntities(state),
    formOptionList: FormSelectors.getClientCreatableFormOptionList(state),
    controlDictByFormId: FormSelectors.getControlDictByFormId(state),
    controlIdsByFormAndParentId: FormSelectors.getControlIdsByFormIdAndParentId(state),

    documentsByFormId: ClientSelectors.getClientDocumentsGroupedByFormId(state),

    evolutionNotes: ClientSelectors.getClientNotesOrderByDate(state),
    locale: getLocale(state)
  }
  return props
}

PrintClientPage.propTypes = {
  client: PropTypes.object,
  linkedFiles: PropTypes.array.isRequired,

  clientTypesById: PropTypes.object.isRequired,
  originOptionsById: PropTypes.object.isRequired,
  messageOptionsById: PropTypes.object.isRequired,
  organismRoleList: PropTypes.array.isRequired,

  formOptionList: PropTypes.array.isRequired,
  formsById: PropTypes.object.isRequired,
  controlDictByFormId: PropTypes.object.isRequired,
  controlIdsByFormAndParentId: PropTypes.object.isRequired,

  documentsByFormId: PropTypes.object.isRequired,
  evolutionNotes: PropTypes.array.isRequired,

  locale: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired
}

const ConnectedPrintClientPage = connect(mapStateToProps, mapDispatchToProps)(PrintClientPage)

export default ConnectedPrintClientPage
