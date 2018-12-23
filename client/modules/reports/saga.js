import config from './config'
import { Actions, ActionCreators } from './actions'
import {getService} from '../app/selectors'
import { handleError } from '../commonHandlers'

import { call, put, select, takeEvery, all } from 'redux-saga/effects'

// handleError(entityName, error) : must be a global error handler that returns null or an action to perform
function * reportSaga (action) {
  let errorAction = null
  switch (action.type) {
    case Actions.FETCH_DISTRIBUTION_LIST:
      try {
        const [clientSvc] = yield all([
          select(getService, 'clients'),
          put(ActionCreators.setFetchingDistributionList(true))
        ])

        const distributionList = yield call(clientSvc.getDistributionList)
        yield all([
          put(ActionCreators.setDistributionList(distributionList)),
          put(ActionCreators.setFetchingDistributionList(false))
        ])
      } catch (error) {
        errorAction = handleError(config.entityName, error)
      }
      break
  }

  if (errorAction) {
    yield put(errorAction)
  }
}

export default takeEvery([
  Actions.FETCH_DISTRIBUTION_LIST
], reportSaga)
