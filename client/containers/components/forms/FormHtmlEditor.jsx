import React, {Component} from 'react'
import {omit} from 'lodash'
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
    const style = {
      height: parseInt(this.props.minHeight) || 300
    }
    return (
      <div className="pb-4">
        <div className="pb-4">
          <Quill
            modules={QUILL_MODULES}
            formats={QUILL_FORMATS}
            theme="snow"
            className="bg-white"
            style={style}
            {...omit(this.props, ['onBlur', 'minHeight'])}
          />
        </div>
      </div>
    )
  }
}

export default FormHtmlEditor
