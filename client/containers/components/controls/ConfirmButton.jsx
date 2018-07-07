import React from 'react'
import { createTranslate } from '../../../locales/translate'
import {omit} from 'lodash'
import PropTypes from 'prop-types'

class ConfirmButton extends React.Component {
  constructor (props) {
    super(props)
    this.t = createTranslate('common', this)
    this.setConfirmationStatus = this.setConfirmationStatus.bind(this)
    this.handleConfirmation = this.handleConfirmation.bind(this)
    this.state = {confirming: false}
  }
  setConfirmationStatus () {
    this.setState({confirming: true})
    this.timedFunction = setTimeout(() => {
      this.setState({confirming: false})
    }, 4000)
  }

  handleConfirmation (event) {
    this.props.onClick(event)
    clearTimeout(this.timedFunction)
    this.setState({confirming: false})
  }

  render () {
    const otherProps = omit(this.props, 'onClick')
    if (!this.state.confirming) {
      return (
        <button type="button" className="btn" {...otherProps} onClick={this.setConfirmationStatus}>
          {this.props.children}
        </button>
      )
    }

    return (
      <button type='button' className="btn btn-danger" {...otherProps} onClick={this.handleConfirmation}>
        {this.t('confirm', 'common')}
      </button>
    )
  }
}

ConfirmButton.propTypes = {
  locale: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.any
}

export default ConfirmButton
