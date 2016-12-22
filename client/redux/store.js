import {createStore, applyMiddleware, compose} from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './modules'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()
const devToolsExtension = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : (f) => f

const store = createStore(rootReducer, {}, compose(
  applyMiddleware(sagaMiddleware),
  devToolsExtension
))

sagaMiddleware.run(rootSaga)

export default store
