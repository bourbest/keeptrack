import {createStore, applyMiddleware, compose} from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import rootReducer from './modules'

const sagaMiddleware = createSagaMiddleware()
const devToolsExtension = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : (f) => f

export default (initialState = {}) => {
  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(sagaMiddleware),
    devToolsExtension
  ))

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  return store
}
