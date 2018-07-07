import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { connect } from 'react-redux'
const {string, object} = PropTypes
import { getLocale } from '../modules/app/selectors'
import { browserHistory, Link } from 'react-router'
import {createTranslate} from '../locales/translate'

const mapStateToProps = (state) => {
  return {
    locale: getLocale(state)
  }
}

class ErrorPage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('error-page', this)
  }
  handleGoBack (event) {
    event.preventDefault()
    browserHistory.goBack()
  }
  render () {
    const code = this.props.code || get(this.props.params, 'code') || '404'
    return (
      <div className='error-page'>
        <h2>{this.message('title')}</h2>
        <p><strong>{this.message('message', {code: code})}</strong></p>
        <Link to="/" className="btn">{this.message('home', 'common')}</Link>
        <button className="btn" onClick={this.handleGoBack}>{this.message('back', 'common')}</button>
      </div>
    )
  }

}
ErrorPage.propTypes = {
  code: string,
  params: object
}

export default connect(mapStateToProps, null)(ErrorPage)
