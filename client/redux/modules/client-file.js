const actionPrefix = 'CLIENT_FILE/'

import { isArray, keyBy, omit } from 'lodash'

// Action names
export const Actions = {
  SET_FILTER: `${actionPrefix}SET_FILTER`,
  FETCH_FILES: `${actionPrefix}FETCH_FILES`,
  SET_FILES: `${actionPrefix}SET_FILES`,

  LOAD_EDITED_FILE: `${actionPrefix}LOAD_EDITED_FILE`,
  SET_EDITED_FILE: `${actionPrefix}SET_EDITED_FILE`,
  UPDATE_EDITED_FILE: `${actionPrefix}UPDATE_EDITED_FILE`,
  CLEAR_EDITED_FILE: `${actionPrefix}CLEAR_EDITED_FILE`,

  CREATE_FILE: `${actionPrefix}CREATE_FILE`,
  UPDATE_FILE: `${actionPrefix}UPDATE_FILE`,
  DELETE_FILES: `${actionPrefix}DELETE_FILES`,

  SET_FETCHING: `${actionPrefix}SET_FETCHING`,
  SET_FETCH_ERROR: `${actionPrefix}SET_FETCH_ERROR`
}

export const ActionCreators = {
  setFilter: (filterValue) => ({ type: Actions.SET_FILTER, filterValue }),
  fetchFiles: (id) => ({ type: Actions.FETCH_FILES, id }),
  setFiles: (files) => ({ type: Actions.SET_FILES, files }),

  setFetching: (isFetching) => ({ type: Actions.SET_FETCHING, isFetching }),
  setFetchError: (error) => ({ type: Actions.SET_FETCH_ERROR, error }),

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
  editedFile: {}
}

export default function clientFileReducer (state = initialState, action = {}) {
  switch (action.type) {
    case Actions.SET_FILTER:
      return Object.assign({}, state, {filterValue: action.filterValue})

    case Actions.FETCH_FILES:
      return {...state, fetching: true}

    case Actions.SET_FILES:
      const fileArray = isArray(action.files) ? action.files : [action.files]
      const filesById = keyBy(fileArray, (f) => (f.id))
      return {...state, fetching: false, filesById: {...state.filesById, ...filesById}}

    case Actions.SET_EDITED_FILE:
      return {...state, editedFile: {...action.file}}

    case Actions.UPDATE_EDITED_FILE:
      return {...state, editedFile: {...state.editedFile, ...action.update}}

    case Actions.CLEAR_EDITED_FILE:
      return {...state, editedFile: {}}

    case Actions.SET_FETCH_ERROR:
      return {...state, fetching: false}

    case Actions.DELETE_FILES:
      return {...state, filesById: omit(state.filesById, [...action.remoteIds])}

    default:
      return state
  }
}
