import React from 'react'
import PropTypes from 'prop-types'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// actions and selectors
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as ReportActions } from '../../modules/reports/actions'

import ReportSelectors from '../../modules/reports/selectors'
import {getLocale} from '../../modules/app/selectors'

// sections tabs components
import {createTranslate} from '../../locales/translate'

const labelNamespace = 'distributionList'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ReportActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class DistributionListPage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate(labelNamespace, this)
  }

  componentWillMount () {
    this.props.actions.fetchDistributionList()
  }

  render () {
    const {isFetching, distributionList} = this.props
    const emails = distributionList.join(', ')
    return (
      <div>
        <h1>{this.message('title')}</h1>
        {isFetching && <div>Loading...</div>}
        {!isFetching && <textarea defaultValue={emails} className="w-100 h-100"></textarea>}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const props = {
    distributionList: ReportSelectors.getDistributionList(state),
    isFetching: ReportSelectors.isFetchingDistributionList(state),
    locale: getLocale(state)
  }
  return props
}

DistributionListPage.propTypes = {
  distributionList: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired
}

const ConnectedDistributionListPage = connect(mapStateToProps, mapDispatchToProps)(DistributionListPage)

export default ConnectedDistributionListPage
