const actionPrefix = 'CLIENT_FILE/'

import { isArray, keyBy, indexOf, concat, without } from 'lodash'

// Action names
export const Actions = {
  SET_FILTER: `${actionPrefix}SET_FILTER`,

  FETCH_FILES: `${actionPrefix}FETCH_FILES`,
  SET_FETCHING: `${actionPrefix}SET_FETCHING`,
  SET_FETCH_ERROR: `${actionPrefix}SET_FETCH_ERROR`,
  SET_FILES: `${actionPrefix}SET_FILES`,

  TOGGLE_SELECTED_ITEM: `${actionPrefix}TOGGLE_SELECTED_ITEM`,
  CLEAR_SELECTED_ITEMS: `${actionPrefix}CLEAR_SELECTED_ITEMS`,

  LOAD_EDITED_FILE: `${actionPrefix}LOAD_EDITED_FILE`,
  SET_EDITED_FILE: `${actionPrefix}SET_EDITED_FILE`,
  UPDATE_EDITED_FILE: `${actionPrefix}UPDATE_EDITED_FILE`,
  CLEAR_EDITED_FILE: `${actionPrefix}CLEAR_EDITED_FILE`,

  CREATE_FILE: `${actionPrefix}CREATE_FILE`,
  UPDATE_FILE: `${actionPrefix}UPDATE_FILE`,

  DELETE_FILES: `${actionPrefix}DELETE_FILES`
}

export const ActionCreators = {
  setFilter: (filterValue) => ({ type: Actions.SET_FILTER, filterValue }),

  fetchFiles: (id) => ({ type: Actions.FETCH_FILES, id }),
  setFiles: (files, replace) => ({ type: Actions.SET_FILES, files, replace }),
  setFetching: (isFetching) => ({ type: Actions.SET_FETCHING, isFetching }),
  setFetchError: (error) => ({ type: Actions.SET_FETCH_ERROR, error }),

  toggleSelectedItem: (id) => ({type: Actions.TOGGLE_SELECTED_ITEM, id}),
  clearSelectedItems: () => ({type: Actions.CLEAR_SELECTED_ITEMS}),

  loadEditedFile: (id) => ({ type: Actions.LOAD_EDITED_FILE, id }),
  setEditedFile: (file) => ({ type: Actions.SET_EDITED_FILE, file }),
  updateEditedFile: (update) => ({ type: Actions.UPDATE_EDITED_FILE, update }),
  clearEditedFile: () => ({ type: Actions.CLEAR_EDITED_FILE }),

  createFile: (file) => ({ type: Actions.CREATE_FILE, file }),
  updateFile: (file) => ({ type: Actions.UPDATE_FILE, file }),

  deleteFiles: (remoteIds) => ({ type: Actions.DELETE_FILES, remoteIds })
}

const initialState = {
  fetching: false,
  filesById: {},
  filterValue: '',
  editedFile: {},
  selectedItemIds: []
}

export default function clientFileReducer (state = initialState, action = {}) {
  switch (action.type) {
    case Actions.SET_FILTER:
      return Object.assign({}, state, {filterValue: action.filterValue})

    case Actions.SET_FETCHING:
      return {...state, fetching: action.isFetching}

    case Actions.SET_FETCH_ERROR:
      return {...state, fetching: false}

    case Actions.SET_FILES:
      const fileArray = isArray(action.files) ? action.files : [action.files]
      const newFiles = keyBy(fileArray, (f) => (f.id))
      let filesById

      if (action.replace === true) {
        filesById = newFiles
      } else {
        filesById = {...state.filesById, ...newFiles}
      }

      return {...state, filesById}

    case Actions.TOGGLE_SELECTED_ITEM:
      let selectedItemIds
      const idx = indexOf(state.selectedItemIds, action.id)
      if (idx >= 0) {
        selectedItemIds = without(state.selectedItemIds, action.id)
      } else {
        selectedItemIds = concat(state.selectedItemIds, action.id)
      }

      return {...state, selectedItemIds}

    case Actions.CLEAR_SELECTED_ITEMS:
      return {...state, selectedItemIds: []}

    case Actions.SET_EDITED_FILE:
      return {...state, editedFile: {...action.file}}

    case Actions.UPDATE_EDITED_FILE:
      return {...state, editedFile: {...state.editedFile, ...action.update}}

    case Actions.CLEAR_EDITED_FILE:
      return {...state, editedFile: {}}

    default:
      return state
  }
}
