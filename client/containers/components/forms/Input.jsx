import React from 'react'
import PropTypes from 'prop-types'

const Input = ({className, ...otherProps}) => <input autoComplete="off" className={'form-control ' + className} {...otherProps} />

Input.propTypes = {
  className: PropTypes.string
}

Input.defaultProps = {
  type: 'text'
}

export default Input
