import { createSelector } from 'reselect'
import { filter, keyBy } from 'lodash'

export const getClientFileFilter = (state) => state.clientFile.filterValue
export const getClientFiles = (state) => state.clientFile.filesById

export const getSelectedItemIds = (state) => state.clientFile.selectedItemIds

export const getEditedFile = (state) => state.clientFile.editedFile

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

