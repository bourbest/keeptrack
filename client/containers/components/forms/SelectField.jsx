import React from 'react'
import { object, string, arrayOf, oneOfType, array, bool, func } from 'prop-types'
import { Form } from 'semantic-ui-react'
import { FieldError } from './FieldError'
import FormLabel from './FormLabel'
const SemanticField = Form.Field

import { map, get, orderBy, omit } from 'lodash'

class SelectField extends React.PureComponent {

  constructor (props) {
    super(props)
    this.state = {
      values: []
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
    const filteredValues = omit(props.values, props.omit)
    let values = map(filteredValues, (pk) => {
      return {
        id: get(pk, idKey),
        text: get(pk, textKey)
      }
    })

    values = orderBy(values, 'text')

    if (props.noSelectionValue) {
      values.unshift({
        id: props.noSelectionValue,
        text: props.noSelectionText
      }
      )
    }

    this.setState({ values })
  }

  componentWillMount () {
    this.initializeList(this.props)
  }

  componentWillReceiveProps (nextProps) {
    const mustRefreshState = this.props.values !== nextProps.values ||
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
    const { input, label, locale, disabled, required, isFieldRequired, meta: { touched, error, warning } } = this.props
    const hasMsg = error || warning
    const values = this.state.values
    const isRequired = required || (isFieldRequired && isFieldRequired(input.name))
    const selectProps = {...input, disabled}
    return (
      <SemanticField>
        <FormLabel rquired={isRequired}>{label}</FormLabel>
        {touched && hasMsg && <FieldError locale={locale} error={error} isWarning={warning} />}
        <div>
          <select {...selectProps}>
            {map(values, (valueItem) => (
              <option key={valueItem.id} value={valueItem.id}>{valueItem.text}</option>
            ))}
          </select>
        </div>
      </SemanticField>
    )
  }
}

SelectField.propTypes = {
  input: object.isRequired,
  label: string,
  meta: object,
  values: oneOfType([object, arrayOf(object)]).isRequired,
  locale: string.isRequired,
  idProperty: string,
  textProperty: string,
  textPropertyByLocale: bool,
  noSelectionValue: string,
  noSelectionText: string,
  omit: array,
  isFieldRequired: func
}

SelectField.defaultProps = {
  idProperty: 'id',
  textProperty: 'names',
  textPropertyByLocale: true,
  noSelectionValue: ' ',
  noSelectionText: '',
  omit: []
}

export default SelectField
