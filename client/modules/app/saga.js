import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import {toastr} from 'react-redux-toastr'
import { getLocale, getService } from './selectors'
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

    case Actions.LOAD_LISTS:
      const svc = yield select(getService, 'list-options')
      const response = yield call(svc.list)
      yield put(ActionCreators.setListsOptions(response.entities))
      break

    default:
      throw new Error('Unsupported trigger action in app saga', action)
  }
}

export default [
  takeEvery(Actions.NOTIFY, appSaga),
  takeLatest(Actions.LOAD_LISTS, appSaga)
]
