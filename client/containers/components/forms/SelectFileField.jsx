import React from 'react'
import PropTypes from 'prop-types'
import { Form, Progress } from 'semantic-ui-react'
import { FieldError } from './FieldError'
import FormLabel from './FormLabel'
import RemovableTag from '../RemovableTag'
import FileInput from 'react-simple-file-input'
import {createTranslate} from '../../../locales/translate'
const SemanticField = Form.Field

class SelectFileField extends React.Component {

  constructor (props) {
    super(props)
    this.message = createTranslate('selectFileControl', this)
    this.showProgressBar = this.showProgressBar.bind(this)
    this.updateProgressBar = this.updateProgressBar.bind(this)
    this.handleFileSelected = this.handleFileSelected.bind(this)
    this.shouldPreventFileUpload = this.shouldPreventFileUpload.bind(this)
    this.handleFileRemoved = this.handleFileRemoved.bind(this)
    this.dispatchChange = this.dispatchChange.bind(this)

    this.state = {
      cancelButtonClicked: false
    }
  }

  dispatchChange (event) {
    this.props.input.onChange(event.fileName)
    this.props.onFileSelected(event)
  }

  handleFileRemoved () {
    this.dispatchChange({
      name: this.props.input.name,
      fileName: null,
      fileContent: null
    })
  }

  shouldPreventFileUpload (file) {
    const {acceptedFileExtensions, maxFileSize} = this.props
    let error = null
    if (acceptedFileExtensions.length > 0 && acceptedFileExtensions.indexOf(file.type) === -1) {
      const validExt = acceptedFileExtensions.join(', ')
      error = this.message('fileTypeError', {acceptedFileExtensions: validExt})
    } else if (file.size > (maxFileSize * 1024)) {
      error = this.message('fileTooBigError', {maxFileSize})
    }

    this.setState({fileError: error})
    return error !== null
  }

  showProgressBar () {
    this.setState({progressBarVisible: true, fileError: null})
  }

  updateProgressBar (event) {
    this.setState({
      progressPercent: (event.loaded / event.total) * 100
    })
  }

  handleFileSelected (event, file) {
    this.setState({progressBarVisible: false})
    this.dispatchChange({
      name: this.props.input.name,
      fileName: file.name,
      fileContent: event.target.result
    })
  }

  render () {
    const { input, label, locale, required } = this.props
    const error = this.state.fileError || this.props.meta.error
    const fileName = input.value

    return (
      <SemanticField>
        <FormLabel required={required}>{label}</FormLabel>
        {error && <FieldError locale={locale} error={error} />}
        {this.state.progressBarVisible && <Progress percent={this.state.progressPercent} />}
        {!this.state.progressBarVisible && fileName && <RemovableTag label={fileName} onRemoveClicked={this.handleFileRemoved} />}
        {!this.state.progressBarVisible && !fileName && <span>{this.message('noFileSelected')}</span>}
        <label>
          <FileInput
            readAs='binary'
            style={{display: 'none'}}

            onLoadStart={this.showProgressBar}
            onLoad={this.handleFileSelected}
            onProgress={this.updateProgressBar}

            cancelIf={this.shouldPreventFileUpload}
          />
          {this.message('selectFile')}
        </label>

      </SemanticField>
    )
  }
}

SelectFileField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  meta: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  required: PropTypes.bool,
  maxFileSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  acceptedFileExtensions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFileSelectError: PropTypes.func.isRequired,
  onFileSelected: PropTypes.func.isRequired
}

SelectFileField.defaultProps = {
  maxFileSize: 1024,
  acceptedFileExtensions: []
}

export default SelectFileField
