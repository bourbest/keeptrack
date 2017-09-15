import {createStore, applyMiddleware, compose} from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import rootReducer from './modules/root-reducer'

const sagaMiddleware = createSagaMiddleware()
const devToolsExtension = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : (f) => f

let browserStore = null

// le serveur ne doit pas utiliser cette fonction car le store doit changer avec chaque requête
export const getStore = () => browserStore

export default (initialState = {}) => {
  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(sagaMiddleware),
    devToolsExtension
  ))

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  browserStore = store
  return store
}
