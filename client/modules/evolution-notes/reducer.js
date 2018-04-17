import {Actions} from './actions'
import config from './config'

const initialState = {
  client: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_CLIENT:
      return {...state, client: action.client}
  }
  return state
}

export default {
  [config.entityName]: reducer
}
