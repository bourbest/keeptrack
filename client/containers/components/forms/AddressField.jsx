import PropTypes from 'prop-types'
import React from 'react'
import {Field} from 'redux-form'
import Input from './Input'
import FieldWrapper from './FormFieldWrapper'
import {createTranslate} from '../../../locales/translate'

class AddressField extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('addressControl', this)
  }

  render () {
    const { required, locale } = this.props
    return [
      <div className="row" key="street">
        <div className="col-2">
          <Field
            name="civicNumber"
            label={this.message('civicNumber')}
            required={required}
            component={FieldWrapper}
            InputControl={Input}
            locale={locale}
          />
        </div>
        <div className="col-8">
          <Field
            name="streetName"
            label={this.message('streetName')}
            required={required}
            component={FieldWrapper}
            InputControl={Input}
            locale={locale}
          />
        </div>
        <div className="col-2">
          <Field
            name="app"
            label={this.message('app')}
            component={FieldWrapper}
            InputControl={Input}
            locale={locale}
          />
        </div>
      </div>,
      <div key="city" className="row">
        <div className="col-md-8">
          <Field name="city" label={this.message('city')} required={required} component={FieldWrapper} InputControl={Input} locale={locale} />
        </div>
        <div className="col-md-4">
          <Field name="postalCode" label={this.message('postalCode')} required={required} component={FieldWrapper} InputControl={Input} maxLength={7} locale={locale} />
        </div>
      </div>
    ]
  }
}

AddressField.propTypes = {
  required: PropTypes.bool,
  locale: PropTypes.string.isRequired
}

export default AddressField
