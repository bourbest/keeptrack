import PropTypes from 'prop-types'
import React from 'react'
import {Field} from 'redux-form'
import TextField from './TextField'
import {createTranslate} from '../../../locales/translate'

class AddressField extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('addressControl', this)
  }

  render () {
    const { required, locale } = this.props
    return (
      <div>
        <div className="fields">
          <div className="three wide field">
            <Field name="civicNumber" label={this.message('civicNumber')} required={required} component={TextField} locale={locale} />
          </div>
          <div className="ten wide field">
            <Field name="streetName" label={this.message('streetName')} required={required} component={TextField} locale={locale} />
          </div>
          <div className="three wide field">
            <Field name="app" label={this.message('app')} component={TextField} locale={locale} />
          </div>
        </div>
        <Field name="city" label={this.message('city')} required={required} component={TextField} locale={locale} />
        <Field name="postalCode" label={this.message('postalCode')} required={required} component={TextField} locale={locale} />
      </div>
    )
  }
}

AddressField.propTypes = {
  required: PropTypes.bool,
  locale: PropTypes.string.isRequired
}

export default AddressField
