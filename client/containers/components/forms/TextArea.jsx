import React from 'react'

export default class TextArea extends React.PureComponent {
  render () {
    const {className, minHeight, input, ...otherProps} = this.props
    const style = {
      minHeight: parseInt(minHeight) || 100
    }
    const classes = ['form-control']

    if (className) classes.push(className)
    return (
      <textarea className={classes.join(' ')} style={style} {...otherProps} {...input} />
    )
  }

}
