import config from './config'
import { Actions } from './actions'

const initialState = {
  isFetchingDistributionList: false,
  distributionList: []
}

const reportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_FETCHING_DISTRIBUTION_LIST:
      return {...state, isFetchingDistributionList: action.isFetching}

    case Actions.SET_DISTRIBUTION_LIST:
      return {...state, distributionList: action.distributionList}
  }
  return state
}

export default {
  [config.entityName]: reportsReducer
}
