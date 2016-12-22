import { createSelector } from 'reselect'
import { filter, keyBy, get } from 'lodash'

export const getClientFileFilter = (state) => state.clientFile.filterValue
export const getClientFiles = (state) => state.clientFile.filesById

export const getCurrentFile = (state, props) => {
  let id = get(props, 'params.id', null)
  if (props.params.id === 'create') {
    return state.clientFile.draft
  } else if (id) {
    return state.clientFile.filesById[id]
  } else {
    return null
  }
}

export const getFilteredClientFiles = createSelector(
  [getClientFiles, getClientFileFilter],
  (clientFiles, filterValue) => {
    filterValue = filterValue || ''
    filterValue = filterValue.toUpperCase()

    let filteredFiles = []
    if (filterValue.length > 0) {
      filteredFiles = filter(clientFiles, (file) => `${file.firstName} ${file.lastName} ${file.fileNo}`.toUpperCase().indexOf(filterValue) >= 0)
      filteredFiles = keyBy(filteredFiles, 'id')
    } else {
      filteredFiles = clientFiles
    }

    return filteredFiles
  })

