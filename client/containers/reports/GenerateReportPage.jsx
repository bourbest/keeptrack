import React from 'react'
import PropTypes from 'prop-types'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// sections tabs components
import { FormError } from '../components/forms/FormError'
import {createTranslate} from '../../locales/translate'

// actions and selectors
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as ReportActions } from '../../modules/reports/actions'
import { ActionCreators as FormTemplateActions } from '../../modules/form-templates/actions'

import ReportSelectors from '../../modules/reports/selectors'
import {getLocale} from '../../modules/app/selectors'

import ReportParametersForm from './components/ReportParametersForm'
import { formatDate } from '../../services/string-utils'
import {buildUrl} from '../../services/url-utils'
import Toolbar from '../components/Toolbar/Toolbar'

const labelNamespace = 'generateReport'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ReportActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch),
    formTemplateActions: bindActionCreators(FormTemplateActions, dispatch)
  }
}

class GenerateReportPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.message = createTranslate(labelNamespace, this)
  }

  componentWillMount () {
    const currentYear = new Date().getFullYear()
    const fromDate = new Date(`${currentYear}-01-01`)
    const toDate = new Date(`${currentYear}-12-31`)
    this.props.actions.setReportParameters({
      formTemplateId: null,
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate)
    })

    this.props.formTemplateActions.fetchList()
  }

  render () {
    const {error, locale, formTemplateOptionList, canGenerate} = this.props

    return (
      <div>
        <Toolbar title={this.message('title')} />
        <FormError error={error} locale={locale} />

        <ReportParametersForm
          locale={locale}
          formTemplateOptionList={formTemplateOptionList}
        />

        {!canGenerate && <button className="btn btn-primary" disabled>{this.message('generate')}</button>}
        {canGenerate && <a className="btn btn-primary" href={this.props.reportUrl} disabled={!this.props.canGenerate}>{this.message('generate')}</a>}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const reportParams = ReportSelectors.getParameterValues(state)
  const props = {
    canGenerate: ReportSelectors.isValid(state),
    formTemplateOptionList: ReportSelectors.getFormTemplateOptionList(state),
    error: ReportSelectors.getSubmitError(state),
    locale: getLocale(state),
    reportUrl: buildUrl('/api/reports/generate', reportParams)
  }

  return props
}

GenerateReportPage.propTypes = {
  canGenerate: PropTypes.bool.isRequired,
  formTemplateOptionList: PropTypes.array.isRequired,
  error: PropTypes.object,
  locale: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  reportUrl: PropTypes.string.isRequired
}

const ConnectedGenerateReportPage = connect(mapStateToProps, mapDispatchToProps)(GenerateReportPage)

export default ConnectedGenerateReportPage
