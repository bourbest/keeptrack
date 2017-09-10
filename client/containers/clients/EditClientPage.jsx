import React from 'react'
import { browserHistory } from 'react-router'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'

// sections tabs components
import { FormError } from '../components/forms/FormError'
import TextField from '../components/forms/TextField'
import { Button, Form } from 'semantic-ui-react'
import {createTranslate} from '../../locales/translate'
import Toolbar from '../components/Toolbar'

// actions and selectors
import { ActionCreators as ClientActions } from '../../modules/clients/actions'
import { ActionCreators as AppActions } from '../../modules/app/actions'
import ClientSelectors from '../../modules/clients/selectors'
import { getLocale } from '../../modules/app/selectors'

// module stuff
import validateClient from '../../modules/clients/validate'
import entityConfig from '../../modules/clients/config'
const {entityName} = entityConfig

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class EditClientPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.message = createTranslate('clients', this)
  }
  componentWillMount () {
    const id = this.props.params.id || null

    if (id !== 'create') {
      this.props.actions.clearEditedEntity()
      this.props.actions.fetchEditedEntity(id)
    } else {
      this.props.actions.setEditedEntity(ClientSelectors.buildNewClient())
    }
  }

  handleSubmit () {
    const isNew = this.props.isNew
    const method = isNew ? this.props.actions.createEntity : this.props.actions.updateEntity
    const notify = this.props.appActions.notify

    method(this.props.client, (entity) => {
      if (isNew) {
        browserHistory.replace('/clients/' + entity.id)
      }
      browserHistory.push('/clients')
      notify('common.save', 'common.saved')
    })
  }

  render () {
    if (this.props.isLoading || !this.props.client) {
      return null
    }

    const {valid, error, pristine, submitting, locale, isNew} = this.props
    const titleLabelKey = isNew ? 'create-title' : 'edit-title'
    const style = {width: '1000px'}

    return (
      <div>
        <Toolbar title={this.message(titleLabelKey)} backTo={'/clients'}>
          <Button primary onClick={this.handleSubmit} disabled={pristine || submitting || !valid}>
            {this.message('save', 'common')}
          </Button>
        </Toolbar>
        <FormError error={error} locale={locale} />
        <Form style={style}>
          <Field name="lastName" label={this.message('lastName')} required component={TextField} locale={locale} />
          <Field name="firstName" label={this.message('firstName')} required component={TextField} locale={locale} />
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const props = {
    client: ClientSelectors.getEditedEntity(state),
    locale: getLocale(state)
  }
  props.isNew = props.client && !props.client.id
  return props
}

EditClientPage.propTypes = {
  client: React.PropTypes.object,
  locale: React.PropTypes.string.isRequired,

  params: React.PropTypes.object.isRequired,

  pristine: React.PropTypes.bool,
  submitting: React.PropTypes.bool,
  error: React.PropTypes.string,
  valid: React.PropTypes.bool
}

const PageForm = reduxForm({
  form: entityName,
  validate: validateClient
})(EditClientPage)

const PageConnected = connect(mapStateToProps, mapDispatchToProps)(PageForm)
export default PageConnected
