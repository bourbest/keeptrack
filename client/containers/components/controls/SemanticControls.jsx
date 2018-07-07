import React from 'react'
import PropTypes from 'prop-types'
import {find, omit} from 'lodash'

export const Form = ({classNames = '', children, ...otherProps}) => (
  <form className={classNames} {...otherProps}>
    {children}
  </form>
)

Form.propTypes = {
  children: PropTypes.any,
  classNames: PropTypes.string
}

export const Button = ({className, primary, secondary, children, ...otherProps}) => {
  const classes = ['btn']
  if (primary) classes.push('btn-primary')
  else if (secondary) classes.push('btn-dark')

  if (className) classes.push(className)

  return (
    <button className={classes.join(' ')} {...otherProps}>
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  primary: PropTypes.bool,
  secondary: PropTypes.bool
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

export const Column = ({className = '', children, columns, ...otherProps}) => {
  const classes = [className]
  if (columns) {
    classes.push('col-' + columns)
  } else {
    classes.push('col')
  }
  return (
    <div className={classes.join(' ')} {...otherProps}>
      {children}
    </div>
  )
}
Column.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  columns: PropTypes.number
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
    const {value, options, className, ...otherProps} = this.props
    const dropdownClasses = ['dropdown']
    if (className) dropdownClasses.push(className)

    const menuClasses = ['dropdown-menu']
    if (this.state.isOpen) menuClasses.push('show')

    const selectedOption = find(options, {value})
    const text = selectedOption ? selectedOption.text : ''

    const otherDivProps = omit(otherProps, 'onChange')
    return (
      <div role="listbox" className={dropdownClasses.join(' ')} tabIndex="0" {...otherDivProps}>
        <button onClick={this.toggle} className="btn dropdown-toggle bg-transparent" type="button" aria-haspopup="true" aria-expanded={this.state.isOpen}>
          {text}
        </button>
        <div className={menuClasses.join(' ')}>
          {options.map(option => (
            <div role="option" className="dropdown-item" key={option.value} onClick={this.handleClick} data-value={option.value}>{option.text}</div>
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
  <i className={`icon-${name} ${className}`} {...otherProps} />
)
Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
}
