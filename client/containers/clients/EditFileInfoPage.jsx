import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// sections components
import EditFileInfoForm from './components/EditFileInfoForm'
import {Button} from '../components/controls/SemanticControls'
import { FormError } from '../components/forms/FormError'
import {createTranslate} from '../../locales/translate'

// actions and selectors
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as UploadedFileActions } from '../../modules/uploaded-files/actions'
import UploadedFileSelectors from '../../modules/uploaded-files/selectors'
import {getLocale} from '../../modules/app/selectors'

const labelNamespace = 'editFileInfo'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(UploadedFileActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class EditFileInfoPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.message = createTranslate(labelNamespace, this)
  }

  handleSubmit () {
    const notify = this.props.appActions.notify

    this.props.actions.updateFilesInfo(this.props.filesForm.files, (files) => {
      browserHistory.goBack()
      notify('common.save', 'common.saved')
    })
  }

  handleCancel () {
    browserHistory.goBack()
  }

  render () {
    const {canSave, error, locale, filesForm, progresses} = this.props

    return (
      <div>
        <h1>{this.message('title')}</h1>
        <FormError error={error} locale={locale} />
        <EditFileInfoForm
          locale={locale}
          progresses={progresses}
          files={filesForm.files}
        />
        <Button disabled={!canSave} onClick={this.handleSubmit} primary className="mr-2">
          {this.message('save', 'common')}
        </Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const props = {
    filesForm: UploadedFileSelectors.getFilesForm(state),
    progresses: UploadedFileSelectors.getUploadProgresses(state),
    canSave: UploadedFileSelectors.canSaveFileInfo(state),
    error: UploadedFileSelectors.getFileInfoError(state),
    locale: getLocale(state)
  }
  return props
}

EditFileInfoPage.propTypes = {
  filesForm: PropTypes.object.isRequired,
  progresses: PropTypes.array.isRequired,
  canSave: PropTypes.bool.isRequired,
  error: PropTypes.object,
  locale: PropTypes.string.isRequired
}

const ConnectedFileInfoPage = connect(mapStateToProps, mapDispatchToProps)(EditFileInfoPage)

export default ConnectedFileInfoPage
