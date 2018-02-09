import React from 'react'
const { func, string, bool } = React.PropTypes

class ContentEditable extends React.Component {
  constructor (props) {
    super(props)

    this.onKeyDown = this.onKeyDown.bind(this)
    this.onInputChanged = this.onInputChanged.bind(this)
    this.commitChange = this.commitChange.bind(this)
    this.beginEdit = this.beginEdit.bind(this)
    this.onBlur = this.onBlur.bind(this)

    this.state = {
      isEditing: false,
      initialValue: props.value,
      currentValue: props.value
    }
  }

  beginEdit () {
    const evt = {
      target: {
        name: this.props.name
      }
    }
    const ctrl = this
    if (this.props.onEditStarted) {
      this.props.onEditStarted(evt)
    }
    this.setState({isEditing: true}, function () { ctrl.refs.input.focus() })
  }

  onBlur (event) {
    this.commitChange()
    this.setState({isEditing: false})
  }

  commitChange () {
    const changeEvent = {
      target: {
        name: this.props.name,
        value: this.state.currentValue
      }
    }

    this.props.onEditEnded(changeEvent)
  }

  onInputChanged (event) {
    this.setState({currentValue: event.target.value})
  }

  componentWillReceiveProps (nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        initialValue: nextProps.value || '',
        currentValue: nextProps.value || ''
      })
    }
  }

  onKeyDown (e) {
    const key = e.keyCode || e.charCode  // ie||others
    const ctrl = this

    if (key === 27) {
      this.setState({currentValue: this.state.initialValue}, () => ctrl.refs.input.blur())
    } else if (key === 13) {
      if (this.props.resetOnEnter === false) {
        this.refs.input.blur()
      } else {
        this.commitChange()
        this.setState({
          initialValue: '',
          currentValue: ''
        })
      }
    }
  }

  render () {
    const style = this.state.isEditing ? {} : {display: 'none'}
    let spanClass = this.props.className
    let value = this.props.value
    if (!this.props.value || this.props.value === '') {
      value = this.props.placeholder || ''
      spanClass += ' placeholder'
    }

    return (
      <span>
        <input name={this.props.name} type="text" value={this.state.currentValue} className={this.props.className} style={style}
          onChange={this.onInputChanged} onKeyDown={this.onKeyDown} onBlur={this.onBlur} autoComplete="off"
          ref='input' />

        {!this.state.isEditing &&
          <span className={spanClass} onClick={this.beginEdit}>{value}</span>
        }
      </span>
    )
  }
}

ContentEditable.propTypes = {
  name: string,
  value: string,
  className: string,
  onEditEnded: func.isRequired,
  placeholder: string,
  onEditStarted: func,
  resetOnEnter: bool
}

ContentEditable.defaultProps = {
  resetOnEnter: false,
  className: ''
}

export default ContentEditable
