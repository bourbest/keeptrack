import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form} from 'semantic-ui-react'
import { FieldError } from './FieldError'
import FormLabel from './FormLabel'
const SemanticField = Form.Field

const QUILL_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link'],
    ['clean']
  ]
}

const QUILL_FORMATS = [
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'link'
]

class FormHtmlEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {isLoaded: false}
    this.loadQuill = this.loadQuill.bind(this)
  }
  componentDidMount () {
    this.quill = require('react-quill')
    this.timer = setInterval(this.loadQuill, 200)
  }

  loadQuill () {
    if (this.quill) {
      this.setState({isLoaded: true})
      clearInterval(this.timer)
      this.timer = null
    }
  }

  render () {
    if (!this.state.isLoaded) return null
    const Quill = this.quill
    const { input, meta, label, isRequired, locale } = this.props
    const hasMsg = meta.error || meta.warning

    return (
      <SemanticField>
        <FormLabel required={isRequired}>{label}</FormLabel>
        {meta.touched && hasMsg && <FieldError locale={locale} error={meta.error} isWarning={meta.warning} />}
        <Quill
          style={this.props.style}
          onChange={input.onChange}
          modules={QUILL_MODULES}
          formats={QUILL_FORMATS}
          theme="snow"
          value={input.value}
        />
      </SemanticField>
    )
  }
}

FormHtmlEditor.propTypes = {
  input: PropTypes.object.isRequired,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  meta: PropTypes.object,
  isRequired: PropTypes.bool,
  style: PropTypes.object
}

export default FormHtmlEditor
