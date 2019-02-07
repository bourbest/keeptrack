import React from 'react'
import { object, string, arrayOf, oneOfType, array, bool } from 'prop-types'
import { map, get, orderBy, omit, filter } from 'lodash'

class Select extends React.PureComponent {

  constructor (props) {
    super(props)
    this.state = {
      options: []
    }

    this.initializeList = this.initializeList.bind(this)
  }

  initializeList (props) {
    const idKey = props.idProperty
    let textKey = null
    if (this.props.textPropertyByLocale) {
      textKey = `${props.textProperty}.${props.locale}`
    } else {
      textKey = `${props.textProperty}`
    }
    const filteredValues = omit(props.options, props.omit)
    let options = map(filteredValues, (pk) => {
      return {
        id: get(pk, idKey).toString(),
        text: get(pk, textKey),
        isArchived: pk.isArchived
      }
    })

    options = orderBy(options, 'text')

    if (props.hasNoSelectionValue) {
      options.unshift({
        id: props.noSelectionValue,
        text: props.noSelectionText
      }
      )
    }

    this.setState({ options })
  }

  componentWillMount () {
    this.initializeList(this.props)
  }

  componentWillReceiveProps (nextProps) {
    const mustRefreshState = this.props.options !== nextProps.options ||
      this.props.locale !== nextProps.locale ||
      this.props.textProperty !== nextProps.textProperty ||
      this.props.idProperty !== nextProps.idProperty ||
      this.props.noSelectionText !== nextProps.noSelectionText ||
      this.props.noSelectionValue !== nextProps.noSelectionValue ||
      this.props.omit !== nextProps.omit

    if (mustRefreshState) {
      this.initializeList(nextProps)
    }
  }

  render () {
    const selectProps = omit(this.props, ['options', 'locale', 'className', 'idProperty', 'textProperty', 'textPropertyByLocale', 'noSelectionValue', 'noSelectionText', 'omit', 'hasNoSelectionValue'])
    const options = filter(this.state.options, option => !option.isArchived || option.id === selectProps.value)
    const classes = 'form-control ' + this.props.className || ''
    return (
      <select {...selectProps} className={classes}>
        {map(options, (valueItem) => (
          <option key={valueItem.id} value={valueItem.id}>{valueItem.text}</option>
        ))}
      </select>
    )
  }
}

Select.propTypes = {
  options: oneOfType([object, arrayOf(object)]).isRequired,
  locale: string.isRequired,
  idProperty: string,
  textProperty: string,
  textPropertyByLocale: bool,
  hasNoSelectionValue: bool,
  noSelectionValue: string,
  noSelectionText: string,
  omit: array
}

Select.defaultProps = {
  idProperty: 'id',
  textProperty: 'label',
  textPropertyByLocale: false,
  hasNoSelectionValue: true,
  noSelectionValue: '',
  noSelectionText: '',
  omit: []
}

export default Select
