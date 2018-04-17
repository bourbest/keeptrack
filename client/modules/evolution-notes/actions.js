import config from './config'
import {createActions} from '../common/actions'
const prefix = config.entityName.toUpperCase()

export const Actions = createActions(prefix, [
  'SAVE_NOTE',
  'SET_CLIENT',
  'RESET_FORM'
])

export const ActionCreators = {
  saveNote: (note, callback) => ({type: Actions.SAVE_NOTE, note, callback}),
  setClient: (client) => ({type: Actions.SET_CLIENT, client}),
  resetForm: () => ({type: Actions.RESET_FORM})
}
