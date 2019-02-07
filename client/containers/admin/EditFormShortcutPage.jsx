import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// sections tabs components
import { FormError } from '../components/forms/FormError'
import {createTranslate} from '../../locales/translate'

// actions and selectors
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as FormShortcutActions } from '../../modules/form-shortcut/actions'
import { ActionCreators as FormTemplateActions } from '../../modules/form-templates/actions'
import FormShortcutSelectors from '../../modules/form-shortcut/selectors'
import {getLocale} from '../../modules/app/selectors'

// components
import FormShortcutForm from './components/FormShortcutForm'
import StandardEditToolbar from '../components/behavioral/StandardEditToolbar'

const labelNamespace = 'form-shortcut'
const baseUrl = '/form-shortcuts/'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(FormShortcutActions, dispatch),
    formTemplateActions: bindActionCreators(FormTemplateActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class EditFormShortcutPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.message = createTranslate(labelNamespace, this)
  }

  componentWillMount () {
    const id = this.props.params.id || null

    this.props.formTemplateActions.fetchList()
    this.props.actions.fetchList()

    if (id !== 'create') {
      this.props.actions.clearEditedEntity()
      this.props.actions.fetchEntity(id)
    } else {
      this.props.actions.setEditedEntity(FormShortcutSelectors.buildNewEntity())
    }
  }

  handleSubmit () {
    const isNew = this.props.isNew
    const notify = this.props.appActions.notify

    this.props.actions.saveEntity(this.props.entity, (entity) => {
      if (isNew) {
        browserHistory.replace(baseUrl + entity.id)
      }
      browserHistory.push('/form-shortcuts')
      notify('common.save', 'common.saved')
    })
  }

  render () {
    const {canSave, error, locale, isNew, formTemplateOptions, entity} = this.props
    const titleLabelKey = isNew ? 'create-title' : 'edit-title'
    if (!entity) return null

    return (
      <div>
        <StandardEditToolbar
          title={this.message(titleLabelKey)}
          backTo="/admin"
          onSaveClicked={this.handleSubmit}
          locale={locale}
          location={this.props.location}
          canSave={canSave} />

        <FormError error={error} locale={locale} />

        <FormShortcutForm
          locale={locale}
          formTemplateOptions={formTemplateOptions}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const props = {
    formTemplateOptions: FormShortcutSelectors.getFormTemplateOptions(state),
    entity: FormShortcutSelectors.getEditedEntity(state),
    isNew: FormShortcutSelectors.isNewEntity(state),
    canSave: FormShortcutSelectors.canSaveEditedEntity(state),
    error: FormShortcutSelectors.getSubmitError(state),
    locale: getLocale(state)
  }
  return props
}

EditFormShortcutPage.propTypes = {
  formTemplateOptions: PropTypes.array.isRequired,
  entity: PropTypes.object,
  isNew: PropTypes.bool.isRequired,
  canSave: PropTypes.bool.isRequired,
  error: PropTypes.object,
  locale: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

const ConnectedEditFormShortcutPage = connect(mapStateToProps, mapDispatchToProps)(EditFormShortcutPage)

export default ConnectedEditFormShortcutPage
