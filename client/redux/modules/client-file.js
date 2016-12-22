const actionPrefix = 'CLIENT_FILE/'

import { isArray, keyBy, omit } from 'lodash'

// Action names
export const Actions = {
  SET_FILTER: `${actionPrefix}SET_FILTER`,
  FETCH_FILES: `${actionPrefix}FETCH_FILES`,
  SET_FILES: `${actionPrefix}SET_FILES`,

  CLEAR_DRAFT: `${actionPrefix}CLEAR_DRAFT`,
  CREATE_FILE: `${actionPrefix}CREATE_FILE`,
  UPDATE_FILE: `${actionPrefix}UPDATE_FILE`,
  DELETE_FILES: `${actionPrefix}DELETE_FILES`,

  SET_FETCH_ERROR: `${actionPrefix}SET_FETCH_ERROR`
}

export const ActionCreators = {
  setFilter: (filterValue) => ({ type: Actions.SET_FILTER, filterValue }),
  fetchFiles: (id) => ({ type: Actions.FETCH_FILES, id }),
  setFiles: (files) => ({ type: Actions.SET_FILES, files }),

  setFetchError: (error) => ({ type: Actions.SET_FETCH_ERROR, error }),

  clearDraft: () => ({ type: Actions.CLEAR_DRAFT }),
  createFile: (file) => ({ type: Actions.CREATE_FILE, file }),
  updateFile: (file) => ({ type: Actions.UPDATE_FILE, file }),
  deleteFiles: (remoteIds) => ({ type: Actions.DELETE_FILES, remoteIds })
}

const initialState = {
  fetching: false,
  filesById: {},
  filterValue: '',
  draft: {}
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

    case Actions.CLEAR_DRAFT:
      return {...state, draft: {}}

    case Actions.SET_FETCH_ERROR:
      return {...state, fetching: false}

    case Actions.DELETE_FILES:
      return {...state, filesById: omit(state.filesById, [...action.remoteIds])}

    default:
      return state
  }
}
