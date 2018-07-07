import React from 'react'

export default class TextArea extends React.PureComponent {
  render () {
    const {className, ...otherProps} = this.props
    const classes = ['form-control']
    if (className) classes.push(className)
    return (
      <textarea className={classes.join(' ')} {...otherProps} />
    )
  }

}
