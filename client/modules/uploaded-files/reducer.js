import {Actions} from './actions'
import config from './config'

const initialState = {
  uploadProgresses: []
}

const fileReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.INITIALIZE_UPLOAD_PROGRESSES:
      const p = []
      for (let i = 0; i < action.count; i++) {
        p.push(0)
      }
      return {
        ...state,
        uploadProgresses: p
      }

    case Actions.CLEAR_FILE_TO_UPLOAD_LIST:
      return {
        uploadProgresses: []
      }

    case Actions.UPDATE_UPLOAD_PROGRESS:
      const newState = {
        ...state,
        uploadProgresses: [...state.uploadProgresses]
      }
      newState.uploadProgresses[action.index] = action.progress
      return newState
  }
  return state
}

export default {
  [config.entityName]: fileReducer
}
