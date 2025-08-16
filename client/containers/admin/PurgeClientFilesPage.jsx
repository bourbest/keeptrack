import React from 'react'
import PropTypes from 'prop-types'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// sections tabs components
import {SmartTable, Column, renderLinkToDetail} from '../components/SmartTable'
import Toolbar from '../components/Toolbar/Toolbar'
import ConfirmButton from '../components/controls/ConfirmButton'
import { FormError } from '../components/forms/FormError'
import {createTranslate} from '../../locales/translate'

// actions and selectors
import { ActionCreators as ClientActions } from '../../modules/clients/actions'
import ClientsSelectors from '../../modules/clients/selectors'
import ClientFormSelectors from '../../modules/clients/client-form-selectors'
import {getLocale} from '../../modules/app/selectors'
import { formatDate } from '../../services/string-utils'

const labelNamespace = 'clients'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientActions, dispatch)
  }
}

function rendererLastModifDate (row, name, column, globals) {
  return formatDate(row[name])
}

class PurgeClientFilesPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.message = createTranslate(labelNamespace, this)
  }

  componentWillMount () {
    this.props.actions.getClientsToPurge()
    this.props.actions.fetchClientForm()
  }

  handleSubmit () {
    this.props.actions.purgeClients()
  }

  render () {
    const {error, locale, clientsToPurge} = this.props

    return (
      <div>
        <Toolbar title={this.message('old-files')}>
          <ConfirmButton locale={locale} onClick={this.handleSubmit}>
            Supprimer définitivement
          </ConfirmButton>
        </Toolbar>
        <FormError error={error} locale={locale} />
        {clientsToPurge.length === 0 && <b>Aucun dossier âgé de plus de 7 ans à supprimer</b>}
        {clientsToPurge.length > 0 &&
          <div>
            <b>{clientsToPurge.length} dossiers âgés de plus de 7 ans à supprimer</b>
            <SmartTable
              rows={this.props.clientsToPurge}
              selectable={false}
              location={this.props.location}
              clientTypesById={this.props.clientTypesById}
            >
              <Column name="lastName" label={this.message('lastName')} renderer={renderLinkToDetail} />
              <Column name="firstName" label={this.message('firstName')} renderer={renderLinkToDetail} />
              <Column name="maxModificationDate" label={this.message('lastModification')} renderer={rendererLastModifDate} />
            </SmartTable>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const props = {
    clientTypesById: ClientFormSelectors.getClientTypeOptions(state),
    clientsToPurge: ClientsSelectors.getClientsToPurge(state),
    error: ClientsSelectors.getSubmitError(state),
    locale: getLocale(state)
  }
  return props
}

PurgeClientFilesPage.propTypes = {
  error: PropTypes.object,
  locale: PropTypes.string.isRequired,
  clientsToPurge: PropTypes.array.isRequired,
  clientTypesById: PropTypes.object.isRequired
}

const ConnectedPurgeClientFilesPage = connect(mapStateToProps, mapDispatchToProps)(PurgeClientFilesPage)

export default ConnectedPurgeClientFilesPage
