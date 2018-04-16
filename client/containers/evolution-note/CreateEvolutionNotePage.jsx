import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

// actions and selectors
import {ActionCreators as AppActions} from '../../modules/app/actions'
import {ActionCreators as NoteActions} from '../../modules/evolution-notes/actions'
import NoteSelectors from '../../modules/evolution-notes/selectors'
import {getLocale} from '../../modules/app/selectors'
import config from '../../modules/evolution-notes/config'
import validateNote from '../../modules/evolution-notes/validate'

// sections tabs components
import {createTranslate} from '../../locales/translate'
import FormHtmlEditor from '../components/forms/FormHtmlEditor'
import {TextField, FormLabel} from '../components/forms'
import SelectClientField from '../components/forms/SelectClientField'
import {Form, Button} from 'semantic-ui-react'
import {Field, reduxForm} from 'redux-form'
import ClientFullName from '../clients/components/ClientFullName'
import AddressTile from '../components/AddressTile'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(NoteActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class CreateEvolutionNotePage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.t = createTranslate('evolutionNote', this)
    this.handleSave = this.handleSave.bind(this)
    this.handleClientSelected = this.handleClientSelected.bind(this)
  }

  handleSave () {
    const {actions, appActions, note} = this.props
    actions.saveNote(note, () => {
      appActions.notify('common.save', 'common.saved')
      actions.resetForm()
    })
  }

  handleClientSelected (client) {
    this.props.actions.setClient(client)
  }

  render () {
    const {locale, client} = this.props
    return (
      <div>
        <Form>
          <Field
            label={this.t('client')}
            name="clientId"
            component={SelectClientField}
            required
            locale={locale}
            instanceId="clientId"
            onClientSelected={this.handleClientSelected}
            hidden={client !== null}
          />

          {client &&
            <div className="ui field">
              <FormLabel>{this.t('client')}</FormLabel>
              <ClientFullName client={client} locale={locale} />
              <AddressTile address={client.address} />
            </div>
          }
          <Field
            label={this.t('duration')}
            name="minutes"
            component={TextField}
            locale={locale}
            required />
          <Field
            label="Note"
            name="note"
            component={FormHtmlEditor}
            style={{height: '200px'}}
            locale={locale}
            required />
        </Form>
        <br /><br /><br />
        <Button primary type="button" onClick={this.handleSave} disabled={!this.props.canSave}>{this.t('save', 'common')}</Button>
        <Button type="button" onClick={this.props.actions.resetForm}>{this.t('reset', 'common')}</Button>
      </div>
    )
  }
}

const ConnectedNoteForm = reduxForm({
  form: config.entityName,
  validate: validateNote
})(CreateEvolutionNotePage)

CreateEvolutionNotePage.propTypes = {
  locale: PropTypes.string.isRequired,
  client: PropTypes.object,
  note: PropTypes.object,

  canSave: PropTypes.bool.isRequired,
  error: PropTypes.any
}

const mapStateToProps = (state) => {
  const props = {
    locale: getLocale(state),
    client: NoteSelectors.getSelectedClient(state),
    note: NoteSelectors.getEditedNote(state),

    canSave: NoteSelectors.canSave(state)
  }
  return props
}

const ConnectedCreateEvolutionNotePage = connect(mapStateToProps, mapDispatchToProps)(ConnectedNoteForm)

export default ConnectedCreateEvolutionNotePage
