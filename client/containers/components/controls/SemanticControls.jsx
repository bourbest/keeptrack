import React from 'react'
import PropTypes from 'prop-types'
import {find, omit} from 'lodash'

export const Form = ({classNames = '', children, ...otherProps}) => (
  <form className={'ui form ' + classNames} {...otherProps}>
    {children}
  </form>
)

Form.propTypes = {
  children: PropTypes.any,
  classNames: PropTypes.string
}

export const Button = ({classNames, size, loading, primary, secondary, children, ...otherProps}) => {
  const classes = ['ui button']
  if (primary) classes.push('primary')
  else if (secondary) classes.push('secondary')

  if (classNames) classes.push(classNames)

  if (loading) classes.push('loading')

  if (size) classes.push(size)

  return (
    <button className={classes.join(' ')} {...otherProps}>
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.any,
  classNames: PropTypes.string,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  loading: PropTypes.bool,
  size: PropTypes.string
}

const numbers = [
  '',
  'one column',
  'two column',
  'three column',
  'four column'
]

export const Grid = ({classNames, children, columns, ...otherProps}) => {
  const classes = ['ui grid']
  if (classNames) classes.push(classNames)
  if (columns) classes.push(numbers[columns])
  return (
    <div className={classes.join(' ')} {...otherProps}>
      {children}
    </div>
  )
}

Grid.propTypes = {
  children: PropTypes.any,
  classNames: PropTypes.string,
  columns: PropTypes.number
}

export const Column = ({classNames = '', children, ...otherProps}) => (
  <div className={'column ' + classNames} {...otherProps}>
    {children}
  </div>
)
Column.propTypes = {
  children: PropTypes.any,
  classNames: PropTypes.string
}
Grid.Column = Column

export const Field = ({classNames = '', children, ...otherProps}) => (
  <div className={'field ' + classNames} {...otherProps}>
    {children}
  </div>
)

Field.propTypes = {
  children: PropTypes.any,
  classNames: PropTypes.string
}

export class Dropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = {isOpen: false}
    this.toggle = this.toggle.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  toggle () {
    this.setState({isOpen: !this.state.isOpen})
  }

  handleClick (event) {
    const e = {
      target: {
        value: event.target.dataset.value,
        name: this.props.name
      }
    }
    this.props.onChange(e)
    this.setState({isOpen: false})
  }

  render () {
    const {value, options, header, className, ...otherProps} = this.props
    const dropdownClasses = ['ui item dropdown']
    if (this.state.isOpen) dropdownClasses.push('active visible')
    if (className) dropdownClasses.push(className)

    const menuClasses = ['menu transition']
    if (this.state.isOpen) menuClasses.push('visible')

    const selectedOption = find(options, {value})
    const text = selectedOption ? selectedOption.text : ''

    const otherDivProps = omit(otherProps, 'onChange')
    return (
      <div role="listbox" aria-expanded={this.state.isOpen} className={dropdownClasses.join(' ')} tabIndex="0" {...otherDivProps}>
        <div onClick={this.toggle}>
          <span className="text" role="alert" aria-live="polite">{text}</span>
          <i aria-hidden="true" className="dropdown icon" />
        </div>
        <div className={menuClasses.join(' ')}>
          {header && <div className="header">{header}</div>}
          {options.map(option => (
            <div role="option" className="item" key={option.value} onClick={this.handleClick} data-value={option.value}>{option.text}</div>
          ))}
        </div>
      </div>
    )
  }
}

Dropdown.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  options: PropTypes.array.isRequired,
  header: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func
}

export {default as ConfirmButton} from './ConfirmButton'

export const Icon = ({name, className, ...otherProps}) => (
  <i className={`${name} icon ${className}`} {...otherProps} />
)
Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
}
