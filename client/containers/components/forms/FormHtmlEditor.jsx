import React, {Component} from 'react'
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
    if (document) {
      this.quill = require('react-quill')
    }
  }

  render () {
    const Quill = this.quill
    if (!Quill) return null // we're on the server

    const { input, meta, label, isRequired, locale } = this.props
    const hasMsg = meta.error || meta.warning

    return (
      <SemanticField>
        <FormLabel required={isRequired}>{label}</FormLabel>
        {meta.touched && hasMsg && <FieldError locale={locale} error={meta.error} isWarning={meta.warning} />}
        <Quill
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
  input: React.PropTypes.object.isRequired,
  value: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  locale: React.PropTypes.string.isRequired,
  meta: React.PropTypes.object,
  isRequired: React.PropTypes.bool
}

export default FormHtmlEditor
