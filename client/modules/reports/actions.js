const actionPrefix = 'REPORTS/'

export const Actions = {
  FETCH_DISTRIBUTION_LIST: `${actionPrefix}FETCH_DISTRIBUTION_LIST`,
  SET_FETCHING_DISTRIBUTION_LIST: `${actionPrefix}SET_FETCHING_DISTRIBUTION_LIST`,
  SET_DISTRIBUTION_LIST: `${actionPrefix}SET_DISTRIBUTION_LIST`
}

export const ActionCreators = {
  fetchDistributionList: () => ({ type: Actions.FETCH_DISTRIBUTION_LIST }),
  setFetchingDistributionList: (isFetching) => ({ type: Actions.SET_FETCHING_DISTRIBUTION_LIST, isFetching }),
  setDistributionList: (distributionList) => ({ type: Actions.SET_DISTRIBUTION_LIST, distributionList })
}
