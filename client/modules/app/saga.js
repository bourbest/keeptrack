import { put, select, takeEvery } from 'redux-saga/effects'
import {omit, size} from 'lodash'
import {toastr} from 'react-redux-toastr'
import { getLocale, getFetchingActions } from './selectors'
import i18next from 'i18next'

import {
  Actions,
  ActionCreators
} from './actions'

function * appSaga (action) {
  const lng = yield select(getLocale)
  switch (action.type) {
    case Actions.NOTIFY:
      const title = i18next.t(action.title, lng)
      const message = i18next.t(action.message, {...action.params, lng})
      if (action.isError) {
        toastr.error(title, message)
      } else {
        toastr.success(title, message)
      }
      break

    default:
      throw new Error('Unsupported trigger action in app saga', action)
  }
}

const allAppSaga = [
  takeEvery(Actions.NOTIFY, appSaga)
]

if (process.env.target === 'server') {
  // eslint-disable-next-line
  function * watchFetchingActions (action) {
    const executingFetchingActions = yield select(getFetchingActions)
    let updated = null
    if (action.isFetching) {
      updated = {...executingFetchingActions}
      updated[action.type] = true
    } else {
      updated = omit(executingFetchingActions, action.type)
    }

    yield put(ActionCreators.setFetchingActions(updated))
    if (size(updated) === 0) {
      yield put(ActionCreators.closeSaga())
    }
  }

  allAppSaga.push(
    takeEvery(action => action.isFetching !== undefined, watchFetchingActions)
  )
}

export default allAppSaga
